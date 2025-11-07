import "./AlignmentFormats.css"
import Dropdown from "../../dropdown/Dropdown";
import DropdownItem from "../../dropdown/DropdownItem";
import { type EditorCommand, executeCommand, handleClick, createDropdownStateMap } from "../ToolbarUtils";
import { type LexicalEditor, $getSelection, $isElementNode, $isRangeSelection, FORMAT_ELEMENT_COMMAND } from "lexical";
import React, { useState, useEffect } from "react";
import { TextAlignLeftIcon, TextAlignCenterIcon, TextAlignRightIcon, TextAlignJustifyIcon } from "@phosphor-icons/react";

type AlignmentOptions = "Left" | "Center" | "Right" | "Justify" | "Start" | "End";

const ALIGNMENT_ICONS: Record<AlignmentOptions, React.FC<React.SVGProps<SVGSVGElement>>> = {
    "Left": TextAlignLeftIcon,
    "Center": TextAlignCenterIcon,
    "Right": TextAlignRightIcon,
    "Justify": TextAlignJustifyIcon,
    "Start": TextAlignLeftIcon,
    "End": TextAlignRightIcon
}

const alignmentMap: Record<AlignmentOptions, EditorCommand> = {
    "Left" : {payload: "left", command: FORMAT_ELEMENT_COMMAND},
    "Center" : {payload: "center", command: FORMAT_ELEMENT_COMMAND},
    "Right" : {payload: "right", command: FORMAT_ELEMENT_COMMAND},
    "Justify" : {payload: "justify", command: FORMAT_ELEMENT_COMMAND},
    "Start" : {payload: "start", command: FORMAT_ELEMENT_COMMAND},
    "End" : {payload: "end", command: FORMAT_ELEMENT_COMMAND}
}

function AlignmentFormats({ editor }: {editor: LexicalEditor}) {
    const alignmentOptions: AlignmentOptions[] = ["Left", "Center", "Right",  "Justify", "Start", "End"];
    const [alignmentAnchor, setAlignmentAnchor] = useState<null | HTMLElement>(null); 
    const dropdownStateMap = createDropdownStateMap({
        "alignmentOptions" : {state: alignmentAnchor, setter: setAlignmentAnchor}
    });
    const [currentAlignment, setCurrentAlignment] = useState<string>("left");

    useEffect(() => {
        return editor.registerUpdateListener(() => {
            const editorState = editor.getEditorState();

            editorState.read(() => {
                const selection = $getSelection();
                if(!$isRangeSelection(selection)) return;

                const anchorNode = selection.anchor.getNode();
                let element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow();

                if($isElementNode(element)){
                    const alignment = element.getFormatType();
                    setCurrentAlignment(alignment || "left");
                }
            })
        })
    },[editor])

    const alignmentKey = (Object.keys(alignmentMap) as AlignmentOptions[]).find(
        key => alignmentMap[key].payload === currentAlignment
    );

    const CurrentIcon = ALIGNMENT_ICONS[alignmentKey || "Left"];

    return(
        <div className="text-alignment-container">
            <button className= "alignment-button" onClick={(e) => {handleClick(e, 'alignmentOptions', dropdownStateMap)}}>
                <CurrentIcon className="alignment-button-icon"/>
                <span className="current-alignment-text">{alignmentKey} align</span>
            </button>
            <Dropdown
            anchor={dropdownStateMap.alignmentOptions.state}
            open={dropdownStateMap.alignmentOptions.state !== null}
            onClose={() => {dropdownStateMap.alignmentOptions.setter(null)}}
            >
                {alignmentOptions.map(alignmentOption => (
                    <DropdownItem
                    text={alignmentOption}
                    onClick={() => {executeCommand(editor, alignmentMap[alignmentOption]);
                                    dropdownStateMap.alignmentOptions.setter(null)

                    }}
                    icon={ALIGNMENT_ICONS[alignmentOption]}
                    />
                ))}
            </Dropdown>
        </div>        
    )
}

export default AlignmentFormats;