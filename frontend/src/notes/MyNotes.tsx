import "./note-styles/MyNotes.css";
import { extractPlainTextFromJSON, type NotePayload } from "./NoteUtils";
import IconButton from "../components/icon-button/IconButton";
import Button from "../components/button/Button";
import Modal from "../components/modal/Modal";
import { useState, useEffect } from "react";
import Card from "../components/card/Card";
import api from "../api";

import { PencilLineIcon, TrashIcon } from "@phosphor-icons/react";

type NoteCardProps = {
    title : string,
    preview : string,
    id : number,
    onDelete : (id: number) => void,
    lastModified : Date
}

function NoteCard(props: NoteCardProps){
    const formattedDate = props.lastModified.toLocaleString("en-GB", {
        year : 'numeric',
        month : 'short',
        day : 'numeric',
        hour : '2-digit',
        minute : '2-digit'
    });

    return(
        <Card className="note-card-container">
            <p>{props.title}</p>

            <div className="note-content-preview">
                {props.preview}
            </div>

            <div className="note-last-modified">
                Last Modified: {formattedDate}
            </div>
            
            <div className="note-actions">
                <Button text="Preview" variant="outlined" to={`/notes/preview/${props.id}/`}/>
                <IconButton icon={PencilLineIcon} to={`/notes/edit/${props.id}/`} tooltip="Edit Note"/>
                <IconButton icon={TrashIcon} onClick={() => {props.onDelete(props.id)}} tooltip="Delete Note"/>
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
    const recentNotesList = [...notes].slice(0, 1);

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

    useEffect(() => {
        getNotes();
    }, []);

    return (
        <div className="note-list-container">

            <div className="recent-notes">
                <div className="recent-notes-header">
                    <h1>Recent Notes</h1>
                </div>

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

            <div className="user-notes">
                <div className="user-notes-header">
                    <h1>My Notes</h1>
                </div>

                <div className="user-notes-list">

                </div>
            </div>

        </div>
    )
}

export default MyNotes