import "./Toolbar.css";
import { useEffect, useState } from "react";
import { $getNodeByKey, $getSelection, $isRangeSelection, CAN_REDO_COMMAND, 
        CAN_UNDO_COMMAND, COMMAND_PRIORITY_LOW, FORMAT_TEXT_COMMAND, FORMAT_ELEMENT_COMMAND, REDO_COMMAND, 
        UNDO_COMMAND, type LexicalCommand, type LexicalEditor, type LexicalNode, type TextFormatType} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isListItemNode, $isListNode, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, ListNode, REMOVE_LIST_COMMAND} from "@lexical/list";

type TextStyles = "Bold" | "Italic"| "Underline" | "Superscript" | "Subscript"| "Code" | "Lowercase" | "Uppercase";
type ListFormats = "Bulleted List" | "Numbered List";
type ListType = "bullet" | "number";
type HistoryCommands = "Undo" | "Redo";
type StyleCommand = {payload: string; command: LexicalCommand<string>};

const styleMap: Record<TextStyles, StyleCommand> = {
    "Bold" : {payload: "bold", command: FORMAT_TEXT_COMMAND},
    "Italic" : {payload: "italic", command: FORMAT_TEXT_COMMAND},
    "Underline" : {payload: "underline", command: FORMAT_TEXT_COMMAND},
    "Superscript" : {payload: "superscript", command: FORMAT_TEXT_COMMAND},
    "Subscript" : {payload: "subscript", command: FORMAT_TEXT_COMMAND},
    "Code" : {payload: "code", command: FORMAT_TEXT_COMMAND},
    "Lowercase" : {payload: "lowercase", command: FORMAT_TEXT_COMMAND},
    "Uppercase" : {payload: "uppercase", command: FORMAT_TEXT_COMMAND}
}

const formatMap = {
    "Bulleted List" : "bullet",
    "Numbered List" : "number"
}

const listTagMap: Record<ListType, string> = {
    "bullet" : "ul",
    "number" : "ol"
}

// Helper functions:

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

function toggleStyle(editor: LexicalEditor, styleObj: {payload: string, command: LexicalCommand<string>}) {
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

    const textStyles: TextStyles[] = ["Bold", "Italic", "Underline", "Superscript", "Subscript", "Code", "Lowercase", "Uppercase"];
    const listFormats: ListFormats[] = ["Bulleted List", "Numbered List"];
    const historyCommands: HistoryCommands[] = ["Undo", "Redo"];

    const [activeStyles, setActiveStyles] = useState<TextStyles[]>([]);
    const [activeFormat, setActiveFormat] = useState<ListFormats[]>([]);
    const [canUndo, setCanUndo] = useState<Boolean>(false);
    const [canRedo, setCanRedo] = useState<Boolean>(false);   

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
                {textStyles.map(textStyle => (
                    <button 
                    key={textStyle}
                    className={`style-button ${activeStyles.includes(textStyle) ? "active" : ""}`}
                    onClick={() => {
                        toggleStyle(editor, styleMap[textStyle])
                    }}
                    >{textStyle}</button>
                ))}
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
            </div>
        </div>

    )
}

export default Toolbar;