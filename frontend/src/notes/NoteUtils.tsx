import type { EditorState, LexicalEditor } from "lexical";

export interface NotePayload {
    title : string,
    content : string;
    noteId : string | null;
}

export function editorToJSON(editor : LexicalEditor) {
    const editorState = editor.getEditorState();
    return JSON.stringify(editorState.toJSON());
}

export function editorStateToJSON(editorState : EditorState) {
    return JSON.stringify(editorState.toJSON());
}

export function loadNote(noteId: string): NotePayload | null{
    const data = localStorage.getItem("note_" + noteId);

    if (!data) return null;

    try {
        const parsedData = JSON.parse(data);
        return parsedData;
    } catch (error) {
        console.error("Failed to parse note data from local storage");
        return null;
    }
}