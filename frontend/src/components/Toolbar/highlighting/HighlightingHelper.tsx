import { $getSelection, $isRangeSelection, $isTextNode, type LexicalEditor } from "lexical";

export const isSelectionHighlighted = (editor: LexicalEditor): boolean => {
    let isHighlighted = false;

    editor.getEditorState().read(() => {
        const selection = $getSelection();

        if(!$isRangeSelection(selection)){
            isHighlighted = false;
            return;
        }

        isHighlighted = selection.getNodes().some(node => 
            $isTextNode(node) && node.getStyle().includes("background-color")
        );
    });
    return isHighlighted;
};