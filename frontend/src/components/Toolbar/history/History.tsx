import "./History.css"
import React, {useEffect, useState} from "react";
import { handleHistory } from "./HistoryHelper";
import type { HistoryCommands } from "./HistoryHelper";
import { CAN_UNDO_COMMAND, COMMAND_PRIORITY_LOW, CAN_REDO_COMMAND, type LexicalEditor } from "lexical";
import { Undo, Redo } from "lucide-react";

const HISTORY_ICONS: Record<HistoryCommands, React.ReactNode> = {
    "Undo": <Undo size={18} strokeWidth={3}/>,
    "Redo": <Redo size={18} strokeWidth={3}/>
}

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
                >{HISTORY_ICONS[historyCommand]}</button>
            ))}
        </div>
    )
}

export default History;