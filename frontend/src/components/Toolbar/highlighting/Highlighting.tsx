import "./Highlighting.css";
import { styleMap, executeCommand, handleClick, createDropdownStateMap, CORE_STYLE_ICONS} from "../ToolbarUtils";
import { isSelectionHighlighted } from "./HighlightingHelper";
import type { LexicalEditor } from "lexical";
import { useEffect, useState } from "react";
import Dropdown from "../../dropdown/Dropdown";
import { PaletteIcon } from "@phosphor-icons/react";
import DropdownItem from "../../dropdown/DropdownItem";
import cross from "../../../assets/cross.svg";

function Highlighting({editor} : {editor : LexicalEditor}) {
    const [highlightAnchor, setHighlightAnchor] = useState<null | HTMLElement>(null);
    const [highlightColour, setHighlightColour] = useState<string>("#FFCF56");
    const [selectionIsHighlighted, setSelectionIsHighlighted] = useState<boolean>(false);
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

    const handleColourChange = (newColour: string) => {
        setHighlightColour(newColour);
        if (selectionIsHighlighted) {
            executeCommand(editor, styleMap["Highlight"], newColour);
        }
        dropdownStateMap.highlight.setter(null);
    }

    useEffect(() => {
        const updateToolbar = () => {
            const isHighlighted = isSelectionHighlighted(editor);
            setSelectionIsHighlighted(isHighlighted);
        }

        return editor.registerUpdateListener(updateToolbar);
    },[editor]);

    return(
        <div className="highlighting-container">
            <button 
            className={`highlight ${selectionIsHighlighted ? 'active' : ''}`} 
            onClick={() => {executeCommand(editor, styleMap["Highlight"], highlightColour)}}>{CORE_STYLE_ICONS["Highlight"]}</button>

            <button className="palette" onClick={(e) => {handleClick(e, 'highlight', dropdownStateMap)}}><PaletteIcon size={22} weight="duotone"/></button>
            <Dropdown
            id="palette-dropdown"
            anchor={dropdownStateMap.highlight.state}
            open={dropdownStateMap.highlight.state !== null}
            onClose={() => {dropdownStateMap.highlight.setter(null)}}
            usePortal={true}
            >
                {highlightColours.map((colour) => (
                    <DropdownItem
                    icon={() => (
                        colour.name === "No Colour" ?
                        <img src={cross} alt="No Colour Icon" className="colour-swatch no-colour-icon"/> :
                        <span className="colour-swatch" style={{backgroundColor: colour.hex}}/>
                    )}
                    text={colour.name}
                    onClick={() => handleColourChange(colour.hex)}
                    />
                ))}
            </Dropdown>

        </div>
    )
}

export default Highlighting;