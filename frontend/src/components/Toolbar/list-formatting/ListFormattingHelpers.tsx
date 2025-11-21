import { $getSelection, $isRangeSelection, $getNodeByKey, type LexicalNode, type LexicalEditor } from "lexical";
import { $isListItemNode, $isListNode, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, ListNode, REMOVE_LIST_COMMAND} from "@lexical/list";

export type ListType = "bullet" | "number";
export type ListFormats = "Bulleted List" | "Numbered List";
const listTagMap: Record<ListType, string> = {
    "bullet" : "ul",
    "number" : "ol"
}
const tagToFormat: Record<string, ListFormats | null> = {
    ul: "Bulleted List",
    ol: "Numbered List"
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

    return {anchorNode, anchorParentNode, focusNode, focusParentNode};
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

function removeList(editor: LexicalEditor) {
    // Removes List with Lexical command
    editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
}

export function toggleListFormat(editor: LexicalEditor, formatChoice: ListType){
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
        const anchorNodeParent = findNodes.anchorParentNode;
        const focusNodeParent = findNodes.focusParentNode;
        
        // Check if nodes are null
        if (anchorNodeParent === null || focusNodeParent === null) return false;

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

export function getActiveListFormat(editor: LexicalEditor): ListFormats | null {
    let activeFormat: ListFormats | null = null;

    editor.getEditorState().read(() => {
        const selection = $getSelection();
        if(!$isRangeSelection(selection)) return;

        const selectedNode = selection.getNodes()[0];
        const listNode = selectedNode.getParents().find($isListNode) as ListNode | undefined;

        if (listNode) {
            const listTag = listNode.getTag();
            activeFormat = tagToFormat[listTag] ?? null;
        };
    });

    return activeFormat;
}