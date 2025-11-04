import type { EditorState, LexicalEditor } from "lexical";
import api from "../api";

export interface NotePayload {
    id : string | null;
    note_title : string,
    note_content : string;
    author ?: number;
}

export function editorToJSON(editor : LexicalEditor) {
    const editorState = editor.getEditorState();
    return JSON.stringify(editorState.toJSON());
}

export function editorStateToJSON(editorState : EditorState) {
    return JSON.stringify(editorState.toJSON());
}

export async function loadNote(noteId: string): Promise<NotePayload | null>{
    try {
        const response = await api.get(`api/notes/${noteId}/`);
        return response.data;
        
    } catch (error) {
        console.log("Failed to load note from API: ", error);
        return null;
    }
}