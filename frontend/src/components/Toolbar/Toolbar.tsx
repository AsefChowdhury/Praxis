import "./Toolbar.css";
import Dropdown from "../dropdown/Dropdown";
import DropdownItem from "../dropdown/DropdownItem";
import React, { useEffect, useState } from "react";
import { $getNodeByKey, $getSelection, $isRangeSelection, CAN_REDO_COMMAND, 
        CAN_UNDO_COMMAND, COMMAND_PRIORITY_LOW, FORMAT_TEXT_COMMAND, FORMAT_ELEMENT_COMMAND, REDO_COMMAND, 
        UNDO_COMMAND, type LexicalCommand, type LexicalEditor, type LexicalNode, type TextFormatType} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isListItemNode, $isListNode, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, ListNode, REMOVE_LIST_COMMAND} from "@lexical/list";

type TextStyles = "Bold" | "Italic"| "Underline" | "Superscript" | "Subscript"| "Code" | "Lowercase" | "Uppercase" | "Strikethrough";
type AlignmentOptions = "Left" | "Start" | "Center" | "Right" | "End" | "Justify";
type ListFormats = "Bulleted List" | "Numbered List";
type ListType = "bullet" | "number";
type HistoryCommands = "Undo" | "Redo";
type EditorCommand = {payload: string; command: LexicalCommand<string>};
type StateAndSetter<T> = {state: T, setter: React.Dispatch<React.SetStateAction<T>>};
type ToolbarAnchors = "extendedStyles" | "alignmentOptions";

const textStylesArray = ["Bold", "Italic", "Underline", "Superscript", "Subscript", "Code", "Lowercase", "Uppercase", "Strikethrough"];

const styleMap: Record<TextStyles, EditorCommand> = {
    "Bold" : {payload: "bold", command: FORMAT_TEXT_COMMAND},
    "Italic" : {payload: "italic", command: FORMAT_TEXT_COMMAND},
    "Underline" : {payload: "underline", command: FORMAT_TEXT_COMMAND},
    "Superscript" : {payload: "superscript", command: FORMAT_TEXT_COMMAND},
    "Subscript" : {payload: "subscript", command: FORMAT_TEXT_COMMAND},
    "Code" : {payload: "code", command: FORMAT_TEXT_COMMAND},
    "Lowercase" : {payload: "lowercase", command: FORMAT_TEXT_COMMAND},
    "Uppercase" : {payload: "uppercase", command: FORMAT_TEXT_COMMAND},
    "Strikethrough" : {payload: "strikethrough", command: FORMAT_TEXT_COMMAND}
}

const alignmentMap: Record<AlignmentOptions, EditorCommand> = {
    "Left" : {payload: "left", command: FORMAT_ELEMENT_COMMAND},
    "Start" : {payload: "start", command: FORMAT_ELEMENT_COMMAND},
    "Center" : {payload: "center", command: FORMAT_ELEMENT_COMMAND},
    "Right" : {payload: "right", command: FORMAT_ELEMENT_COMMAND},
    "End" : {payload: "end", command: FORMAT_ELEMENT_COMMAND},
    "Justify" : {payload: "justify", command: FORMAT_ELEMENT_COMMAND}
}


const listTypeMap = {
    "Bulleted List" : "bullet",
    "Numbered List" : "number"
}

const listTagMap: Record<ListType, string> = {
    "bullet" : "ul",
    "number" : "ol"
}

// Helper functions:

function isTextStyles(value: string): value is TextStyles{
    if (!textStylesArray.includes(value)) return false;
    return true
}

function findAnchorAndFocusNodes() {
    // Get the selection
    const selection = $getSelection();

    // Check if the range is valid
    if (!$isRangeSelection(selection)) return false;

    // Unique string identifiers for a node in the editor's state tree
    const selectionAnchorKey = selection.anchor.key;
    const selectionFocusKey = selection.focus.key
    
    // Get anchor and focus nodes
    const anchorNode = $getNodeByKey(selectionAnchorKey);
    const focusNode = $getNodeByKey(selectionFocusKey);

    // Check if nodes are null
    if (anchorNode === null || focusNode === null) return false;

    // Get parents of node
    const anchorParentNode = anchorNode.getParent();
    const focusParentNode = focusNode.getParent();

    return {anchorParentNode, focusParentNode};
}

