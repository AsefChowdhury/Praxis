import { type EditorCommand, executeCommand, handleClick, createDropdownStateMap } from "../ToolbarUtils";
import { type LexicalEditor, FORMAT_ELEMENT_COMMAND } from "lexical";
import { useState } from "react";
import Dropdown from "../../dropdown/Dropdown";
import DropdownItem from "../../dropdown/DropdownItem";

type AlignmentOptions = "Left" | "Start" | "Center" | "Right" | "End" | "Justify";


const alignmentMap: Record<AlignmentOptions, EditorCommand> = {
    "Left" : {payload: "left", command: FORMAT_ELEMENT_COMMAND},
    "Start" : {payload: "start", command: FORMAT_ELEMENT_COMMAND},
    "Center" : {payload: "center", command: FORMAT_ELEMENT_COMMAND},
    "Right" : {payload: "right", command: FORMAT_ELEMENT_COMMAND},
    "End" : {payload: "end", command: FORMAT_ELEMENT_COMMAND},
    "Justify" : {payload: "justify", command: FORMAT_ELEMENT_COMMAND}
}

function AlignmentFormats({ editor }: {editor: LexicalEditor}) {
    const alignmentOptions: AlignmentOptions[] = ["Left", "Start", "Center", "Right", "End", "Justify"];
    const [alignmentAnchor, setAlignmentAnchor] = useState<null | HTMLElement>(null); 
    const dropdownStateMap = createDropdownStateMap({
        "alignmentOptions" : {state: alignmentAnchor, setter: setAlignmentAnchor}
    });

    return(
        <div className="text-alignment-container">
            <button onClick={(e) => {handleClick(e, 'alignmentOptions', dropdownStateMap)}}>Alignment</button>
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
                    />
                ))}
            </Dropdown>
        </div>        
    )
}

export default AlignmentFormats;