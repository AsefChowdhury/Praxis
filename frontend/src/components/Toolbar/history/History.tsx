import {useEffect, useState} from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { handleHistory } from "./HistoryHelper";
import type { HistoryCommands } from "./HistoryHelper";
import { CAN_UNDO_COMMAND, COMMAND_PRIORITY_LOW, CAN_REDO_COMMAND, type LexicalEditor } from "lexical";

function History({ editor }: {editor: LexicalEditor}) {
    const historyCommands: HistoryCommands[] = ["Undo", "Redo"];
    const [canUndo, setCanUndo] = useState<Boolean>(false);
    const [canRedo, setCanRedo] = useState<Boolean>(false);  

    // useEffect used to enable/disable undo/redo buttons
    useEffect(() => {
        const unregisterUndo = editor.registerCommand(
            CAN_UNDO_COMMAND,
            (payload) => {
                setCanUndo(payload);
                return false;
            },
            COMMAND_PRIORITY_LOW
        );

        const unregisterRedo = editor.registerCommand(
            CAN_REDO_COMMAND,
            (payload) => {
                setCanRedo(payload);
                return false;
            },
            COMMAND_PRIORITY_LOW
        );

        return () => {
            unregisterUndo();
            unregisterRedo();
        }
    },[editor]);

    return (
        <div className="history">
            {historyCommands.map(historyCommand => (
                <button
                key={historyCommand}
                className={`history-button ${(historyCommand === "Undo" && !canUndo) || (historyCommand === "Redo" && !canRedo) ? "disabled" : ""}`}
                disabled={(historyCommand === "Undo" && !canUndo) || (historyCommand === "Redo" && !canRedo)}
                onClick={() => {
                    handleHistory(editor, historyCommand)
                }}
                >{historyCommand}</button>
            ))}
        </div>
    )
}

export default History;