function isListType(node: LexicalNode) {
    // Check if the given node is of type ListNode or ListItemNode
    return $isListItemNode(node) || $isListNode(node);
}

function getListFormat(node: LexicalNode){
    // Check if node is a list item node
    if (!$isListItemNode(node)) return false;

    // Get parent of list item node
    const parentNode = node.getParent()

    // Get the tag of the parent node
    return (parentNode as ListNode).getTag();
}

function insertList(editor: LexicalEditor, formatChoice: ListType){
    // Switch-Case used to apply specific list formartting based on formatChoice given
    switch (formatChoice) {
        case "bullet":
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        break;
        
        case "number":
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        break;

        default:
            break;
    }
}

function removeList(editior: LexicalEditor) {
    // Removes List with Lexical command
    editior.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
}

// Core editior functions
function toggleListFormat(editor: LexicalEditor, formatChoice: ListType){
    editor.update(() => {
        const findNodes = findAnchorAndFocusNodes();
        if (findNodes == false) return false;
        
        // Declare target nodes
        let anchorTargetNode = null;
        let focusTargetNode = null;

        // Get anchor node
        const anchorNode = findNodes.anchorNode;
        const focusNode = findNodes.focusNode;

        // Get parent nodes
        const anchorNode = findNodes.anchorParentNode;
        const focusNode = findNodes.focusParentNode;
        
        // Check if nodes are null
        if (anchorNode === null || focusNode === null) return false;
        const anchorNodeTag = getListFormat(anchorNode);        

        // Get correct target node based on condition
        if ($isListItemNode(anchorNode) && $isListItemNode(focusNode)) {
            anchorTargetNode = anchorNode;
            focusTargetNode = focusNode;
        }
        else{
            anchorTargetNode = anchorNodeParent;
            focusTargetNode = focusNodeParent;
        }

        const anchorNodeTag = getListFormat(anchorTargetNode);
        const focusNodeTag = getListFormat(focusTargetNode);        

        if((isListType(anchorNodeParent) && isListType(focusNodeParent)) && (anchorNodeTag == listTagMap[formatChoice] && focusNodeTag == listTagMap[formatChoice])){
            removeList(editor);
        }
        else if((isListType(anchorNodeParent) && isListType(focusNodeParent)) && (anchorNodeTag != listTagMap[formatChoice])){
            insertList(editor, formatChoice);
        }
        else{
            insertList(editor, formatChoice);
        }
    })
}

function executeCommand(editor: LexicalEditor, styleObj: {payload: string, command: LexicalCommand<string>}) {
    let {payload, command} = styleObj;

    editor.update(() => {
        const selection = $getSelection(); // get the current selection
        if (!$isRangeSelection(selection)) return false;
        editor.dispatchCommand(command, payload);
    })
}

function handleHistory(editor: LexicalEditor, historyChoice: string){
    switch (historyChoice) {
        case "Undo":
            editor.dispatchCommand(UNDO_COMMAND, undefined);
            break;
        
        case "Redo":
            editor.dispatchCommand(REDO_COMMAND, undefined);
            break
        
        default:
            break;
    }
}

