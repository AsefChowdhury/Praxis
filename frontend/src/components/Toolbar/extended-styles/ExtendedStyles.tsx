import "./ExtendedStyles.css"
import type { LexicalEditor } from "lexical";
import { type TextStyles, styleMap, executeCommand, handleClick, createDropdownStateMap, EXTENDED_STYLE_ICONS} from "../ToolbarUtils";
import { useState } from "react";
import { DotsThreeIcon } from "@phosphor-icons/react";
import Dropdown from "../../dropdown/Dropdown";
import DropdownItem from "../../dropdown/DropdownItem";


function ExtendedStyles({ editor }: {editor: LexicalEditor}) {
    const [extendedStylesAnchor, setExtendedStylesAnchor] = useState<null | HTMLElement>(null);
    const extendedTextStyles: TextStyles[] = ["Subscript", "Superscript", "Lowercase", "Uppercase", "Strikethrough"];
    const dropdownStateMap = createDropdownStateMap({
        "extendedStyles" : {state: extendedStylesAnchor, setter: setExtendedStylesAnchor}
    });

    return(
        <div className="extended-styling-container">
            <button className="extra-styles" onClick={(e) => {handleClick(e, 'extendedStyles', dropdownStateMap)}}>
                <DotsThreeIcon size={24} weight="bold"/>
            </button>
            <Dropdown
            id="extended-styles-dropdown"
            anchor={dropdownStateMap.extendedStyles.state}
            open={dropdownStateMap.extendedStyles.state !== null}
            onClose={() => {dropdownStateMap.extendedStyles.setter(null)}}
            usePortal={true}
            > 
                {extendedTextStyles.map(extendedTextStyle => (
                <DropdownItem
                className="extended-styles-icon"
                text={extendedTextStyle}
                onClick={() => {executeCommand(editor, styleMap[extendedTextStyle]);
                                dropdownStateMap.extendedStyles.setter(null)}}
                icon={EXTENDED_STYLE_ICONS[extendedTextStyle]}
                />
            ))}

            </Dropdown>
        </div>
    )
}

export default ExtendedStyles;