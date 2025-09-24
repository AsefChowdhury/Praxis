import { type LexicalEditor, UNDO_COMMAND, REDO_COMMAND } from "lexical";

export type HistoryCommands = "Undo" | "Redo";

export function handleHistory(editor: LexicalEditor, historyChoice: string){
    switch (historyChoice) {
        case "Undo":
            editor.dispatchCommand(UNDO_COMMAND, undefined);
            break;
        
        case "Redo":
            editor.dispatchCommand(REDO_COMMAND, undefined);
            break
        
        default:
            break;
    }
}
