import type { LexicalEditor } from "lexical";
import { type TextStyles, styleMap, executeCommand, handleClick, createDropdownStateMap} from "../ToolbarUtils";
import { useState } from "react";
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
            <button onClick={(e) => {handleClick(e, 'extendedStyles', dropdownStateMap)}}>Extra Styling</button>
            <Dropdown
            anchor={dropdownStateMap.extendedStyles.state}
            open={dropdownStateMap.extendedStyles.state !== null}
            onClose={() => {dropdownStateMap.extendedStyles.setter(null)}}
            > 
                {extendedTextStyles.map(extendedTextStyle => (
                <DropdownItem
                text={extendedTextStyle}
                onClick={() => {executeCommand(editor, styleMap[extendedTextStyle]);
                                dropdownStateMap.extendedStyles.setter(null)}}
                />
            ))}

            </Dropdown>
        </div>
    )
}

export default ExtendedStyles;