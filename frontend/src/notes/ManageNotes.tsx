import "./note-styles/ManageNotes.css";
import Toolbar from "../components/Toolbar/Toolbar";
import ContentHeader from "../components/content-header/ContentHeader";
import { type NotePayload, loadNote } from "./NoteUtils";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListItemNode, ListNode } from "@lexical/list";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

type EditorUIProps = {
    noteTitle: string;
    nodeId: string | null;
    onTitleChange: (newTitle: string) => void;
    onSave: (payload: NotePayload) => void;
    onIdChange: (newId: string | null) => void;
}

function EditorUI(props: EditorUIProps){
    const [editor] = useLexicalComposerContext();
    const { noteId: id } = useParams();

    useEffect(() => {
        if (id) {
            const loadedNote = loadNote(id);

            if (loadedNote) {
                props.onIdChange(loadedNote.noteId);
                props.onTitleChange(loadedNote.title);
                editor.update(() => {
                    const newEditorState = editor.parseEditorState(loadedNote.content);
                    editor.setEditorState(newEditorState);
                })
            }
            else{
            }
        }

    },[id, editor, props.onIdChange, props.onTitleChange]);

    return(
        <>
            <ContentHeader 
                title={props.noteTitle} 
                onTitleChange={props.onTitleChange} 
                id={props.nodeId} 
                onSave={props.onSave}/>
            <Toolbar/>
            <ListPlugin/>
            <TabIndentationPlugin/>
            <RichTextPlugin
                contentEditable={<ContentEditable className="note-content"/>}
                placeholder={<div className="placeholder">Enter some text</div>}
                ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin/>
        </>
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

    const handleNoteSave = (payload: NotePayload) => {
        if (payload.noteId === null) {
            const newId = crypto.randomUUID()
            payload.noteId = newId;
            localStorage.setItem('note_' + newId, JSON.stringify(payload));
            setNoteId(payload.noteId);
            navigate(`/notes/edit/${newId}`), { replace: true };
        }
        else{
            localStorage.setItem('note_' + payload.noteId, JSON.stringify(payload));
        }
    }

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
                    />
                </LexicalComposer>
            </div>
            <div style={{height: '100vh', width: '1px'}}></div>
        </div>
    );
};

export default ManageNotes;