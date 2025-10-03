import { $isRangeSelection,$getSelection, type LexicalEditor } from "lexical";

const MIN_ALLOWED_FONT_SIZE: number =  8;
const MAX_ALLOWED_FONT_SIZE: number = 72;
export const DEFAULT_FONT_SIZE: number = 12;
const FONT_SIZE_OPTIONS: number[] = [8, 10, 12, 14, 18, 24, 36, 48, 72];


function formatFontSize(fontSize: number){
    if ((Number.isNaN(fontSize)) || (fontSize < 1)) return;
    return fontSize + "px";
}

function normaliseFontSize(fontSize: number, unit: string){
    if (unit === 'pt'){
        return Math.round((fontSize * 4)/3)
    }
    return fontSize;
}

function isValidFontSize(fontSize: number): boolean{
    return fontSize >= MIN_ALLOWED_FONT_SIZE && fontSize <= MAX_ALLOWED_FONT_SIZE;
}

 export function adjustFontSize(editor: LexicalEditor, currentFontSize: number){
    editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return false;
        const style = selection.style;
        console.log("style: ", style);


    })
}