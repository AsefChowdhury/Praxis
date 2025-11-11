import { $isRangeSelection,$getSelection, type LexicalEditor } from "lexical";
import { $patchStyleText } from "@lexical/selection"
export const MIN_ALLOWED_FONT_SIZE: number =  8;
export const MAX_ALLOWED_FONT_SIZE: number = 72;
export const DEFAULT_FONT_SIZE: number = 12;
export const ACCEPTED_FONT_SIZES: number[] = [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72];
export type FontSizeOptions = number;

function isValidFontSize(fontSize: number): boolean{
    return !isNaN(fontSize) && fontSize >= MIN_ALLOWED_FONT_SIZE && fontSize <= MAX_ALLOWED_FONT_SIZE;
}

export function adjustFontSize(editor: LexicalEditor, value: number){
    if (!isValidFontSize(value)) return;

    editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;
        const pxValue = value * 1.333;
        $patchStyleText(selection, {"font-size": `${pxValue}px`});
    })
}