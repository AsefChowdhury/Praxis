import { $isRangeSelection,$getSelection, type LexicalEditor } from "lexical";
import { $patchStyleText } from "@lexical/selection"

export type FontFamilyOption = string;
export const DEFAULT_FONT: FontFamilyOption = "Arial";
export const AVAILABLE_FONTS: FontFamilyOption[] = [
    "Arial", 
    "Verdana",
    "Tahoma",
    "Trebuchet",
    "Times New Roman",
    "Georgia",
    "Garamound",
    "Courier New",
    "Brush Script MT"
]

export function setFontFamily(editor: LexicalEditor, font: string){
    editor.update(() => {
        const selection = $getSelection();
        if(!$isRangeSelection(selection)) return;
        $patchStyleText(selection, {"font-family": `${font}`});
    });
}