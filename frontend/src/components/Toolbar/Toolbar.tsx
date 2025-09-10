import "./Toolbar.css";
import { useState } from "react";
import { $getNodeByKey, $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, type LexicalEditor, type LexicalNode, type TextFormatType } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isListItemNode, $isListNode, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, ListNode, REMOVE_LIST_COMMAND} from "@lexical/list";

type Styles = "Bold" | "Italic"| "Underline";
type Formats = "Bulleted List" | "Numbered List";
type ListType = "bullet" | "number";

const styleMap = {
    "Bold" : "bold",
    "Italic" : "italic",
    "Underline" : "underline"
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
    // Removes List
    editior.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
}

// Core editior functions
function toggleListFormat(editor: LexicalEditor, formatChoice: ListType){
    editor.update(() => {
        const findNodes = findAnchorAndFocusNodes();
        if (findNodes == false) return false;
        
        // Get parent nodes
        const anchorNode = findNodes.anchorParentNode;
        const focusNode = findNodes.focusParentNode;
        
        // Check if nodes are null
        if (anchorNode === null || focusNode === null) return false;
        const anchorNodeTag = getListFormat(anchorNode);        

        if((isListType(anchorNode) && isListType(focusNode)) && (anchorNodeTag == listTagMap[formatChoice])){
            removeList(editor);
        }
        else{
            insertList(editor, formatChoice);
        }
    })
}

function toggleStyle(editor: LexicalEditor, styleChoice: TextFormatType) {
    editor.update(() => {
        const selection = $getSelection(); // get the current selection
    
        // check if the selection has a range
        if ($isRangeSelection(selection)) {
             editor.dispatchCommand(FORMAT_TEXT_COMMAND, styleChoice); // Apply styling
        } 
    })
}

function Toolbar() {
    const [editor] = useLexicalComposerContext(); // Allows us to reference the editor

    const styles: Styles[] = ["Bold", "Italic", "Underline"];
    const formats: Formats[] = ["Bulleted List", "Numbered List"];

    const [activeStyles, setActiveStyles] = useState<Styles[]>([]);
    const [activeFormat, setActiveFormat] = useState<Formats[]>([]);

    return(
        <div className="toolbar-container">
            {/*Undo/Redo */}
            <div className="history">
                <button className="undo">Undo</button>
                <button className="redo">Redo</button>
            </div>

            {/*Styling */}
            <div className="styling-options">
                {styles.map(style => (
                    <button 
                    key={style}
                    className={`style-button ${activeStyles.includes(style) ? "active" : ""}`}
                    onClick={() => {
                        toggleStyle(editor, styleMap[style] as TextFormatType)
                    }}
                    >{style}</button>
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