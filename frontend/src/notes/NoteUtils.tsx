import type { EditorState, LexicalEditor } from "lexical";

export interface NotePayload {
    title : string;
    content : string;
    noteId ?: number |  null;
}


export function editorToJSON(editor : LexicalEditor) {
    const editorState = editor.getEditorState();
    return JSON.stringify(editorState.toJSON());
}

export function editorStateToJSON(editorState : EditorState) {
    return JSON.stringify(editorState.toJSON());
}