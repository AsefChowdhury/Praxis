import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef } from "react";
import { type NotePayload, editorStateToJSON } from "../../notes/NoteUtils";
import { type SavePayload } from "../../notes/ManageNotes";

type AutoSavePluginProps = {
    noteId: string | null;
    noteTitle: string;
    onSave: (payload: SavePayload) => void;
}

function AutoSavePlugin({ onSave, noteId, noteTitle } : AutoSavePluginProps) {
    const [editor] = useLexicalComposerContext();
    const debounceTimerRef = useRef<number | null>(null);
    const safetyTimerRef = useRef<number | null>(null);
    const lastSavedContentRef = useRef<string | null>(null);
    const lastSavedTitleRef = useRef<string | null>(null);
    let latestDocRef = useRef<string | null>(null);

    useEffect(() => {
        const performSave = () => {
            let content = latestDocRef.current;
            if(content === null) return;

            const contentHadChanged = content !== lastSavedContentRef.current;
            const titleHasChanged = noteTitle !== lastSavedTitleRef.current;

            if(!contentHadChanged && !titleHasChanged){
                if(debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
                if(safetyTimerRef.current) clearTimeout(safetyTimerRef.current)
                
                debounceTimerRef.current = null;
                safetyTimerRef.current = null; 

                return;
            }

            let payloadToSend: SavePayload;

            if (noteId === null) {
                payloadToSend = {
                    id: null,
                    note_title: noteTitle,
                    note_content: content
                }
            }
            else{
                payloadToSend = {
                    id: noteId,
                    note_content: content
                }
                if (titleHasChanged) {
                    payloadToSend = {...payloadToSend, note_title: noteTitle};
                }
            }

            onSave(payloadToSend);

            lastSavedContentRef.current = content;
            lastSavedTitleRef.current = noteTitle;

            if(debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
            if(safetyTimerRef.current) clearTimeout(safetyTimerRef.current)
            
            debounceTimerRef.current = null;
            safetyTimerRef.current = null;
        }

        const unregisterListener = editor.registerUpdateListener(({ editorState }) => {
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
        })

        return () => {
            unregisterListener();

            if(debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
            if(safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
        }

    },[editor, onSave, noteId, noteTitle]);

    return null;
}

export default AutoSavePlugin;