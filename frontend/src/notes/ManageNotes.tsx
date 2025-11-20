import "./note-styles/ManageNotes.css";
import Toolbar from "../components/Toolbar/Toolbar";
import ContentHeader from "../components/content-header/ContentHeader";
import History from "../components/Toolbar/history/History";
import FontFamily from "../components/Toolbar/font-family/FontFamily";
import Fontsize from "../components/Toolbar/fontsize/Fontsize";
import CoreStyles from "../components/Toolbar/core-styles/CoreStyles";
import ExtendedStyles from "../components/Toolbar/extended-styles/ExtendedStyles";
import ListFormatting from "../components/Toolbar/list-formatting/ListFormatting";
import AlignmentFormats from "../components/Toolbar/alignment-formats/AlignmentFormats";
import SaveStatusDisplay from "../components/Toolbar/save-status-display/SaveStatusDisplay";
import AutoSavePlugin from "../components/plugins/AutoSavePlugin";

import { type NotePayload, loadNote } from "./NoteUtils";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListItemNode, ListNode } from "@lexical/list";
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import api from "../api";

export type saveStatusOptions = "idle" | "saving" | "saved" | "failed";
export type SavePayload = Partial<NotePayload> & {id: string | null};

type EditorUIProps = {
    noteTitle: string;
    nodeId: string | null;
    onTitleChange: (newTitle: string) => void;
    onSave: (payload: SavePayload) => void;
    onIdChange: (newId: string | null) => void;
    saveStatus: saveStatusOptions;
    lastSaved: Date | null;
}

function EditorUI(props: EditorUIProps){
    const [editor] = useLexicalComposerContext();
    const { noteId: id } = useParams();

    useEffect(() => {
        const fetchNote = async () => {
            if (id) {
                const loadedNote = await loadNote(id);
    
                if (loadedNote) {
                    props.onIdChange(loadedNote.id);
                    props.onTitleChange(loadedNote.note_title);
                    editor.update(() => {
                        const newEditorState = editor.parseEditorState(loadedNote.note_content);
                        editor.setEditorState(newEditorState);
                    })
                }
            }
        }

        fetchNote();

    },[id, editor, props.onIdChange, props.onTitleChange]);

    return(
        <div className="editor-ui">
            <ContentHeader 
                title={props.noteTitle} 
                onTitleChange={props.onTitleChange} 
                id={props.nodeId} 
                onSave={props.onSave}
                />
                
            <Toolbar toolbarFeatures={
                <> 
                    <div className="scrollable-toolbar">
                        <History editor={editor}/>
                        <FontFamily editor={editor}/>
                        <Fontsize editor={editor}/>

                        <div className="styling-options">
                            <CoreStyles editor={editor}/>
                            <ExtendedStyles editor={editor}/>
                        </div>

                        <div className="formatting-options">
                            <ListFormatting editor={editor}/>
                            <AlignmentFormats editor={editor}/>
                        </div>

                    </div>

                    <div className="toolbar-save-status">
                        <SaveStatusDisplay saveStatus={props.saveStatus} lastSaved={props.lastSaved}/>
                    </div>
                </>
            }/>
            <ListPlugin/>
            <TabIndentationPlugin/>
            <RichTextPlugin
                contentEditable={<ContentEditable className="note-content"/>}
                placeholder={<div className="placeholder">Enter some text</div>}
                ErrorBoundary={LexicalErrorBoundary}
            />
            <AutoSavePlugin
                onSave={props.onSave}
                noteId={props.nodeId}
                noteTitle={props.noteTitle}
            />    
            <HistoryPlugin/>
        </div>
    )
}

const theme = {
    text: {
        bold: 'editor-textBold',
        italic: 'editor-textItalic',
        underline: 'editor-textUnderline',
        uppercase: 'editor-textUppercase',
        lowercase: 'editor-textLowercase',
        strikethrough: 'editor-textStrikethrough',
    },
    list: {
        ol: 'editor-list-ol',
        ul: 'editor-list-ul',
        listitem: 'editor-listitem',
        nested: {
            listitem: 'editor-nested-listitem'
        }
    }
};

function onError(error:Error): void {
    console.error(error);
}

function ManageNotes() {
    const [noteTitle, setNoteTitle] = useState<string>('Untitled Note');
    const [noteId, setNoteId] = useState<string | null>(null);
    const [saveStatus, setSaveStatus] = useState<saveStatusOptions>("idle");
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const navigate = useNavigate();

    const initialConfig = {
        namespace: 'MyEditor',
        nodes: [
            ListNode,
            ListItemNode
        ],
        theme,
        onError
    }

    const handleNoteSave = useCallback(async (payload: SavePayload) => {
        setSaveStatus("saving");
        const minWait = new Promise(resolve => setTimeout(resolve, 1000));

        try {
            let request;

            if(payload.id === null){
                const createPayload = {
                    note_title: payload.note_title,
                    note_content: payload.note_content
                }

                request = api.post(`api/notes/`, createPayload);
            }
            else{
                const { id, ...updateData} = payload;

                if(Object.keys(updateData).length === 0){
                    setSaveStatus("idle");
                    return;
                }

                request = api.patch(`api/notes/${payload.id}/`, updateData);
            }

            const [response] = await Promise.all([request, minWait]);

            if(payload.id === null){
                const newNote = response.data;
                setNoteId(newNote.id);
                navigate(`/notes/edit/${newNote.id}/`, {replace: true});
            }

            setSaveStatus("saved");
            setLastSaved(new Date());

            setTimeout(() => {
                setSaveStatus("idle");
            }, 2000);
        } catch (error) {
            console.log("Failed to save note:", error);
            setSaveStatus("failed");
        }
    },[navigate]);

    return(
        <div className="note-container">
            <div className="note-content-container">
                <LexicalComposer initialConfig={initialConfig}>
                    <EditorUI 
                        noteTitle={noteTitle}
                        nodeId={noteId}
                        onTitleChange={setNoteTitle}
                        onIdChange={setNoteId}
                        onSave={handleNoteSave}
                        saveStatus={saveStatus}
                        lastSaved={lastSaved}
                    />
                </LexicalComposer>
            </div>
        </div>
    );
};

export default ManageNotes;