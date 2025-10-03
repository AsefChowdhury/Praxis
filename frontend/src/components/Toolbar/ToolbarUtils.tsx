import { type LexicalEditor, type LexicalCommand, $getSelection, $isRangeSelection } from "lexical";

export type StateAndSetter<T> = {state: T, setter: React.Dispatch<React.SetStateAction<T>>};
export type ToolbarAnchors = "extendedStyles" | "alignmentOptions";

export function executeCommand(editor: LexicalEditor, styleObj: {payload: string, command: LexicalCommand<string>}) {
    let {payload, command} = styleObj;

    editor.update(() => {
        const selection = $getSelection(); // get the current selection
        if (!$isRangeSelection(selection)) return false;
        editor.dispatchCommand(command, payload);
    })
}

export function handleClick(
    event: React.MouseEvent<HTMLElement>, 
    key: ToolbarAnchors,
    dropdownStateMap:  Record<ToolbarAnchors, StateAndSetter<null | HTMLElement>>
) {
    let {state, setter} = dropdownStateMap[key];

    if (state !== null) {
        setter(null);
        return;
    }

    setter(event.currentTarget);
}