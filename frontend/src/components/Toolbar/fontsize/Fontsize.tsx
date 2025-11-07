import "./Fontsize.css"
import { DEFAULT_FONT_SIZE, MAX_ALLOWED_FONT_SIZE, MIN_ALLOWED_FONT_SIZE, ACCEPTED_FONT_SIZES, adjustFontSize, type FontSizeOptions } from "./FontsizeHelpers";
import { handleClick, createDropdownStateMap } from "../ToolbarUtils";
import Dropdown from "../../dropdown/Dropdown";
import DropdownItem from "../../dropdown/DropdownItem";
import { type LexicalEditor } from "lexical";
import { useState, useEffect } from "react";
import { PlusIcon, MinusIcon } from "@phosphor-icons/react";

function Fontsize({ editor }: { editor: LexicalEditor}) {
    const [currentFontSize, setCurrentFontSize] = useState<number>(DEFAULT_FONT_SIZE);
    const [fontSizeAnchor, setFontSizeAnchor] = useState<null | HTMLElement>(null);
    const dropdownStateMap = createDropdownStateMap({
        "fontSizeOptions" : {state: fontSizeAnchor, setter: setFontSizeAnchor}
    })

    useEffect(() => {
        adjustFontSize(editor, currentFontSize);
    },[editor, currentFontSize]);

    const handleAdjustment = (adjustment: "increase" | "decrease") => {
        setCurrentFontSize((prev) => {
            let next = prev;

            if (adjustment === "increase"){
                next = prev + 1;
            }
            else if (adjustment === "decrease"){
                next = prev - 1;
            }
            return Math.min(Math.max(next, MIN_ALLOWED_FONT_SIZE), MAX_ALLOWED_FONT_SIZE);
        })
    }

    const handleDropdownSelect = (size: FontSizeOptions) => {
        setCurrentFontSize(size);
        dropdownStateMap.fontSizeOptions.setter(null);
    }


    return(
        <div className="fontsize-container">
            <button 
            className="fontsize-decrement" 
            onClick={() => {handleAdjustment("decrease")}}
            disabled={currentFontSize <= MIN_ALLOWED_FONT_SIZE}><MinusIcon /></button>

            <button className="fontsize-display" onClick={(e) => {handleClick(e, 'fontSizeOptions', dropdownStateMap)}}>{currentFontSize}</button>
            <Dropdown
            anchor={dropdownStateMap.fontSizeOptions.state}
            open={dropdownStateMap.fontSizeOptions.state !== null}
            onClose={() => {dropdownStateMap.fontSizeOptions.setter(null)}}
            id="toolbar-dropdown"
            >
                {ACCEPTED_FONT_SIZES.map((size) => (
                    <DropdownItem
                    className="fontsize"
                    key={size}
                    text={size.toString()}
                    onClick={() => handleDropdownSelect(size)}
                    ></DropdownItem>
                ))}
            </Dropdown>

            <button 
            className="fontsize-increment" 
            onClick={() => {handleAdjustment("increase")}}
            disabled={currentFontSize >= MAX_ALLOWED_FONT_SIZE}><PlusIcon/></button>
        </div>        
    )
}

export default Fontsize;