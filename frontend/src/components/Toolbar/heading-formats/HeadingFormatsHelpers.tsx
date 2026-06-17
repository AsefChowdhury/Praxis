import { $getSelection, $isRangeSelection, $createParagraphNode, $getNodeByKey, type LexicalEditor } from "lexical";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode, $isHeadingNode } from "@lexical/rich-text";

export type HeadingType = "h1" | "h2" | "h3";

function applyHeading(headingChoice: HeadingType) {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return false;

    $setBlocksType(selection, () => $createHeadingNode(headingChoice))

}

function removeHeading() {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return false;

     $setBlocksType(selection, () => $createParagraphNode())
}

function getActiveHeading() {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return false;

    // Gets anchor node
    const selectionAnchorKey = selection.anchor.key;
    const anchorNode = $getNodeByKey(selectionAnchorKey);

    if (anchorNode === null) return false;

    const topLevelElement = anchorNode.getTopLevelElementOrThrow();

    if ($isHeadingNode(topLevelElement)){
        return topLevelElement.getTag();
    }

    return null;
}

export function toggleHeading(editor: LexicalEditor, headingChoice: HeadingType) {
    editor.update(() => {
        const activeHeading = getActiveHeading();

        if (activeHeading === null || activeHeading !== headingChoice) {
            applyHeading(headingChoice);
        }
        else{
            removeHeading();
        }
    })
}