function Toolbar() {
    const [editor] = useLexicalComposerContext(); // Allows us to reference the editor

    const coreTextStyles: TextStyles[] = ["Bold", "Italic", "Underline", "Code"];
    const extendedTextStyles: TextStyles[] = ["Subscript", "Superscript", "Lowercase", "Uppercase", "Strikethrough"];
    const listFormats: ListFormats[] = ["Bulleted List", "Numbered List"];
    const historyCommands: HistoryCommands[] = ["Undo", "Redo"];
    const alignmentOptions: AlignmentOptions[] = ["Left", "Start", "Center", "Right", "End", "Justify"];

    const [activeStyles, setActiveStyles] = useState<TextStyles[]>([]);
    const [activeFormat, setActiveFormat] = useState<ListFormats[]>([]);
    const [extendedStylesAnchor, setExtendedStylesAnchor] = useState<null | HTMLElement>(null);
    const [alignmentAnchor, setAlignmentAnchor] = useState<null | HTMLElement>(null);
    const [canUndo, setCanUndo] = useState<Boolean>(false);
    const [canRedo, setCanRedo] = useState<Boolean>(false);   

    const dropdownStateMap: Record<ToolbarAnchors, StateAndSetter<null | HTMLElement>> = {
    "extendedStyles" : {state: extendedStylesAnchor, setter: setExtendedStylesAnchor},
    "alignmentOptions" : {state: alignmentAnchor, setter: setAlignmentAnchor}
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>, key: ToolbarAnchors) => {
        let {state, setter} = dropdownStateMap[key];

        if (state !== null) {
            setter(null);
            return;
        }

        setter(event.currentTarget);
    }

    // useEffect used to enable/disable undo/redo buttons
    useEffect(() => {
        const unregisterUndo = editor.registerCommand(
            CAN_UNDO_COMMAND,
            (payload) => {
                setCanUndo(payload);
                return false;
            },
            COMMAND_PRIORITY_LOW
        );

        const unregisterRedo = editor.registerCommand(
            CAN_REDO_COMMAND,
            (payload) => {
                setCanRedo(payload);
                return false;
            },
            COMMAND_PRIORITY_LOW
        );

        return () => {
            unregisterUndo();
            unregisterRedo();
        }
    },[editor]);  

    return(
        <div className="toolbar-container">
            {/*Undo/Redo */}
            <div className="history">
                {historyCommands.map(historyCommand => (
                    <button
                    key={historyCommand}
                    className={`history-button ${(historyCommand === "Undo" && !canUndo) || (historyCommand === "Redo" && !canRedo) ? "disabled" : ""}`}
                    disabled={(historyCommand === "Undo" && !canUndo) || (historyCommand === "Redo" && !canRedo)}
                    onClick={() => {
                        handleHistory(editor, historyCommand)
                    }}
                    >{historyCommand}</button>
                ))}
            </div>

            {/*Styling */}
            <div className="styling-options">
                {/* .map() below used to display core styling options */}
                {coreTextStyles.map(coreTextStyle => (
                    <button 
                    key={coreTextStyle}
                    className={`style-button ${activeStyles.includes(coreTextStyle) ? "active" : ""}`}
                    onClick={() => {
                        executeCommand(editor, styleMap[coreTextStyle])
                    }}
                    >{coreTextStyle}</button>
                ))}

                {/* .map() below used to display extended styling options */}
                <div className="extended-styling-container">
                    <button onClick={(e) => {handleClick(e, 'extendedStyles')}}>Extra Styling</button>
                    <Dropdown
                    anchor={dropdownStateMap.extendedStyles.state}
                    open={dropdownStateMap.extendedStyles.state !== null}
                    onClose={() => {dropdownStateMap.extendedStyles.setter(null)}}
                    > 
                        {extendedTextStyles.map(extendedTextStyle => (
                        <DropdownItem
                        text={extendedTextStyle}
                        onClick={() => {executeCommand(editor, styleMap[extendedTextStyle])}}
                        />
                    ))}

                    </Dropdown>
                </div>

                {/* Fontsize tsx */}
            </div>
            
            {/*Formatting */}
            <div className="formatting-options">
                {formats.map(format => (
                    <button
                    key={format}
                    className={`format-button ${activeFormat.includes(format) ? "active" : ""}`}
                    onClick={() => {
                        toggleListFormat(editor, formatMap[format] as ListType)
                    }}
                    >{format}</button>
                ))}

                {/*Alignment tsx*/}
                <div className="text-alignment-container">
                    <button onClick={(e) => {handleClick(e, 'alignmentOptions')}}>Alignment</button>
                    <Dropdown
                    anchor={dropdownStateMap.alignmentOptions.state}
                    open={dropdownStateMap.alignmentOptions.state !== null}
                    onClose={() => {dropdownStateMap.alignmentOptions.setter(null)}}
                    >
                        {alignmentOptions.map(alignmentOption => (
                            <DropdownItem
                            text={alignmentOption}
                            onClick={() => {executeCommand(editor, alignmentMap[alignmentOption])}}
                            />
                        ))}
                    </Dropdown>
                </div>
            </div>
        </div>

    )
}

export default Toolbar;