import type { LexicalEditor } from "lexical";
import { type TextStyles, styleMap, executeCommand, handleClick, createDropdownStateMap} from "../ToolbarUtils";
import { useState } from "react";
import Dropdown from "../../dropdown/Dropdown";
import DropdownItem from "../../dropdown/DropdownItem";

function Highlighting({editor} : {editor : LexicalEditor}) {
    const [highlightAnchor, setHighlightAnchor] = useState<null | HTMLElement>(null);
    const [highlightColour, setHighlightColour] = useState<string>("#FFFF00");
    const highlightColours: string[] = ["#FFFF00", "#FF69B4", "#00FF00", "#00BFFF", "#FF0000"];
    const dropdownStateMap = createDropdownStateMap({
        "highlight" : {state: highlightAnchor, setter: setHighlightAnchor}
    })

    return(
        <div className="highlighting-container">
            <button className="highlight" onClick={() => executeCommand(editor, styleMap["Highlight"], highlightColour)}>Highlight</button>

            <button onClick={(e) => {handleClick(e, 'highlight', dropdownStateMap)}}>Extra colours</button>
            <Dropdown
            anchor={dropdownStateMap.highlight.state}
            open={dropdownStateMap.highlight.state !== null}
            onClose={() => {dropdownStateMap.highlight.setter(null)}}
            >
                {highlightColours.map((colour) => (
                    <DropdownItem
                    text={colour}
                    onClick={() => {setHighlightColour(colour)
                                    dropdownStateMap.highlight.setter(null)}}
                    />
                ))}
            </Dropdown>

        </div>
    )
}

export default Highlighting;