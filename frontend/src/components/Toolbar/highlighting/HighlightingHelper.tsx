import { $getSelection, $isRangeSelection, type LexicalEditor } from "lexical";
import { $getSelectionStyleValueForProperty} from "@lexical/selection";

export const isSelectionHighlighted = (editor: LexicalEditor): boolean => {
    let isHighlighted = false;

    editor.getEditorState().read(() => {
        const selection = $getSelection();

        if(!$isRangeSelection(selection)){
            isHighlighted = false;
            return;
        }

        const backgroundColour = $getSelectionStyleValueForProperty(selection, "background-color", "");
        isHighlighted = backgroundColour !== "";
    });
    return isHighlighted;
};