import "./note-styles/MyNotes.css";
import { DotsThreeVerticalIcon, PencilLineIcon, TrashIcon } from "@phosphor-icons/react";
import { extractPlainTextFromJSON, type NotePayload } from "./NoteUtils";
import { CaretDownIcon } from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import DropdownItem from "../components/dropdown/DropdownItem";
import Dropdown from "../components/dropdown/Dropdown";
import Modal from "../components/modal/Modal";
import Card from "../components/card/Card";
import api from "../api";


type NoteCardProps = {
    title : string,
    preview : string,
    id : number,
    onDelete : (id: number) => void,
    lastModified : Date
}

type dropdownModes = "Delete";


function NoteCard(props: NoteCardProps){
    const modes: dropdownModes[] = ["Delete"];
    const [dropdownAnchor, setDropdownAnchor] = useState<HTMLElement | null>(null);
    const navigate = useNavigate();

    const formattedDate = props.lastModified.toLocaleString("en-GB", {
        year : 'numeric',
        month : 'short',
        day : 'numeric',
        hour : '2-digit',
        minute : '2-digit'
    });

    const handleDropdownToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setDropdownAnchor((prev) => (prev ? null : e.currentTarget));
    }

    const handleModeSelect = (mode: dropdownModes) => {
        setDropdownAnchor(null);

        switch (mode) {
            case "Delete":
                props.onDelete(props.id);
                break;

            default:
                break;
        }
    }

    return(
        <Card className="note-card-container" onClick={() => navigate(`/notes/preview/${props.id}/`)}>
            <div className="note-card-header">
                <div className="note-card-title">
                    {props.title}
                </div>
                
                <div className="note-card-actions">
                    <button 
                        className="note-card-actions-icon" 
                        onClick={handleDropdownToggle}>
                        <DotsThreeVerticalIcon size={20} weight="bold"/>
                    </button>
                    <Dropdown
                        anchor={dropdownAnchor}
                        open={dropdownAnchor !== null}
                        onClose={() => setDropdownAnchor(null)}
                        id="note-card-dropdown"
                        usePortal={true}
                    >
                        {modes.map(mode => (
                            <DropdownItem
                                key={mode}
                                text={mode}
                                onClick={() => handleModeSelect(mode)}
                            />
                        ))}
                    </Dropdown>
                </div>
            </div>

            <div className="note-content-preview">
                {props.preview}
            </div>

            <div className="note-last-modified desktop-only">
                Last Modified: {formattedDate}
            </div>
        </Card>
    )
}

const createPreview = (content: string | null | undefined, contentType: "title" | "note content"): string => {
    let textContent = content ? content.trim() : '';
    
    let maxLength: number;
    if (contentType === "title") {
        maxLength = 20;
    }
    else{
        maxLength = 100;
        textContent = extractPlainTextFromJSON(textContent);
    }

    if (textContent.length === 0) {
        if (contentType === "note content") {
            return 'No content has been added to this note yet.'            
        }
        return '';
    }

    let previewText = textContent.substring(0, maxLength);
    previewText = previewText.trim()
    return previewText + (textContent.length > maxLength ? '...' : '');
}

function MyNotes() {
    const [notes, setNotes] = useState<NotePayload[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState({id: 0, title: undefined});
    const [activeSelection, setActiveSelection] = useState<'Recent' | 'User' | null>(null);

    const recentClass = activeSelection === 'User' ? 'collapsed' : '';
    const userClass = activeSelection === 'Recent' ? 'collapsed' : '';
    const recentNotesList = [...notes].slice(0, 5);
    const allNotesList = [...notes];

    const getNotes = async () => {
        await api
        .get('api/notes/')
        .then(response => {
            setNotes(response.data);
        })
        .catch(error => console.log(error));
    };

    const handleDelete = async (id: number) => {
        await api.delete(`api/notes/${id}/`).catch(error => console.log(error));
        getNotes();
    };

    const handleSelection = (selection: 'Recent' | 'User') => {
        setActiveSelection(prev => (prev === selection ? null : selection));
    };

    useEffect(() => {
        getNotes();
    }, []);


    return (
        <div className="note-list-container">

            <div className={`recent-notes ${recentClass}`}>
                <div className="recent-notes-header" onClick={() => handleSelection('Recent')}>
                    <h2>Recent Notes</h2>
                    <CaretDownIcon className="toggle-icon" size={20}/>
                </div>

                <div className="accordion-panel">
                    <div className="recent-notes-list">
                        {recentNotesList.map(note => (
                            <NoteCard
                                key={note.id as string}
                                id={Number(note.id)}
                                title={createPreview(note.note_title, "title")}
                                preview={createPreview(note.note_content, "note content")}
                                lastModified={new Date(note.updated_at || 0)}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                </div>

            </div>

            <div className={`user-notes ${userClass}`}>
                <div className="user-notes-header" onClick={() => handleSelection('User')}>
                    <h2>My Notes</h2>
                    <CaretDownIcon className="toggle-icon" size={20}/>
                </div>

                <div className="accordion-panel">
                    <div className="user-notes-mobile-scroll">

                        <div className="user-notes-list">
                            {allNotesList.map(note => (
                                <NoteCard
                                    key={note.id as string}
                                    id={Number(note.id)}
                                    title={createPreview(note.note_title, "title")}
                                    preview={createPreview(note.note_content, "note content")}
                                    lastModified={new Date(note.updated_at || 0)}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>

                    </div>
                </div>

            </div>

        </div>
    )
}

export default MyNotes