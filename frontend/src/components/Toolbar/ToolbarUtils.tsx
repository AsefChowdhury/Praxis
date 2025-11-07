import { type LexicalEditor, type LexicalCommand, $getSelection, $isRangeSelection ,FORMAT_TEXT_COMMAND } from "lexical";
import { $patchStyleText} from "@lexical/selection";
export type StateAndSetter<T> = {state: T, setter: React.Dispatch<React.SetStateAction<T>>};
export type TextStyles = "Bold" | "Italic"| "Underline" | "Superscript" | "Subscript"| "Code" | "Lowercase" | "Uppercase" | "Strikethrough" | "Highlight";
export type EditorCommand = {payload: string; command: LexicalCommand<string>};
import { TextBIcon, HighlighterIcon, TextItalicIcon, TextUnderlineIcon, TextSuperscriptIcon, TextSubscriptIcon, CodeIcon, TextStrikethroughIcon, TextAaIcon} from "@phosphor-icons/react"
import type React from "react";
import UppercaseIcon from "../../assets/UppercaseIcon.svg?react"
import LowercaseIcon from "../../assets/LowercaseIcon.svg?react"

export const CORE_STYLE_ICONS: Partial<Record<TextStyles, React.ReactNode>> = {
    "Bold" : <TextBIcon size={22} weight="bold"/>,
    "Italic": <TextItalicIcon size={22}/>,
    "Underline": <TextUnderlineIcon size={22}/>,
    "Code": <CodeIcon size={22}/>,
    "Highlight": <HighlighterIcon size={22} weight="duotone"/>
}

export const EXTENDED_STYLE_ICONS: Partial<Record<TextStyles, React.FC<React.SVGProps<SVGSVGElement>>>> = {
    "Superscript": TextSuperscriptIcon,
    "Subscript": TextSubscriptIcon,
    "Lowercase": LowercaseIcon,
    "Uppercase": UppercaseIcon,
    "Strikethrough": TextStrikethroughIcon
}

export const styleMap: Record<TextStyles, EditorCommand> = {
    "Bold" : {payload: "bold", command: FORMAT_TEXT_COMMAND},
    "Italic" : {payload: "italic", command: FORMAT_TEXT_COMMAND},
    "Underline" : {payload: "underline", command: FORMAT_TEXT_COMMAND},
    "Superscript" : {payload: "superscript", command: FORMAT_TEXT_COMMAND},
    "Subscript" : {payload: "subscript", command: FORMAT_TEXT_COMMAND},
    "Code" : {payload: "code", command: FORMAT_TEXT_COMMAND},
    "Lowercase" : {payload: "lowercase", command: FORMAT_TEXT_COMMAND},
    "Uppercase" : {payload: "uppercase", command: FORMAT_TEXT_COMMAND},
    "Strikethrough" : {payload: "strikethrough", command: FORMAT_TEXT_COMMAND},
    "Highlight" : {payload: "highlight", command: FORMAT_TEXT_COMMAND}
}

export function createDropdownStateMap<T extends string>(map: Record<T, StateAndSetter<null | HTMLElement>>){
    return map;
}

export function executeCommand(editor: LexicalEditor, styleObj: {payload: string, command: LexicalCommand<string>}, highlightColour?: string) {
    let {payload, command} = styleObj;
    const colourValue = highlightColour ?? "#FFCF56";

    editor.update(() => {
        const selection = $getSelection(); // get the current selection
        if (!$isRangeSelection(selection)) return false;
        
        switch(payload){
            case "highlight":
                $patchStyleText(selection, {'background-color' : colourValue});
                break;
            default:
                editor.dispatchCommand(command, payload);
        }
    })
}

export function handleClick<T extends string>(
    event: React.MouseEvent<HTMLElement>, 
    key: T,
    dropdownStateMap:  Record<T, StateAndSetter<null | HTMLElement>>
) {
    let {state, setter} = dropdownStateMap[key];

    if (state !== null) {
        setter(null);
        return;
    }

    setter(event.currentTarget);
}