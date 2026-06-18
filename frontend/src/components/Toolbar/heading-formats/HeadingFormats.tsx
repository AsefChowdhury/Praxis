import "./HeadingFormatsStyles.css";
import Dropdown from "../../dropdown/Dropdown";
import DropdownItem from "../../dropdown/DropdownItem";
import { type HeadingFormats, toggleHeading, clearHeading, getActiveHeading, headingFormats } from "./HeadingFormatsHelpers"
import { handleClick, createDropdownStateMap } from "../ToolbarUtils";
import React, { useEffect, useState } from "react";
import { type LexicalEditor } from "lexical";
import { TextHOneIcon, TextHTwoIcon, TextHThreeIcon, TextTIcon, CaretUpIcon, CaretDownIcon } from "@phosphor-icons/react";

const HEADING_ICONS: Record<HeadingFormats, React.FC<React.SVGProps<SVGSVGElement>>> = {
    "h1" : TextHOneIcon,
    "h2" : TextHTwoIcon,
    "h3" : TextHThreeIcon,
}

const headingsTypeMap: Record<HeadingFormats, string> = {
    "h1" : "Heading 1",
    "h2" : "Heading 2",
    "h3" : "Heading 3"
}

function getHeadingLabel(format: HeadingFormats | null): string {
    return format === null ? "Normal Text" : headingsTypeMap[format];
}

function getHeadingIcon(format: HeadingFormats | null) {
    return format === null ? TextTIcon : HEADING_ICONS[format];
}

function HeadingFormats({ editor }: {editor: LexicalEditor}) {
    const [headingAnchor, setHeadingAnchor] = useState<null | HTMLElement>(null); 
    const dropdownStateMap = createDropdownStateMap({
        "headingFormats" : {state: headingAnchor, setter: setHeadingAnchor}
    })
    const [currentHeading, setCurrentHeading] = useState<HeadingFormats | null>(null);
    const activeLabel = getHeadingLabel(currentHeading);
    const CurrentIcon = currentHeading === null ? TextTIcon : HEADING_ICONS[currentHeading];
    const isDropDownOpen = dropdownStateMap.headingFormats.state !== null;

    useEffect(() => {
        return editor.registerUpdateListener(() => {
            const editorState = editor.getEditorState();

            editorState.read(() => {
                const activeHeading = getActiveHeading();
                setCurrentHeading(activeHeading);
            })
        })
    },[editor])

    return(
        <div className="heading-format-container">
            <button className="heading-button" onClick={(e) => {handleClick(e, 'headingFormats', dropdownStateMap)}}>
                <CurrentIcon className="heading-button-icon"/>
                <span className="current-heading-text">{activeLabel}</span>
                {isDropDownOpen ? <CaretUpIcon className="heading-dropdown-icon"/> : <CaretDownIcon className="heading-dropdown-icon"/>}
            </button>
            <Dropdown
            anchor={dropdownStateMap.headingFormats.state}
            open={dropdownStateMap.headingFormats.state !== null}
            onClose={() => dropdownStateMap.headingFormats.setter(null)}
            id="heading-dropdown"
            usePortal={true}
            >
            {headingFormats.map(headingFormat => (
                <DropdownItem
                text={getHeadingLabel(headingFormat)}
                onClick={() => {
                    if (headingFormat === null) {
                        clearHeading(editor);
                    } else {
                        toggleHeading(editor, headingFormat);
                    }
                }}
                icon={getHeadingIcon(headingFormat)}
                />
            ))}
            </Dropdown>
        </div>
    )
}

export default HeadingFormats;