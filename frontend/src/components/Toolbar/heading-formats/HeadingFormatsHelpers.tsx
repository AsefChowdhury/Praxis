import { $getSelection, $isRangeSelection, $createParagraphNode, $getNodeByKey, type LexicalEditor } from "lexical";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode, $isHeadingNode } from "@lexical/rich-text";

export type HeadingTypes = "h1" | "h2" | "h3";
export const headingFormats: (HeadingTypes | null)[] = [null, "h1", "h2", "h3"];


function applyHeading(headingChoice: HeadingTypes) {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return false;

    $setBlocksType(selection, () => $createHeadingNode(headingChoice))

}

function removeHeading() {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return false;

     $setBlocksType(selection, () => $createParagraphNode())
}

export function clearHeading(editor: LexicalEditor) {
    editor.update(() => {
        removeHeading();
    })
}

export function getActiveHeading() {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return null;

    // Gets anchor node
    const selectionAnchorKey = selection.anchor.key;
    const anchorNode = $getNodeByKey(selectionAnchorKey);

    if (anchorNode === null) return null;

    const topLevelElement = anchorNode.getTopLevelElementOrThrow();

    if ($isHeadingNode(topLevelElement)){
        const tag = topLevelElement.getTag();
        return (headingFormats as string[]).includes(tag) ? (tag as HeadingTypes) : null;
    }

    return null;
}

export function toggleHeading(editor: LexicalEditor, headingChoice: HeadingTypes) {
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
