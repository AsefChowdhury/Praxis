import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef } from "react";
import {type  NotePayload, editorStateToJSON } from "../../notes/NoteUtils";

type AutoSavePluginProps = {
    noteId: string | null;
    noteTitle: string;
    onSave: (payload: NotePayload) => void;
}

function AutoSavePlugin({ onSave, noteId, noteTitle } : AutoSavePluginProps) {
    const [editor] = useLexicalComposerContext();
    const debounceTimerRef = useRef<number | null>(null);
    const safetyTimerRef = useRef<number | null>(null);
    let latestDocRef = useRef<string | null>(null);

    useEffect(() => {
        const performSave = () => {
            let content = latestDocRef.current;
            if(content === null) return;

            let newNotePayload: NotePayload = {
                id: noteId,
                note_title: noteTitle,
                note_content: content
            }

            onSave(newNotePayload);

            if(debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
            if(safetyTimerRef.current) clearTimeout(safetyTimerRef.current)
            
            debounceTimerRef.current = null;
            safetyTimerRef.current = null;
        }

        return editor.registerUpdateListener(({ editorState}) => {
            latestDocRef.current = editorStateToJSON(editorState);

            if(debounceTimerRef.current){
                clearTimeout(debounceTimerRef.current);
            }

            debounceTimerRef.current = window.setTimeout(() => {
                performSave();
            }, 2000);

            if(!safetyTimerRef.current){
                safetyTimerRef.current = window.setTimeout(() => {
                    performSave();
                }, 60000);
            }
        });

    },[editor, onSave, noteId, noteTitle]);

    return null;
}

export default AutoSavePlugin;