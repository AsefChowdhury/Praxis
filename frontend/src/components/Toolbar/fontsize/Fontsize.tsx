import { DEFAULT_FONT_SIZE, adjustFontSize } from "./FontsizeHelpers";
import { type LexicalEditor } from "lexical";
import { useState } from "react";

function Fontsize({ editor }: { editor: LexicalEditor}) {
    const [currentFontSize, setCurrentFontSize] = useState<number>(DEFAULT_FONT_SIZE);

    return(
        <div className="fontsize-container">
            <button className="fontsize-decrement" onClick={() => {adjustFontSize(editor, currentFontSize )}}>-</button>
            <input className="fontsize-input"/>
            <button className="fontsize-increment">+</button>
        </div>        
    )
}

export default Fontsize;