import "./CoreStyles.css"
import Highlighting from "../highlighting/Highlighting";
import { type LexicalEditor, $getSelection, $isRangeSelection } from "lexical";
import { type TextStyles, styleMap, executeCommand, CORE_STYLE_ICONS} from "../ToolbarUtils";
import { useEffect, useState } from "react";

const coreTextStyles: TextStyles[] = ["Bold", "Italic", "Underline", "Code"];


function CoreStyles({ editor }: {editor : LexicalEditor}) {
    const [activeCoreStyles, setActiveCoreStyles] = useState<TextStyles[]>([]);

    useEffect(() => {
        const updateToolbar = () => {
            editor.getEditorState().read(() => {
                const selection = $getSelection();
                if(!$isRangeSelection(selection)) return;

                const activeStyles: TextStyles[] = [];

                coreTextStyles.forEach((styleName) => {
                    const format = styleMap[styleName].payload;

                    if(selection.hasFormat(format as 'bold' | 'italic' | 'underline' | 'code')){
                        activeStyles.push(styleName);
                    }
                })

                setActiveCoreStyles(activeStyles);
            })
        }
        return editor.registerUpdateListener(updateToolbar);
    },[editor])
    

    return(
        <div className="core-styling-container">
            {coreTextStyles.map(coreTextStyle => (
                <button 
                key={coreTextStyle}
                className={`style-button ${activeCoreStyles.includes(coreTextStyle) ? "active" : ""}`}
                onClick={() => {
                    executeCommand(editor, styleMap[coreTextStyle])
                }}
                >{CORE_STYLE_ICONS[coreTextStyle]}</button>
            ))}
            <Highlighting editor={editor}/>
        </div>
    )
}

export default CoreStyles;