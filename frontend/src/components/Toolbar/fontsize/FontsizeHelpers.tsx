import { $isRangeSelection,$getSelection, type LexicalEditor, $isTextNode } from "lexical";

export const MIN_ALLOWED_FONT_SIZE: number =  8;
export const MAX_ALLOWED_FONT_SIZE: number = 72;
export const DEFAULT_FONT_SIZE: number = 12;

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

export function adjustFontSize(editor: LexicalEditor, value: number){
    editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return false;

        const nodes = selection.getNodes();
        const textNodes = nodes.filter(node => $isTextNode(node));
        if (!isValidFontSize(value)) return;
        const normalisedValue = normaliseFontSize(value, "px");

        textNodes.forEach(node => {
            const fontsize = node.getStyle();
            console.log("fontsize: ", fontsize);
        })

        textNodes.forEach(node => node.setStyle(`font-size: ${normalisedValue}px`))

    })
}