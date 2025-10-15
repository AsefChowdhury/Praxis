import "./Highlighting.css";
import cross from "../../../assets/cross.svg";
import type { LexicalEditor } from "lexical";
import { styleMap, executeCommand, handleClick, createDropdownStateMap} from "../ToolbarUtils";
import { useState } from "react";
import Dropdown from "../../dropdown/Dropdown";
import DropdownItem from "../../dropdown/DropdownItem";

function Highlighting({editor} : {editor : LexicalEditor}) {
    const [highlightAnchor, setHighlightAnchor] = useState<null | HTMLElement>(null);
    const [highlightColour, setHighlightColour] = useState<string>("#FFCF56");
    const highlightColours = [
        {hex: "#FFCF56", name: "Yellow"},
        {hex: "#EC407A", name: "Pink"},
        {hex: "#4CAF50", name: "Green"},
        {hex: "#4285F4", name: "Blue"},
        {hex: "#E53935", name: "Red"},
        {hex: "", name: "No Colour"}
    ]
    
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
                    icon={() => (
                        colour.name === "No Colour" ?
                        <img src={cross} alt="No Colour Icon" className="colour-swatch no-colour-icon"/> :
                        <span className="colour-swatch" style={{backgroundColor: colour.hex}}/>
                    )}
                    text={colour.name}
                    onClick={() => {setHighlightColour(colour.hex)
                                    executeCommand(editor, styleMap["Highlight"], colour.hex)
                                    dropdownStateMap.highlight.setter(null)}}
                    />
                ))}
            </Dropdown>

        </div>
    )
}

export default Highlighting;