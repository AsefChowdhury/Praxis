import { $getRoot, createEditor, type EditorState, type LexicalEditor } from "lexical";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import api from "../api";

export interface NotePayload {
    id : string | null;
    note_title : string,
    note_content : string;
    author ?: number;
    updated_at : string
}

const tempConfig = {
    namespace: 'PreviewEditor',
    onError: (error : Error) => {console.log(error)},

    nodes: [
        ListNode,
        ListItemNode,
        HeadingNode,
        QuoteNode
    ],

    theme: {}
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

export function extractPlainTextFromJSON(jsonState: string | null | undefined): string {
    if(!jsonState) return '';

    try {
        const editor = createEditor(tempConfig);
        const editorState = editor.parseEditorState(jsonState);

        let plainText = '';

        editorState.read(() => {
            plainText = $getRoot().getTextContent();
        })

        return plainText;
    } catch (error) {
        console.log("Failed to parse or read lexical JSON for preview", error);
        return '';
    }
}