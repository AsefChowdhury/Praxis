import "./FontFamily.css";
import Dropdown from "../../dropdown/Dropdown";
import DropdownItem from "../../dropdown/DropdownItem";
import { useEffect, useState } from "react";
import { type FontFamilyOption, DEFAULT_FONT, AVAILABLE_FONTS, setFontFamily } from "./FontFamilyHelpers";
import { $getSelection, $isRangeSelection, type LexicalEditor } from "lexical";
import { $getSelectionStyleValueForProperty } from "@lexical/selection"
import { createDropdownStateMap, handleClick} from "../ToolbarUtils";
import { CaretUpIcon, CaretDownIcon } from "@phosphor-icons/react";

function FontFamily({ editor }: { editor: LexicalEditor}) {
    const [currentFont, setCurrentFont] = useState<FontFamilyOption>(DEFAULT_FONT);
    const [fontFamilyAnchor, setFontFamilyAnchor] = useState<null | HTMLElement>(null);
    const dropdownStateMap = createDropdownStateMap({
        "fontFamilyOptions" : {state: fontFamilyAnchor, setter: setFontFamilyAnchor}
    });

    useEffect(() => {
        return editor.registerUpdateListener(() => {
            const editorState = editor.getEditorState();

            editorState.read(() => {
                const selection = $getSelection();
                if(!$isRangeSelection(selection)) return;

                const font = $getSelectionStyleValueForProperty(selection, "font-family", DEFAULT_FONT);
                setCurrentFont(font);
            })
        })
    },[editor]);

    const handleDropdownSelect = (font: FontFamilyOption) => {
        editor.focus();
        setFontFamily(editor, font);
        setCurrentFont(font);
        dropdownStateMap.fontFamilyOptions.setter(null);
    }

    const isDropDownOpen = dropdownStateMap.fontFamilyOptions.state !== null;

    return(
        <div className="font-family-container">
            <button className="font-button" onClick={(e) => {handleClick(e, 'fontFamilyOptions', dropdownStateMap)}}>
                <span className="current-font-text">{currentFont}</span>
                {isDropDownOpen ? <CaretUpIcon/> : <CaretDownIcon/>}
                </button>
            <Dropdown
            anchor={dropdownStateMap.fontFamilyOptions.state}
            open={dropdownStateMap.fontFamilyOptions.state !== null}
            onClose={() => {dropdownStateMap.fontFamilyOptions.setter(null)}}
            id="font-dropdown"
            usePortal={true}
            >
                {AVAILABLE_FONTS.map((font) => (
                    <DropdownItem
                    className="font"
                    key={font}
                    text={font}
                    style={{ fontFamily: font}}
                    onClick={() => handleDropdownSelect(font)}
                    ></DropdownItem>
                ))}
            </Dropdown>
        </div>
    )
}

export default FontFamily;