import type { LexicalEditor } from "lexical";
import { type TextStyles, styleMap, executeCommand} from "../ToolbarUtils";
import { useState } from "react";

const coreTextStyles: TextStyles[] = ["Bold", "Italic", "Underline", "Code"];


function CoreStyles({ editor }: {editor : LexicalEditor}) {
    const [activeCoreStyles, setActiveCoreStyles] = useState<TextStyles[]>([]);

    return(
        <div className="core-styling-container">
            {coreTextStyles.map(coreTextStyle => (
                <button 
                key={coreTextStyle}
                className={`style-button ${activeCoreStyles.includes(coreTextStyle) ? "active" : ""}`}
                onClick={() => {
                    executeCommand(editor, styleMap[coreTextStyle])
                }}
                >{coreTextStyle}</button>
            ))}
        </div>
    )
}

export default CoreStyles;