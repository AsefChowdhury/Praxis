import { $getRoot, $getSelection, $isRangeSelection, BEFORE_INPUT_COMMAND, COMMAND_PRIORITY_LOW, PASTE_COMMAND, type EditorState, type LexicalEditor } from "lexical";

function charCounter(editorState : EditorState) : number {
    let currentChars = 0;
    editorState.read(() => {
        currentChars = $getRoot().getTextContent().length;
    })
    return currentChars;
}

function remainingChars(currentChars : number, maxChar : number) : number {
    let charsLeft = maxChar - currentChars;
    return charsLeft;
}

function truncateText(text : string, remainingChars : number) : string {
    let truncatedText = text;

    if (text.length > remainingChars) {
        truncatedText = text.substring(0, remainingChars);
    }

    return truncatedText;
}

export function enforceCharLimit(editor : LexicalEditor, maxChar : number) {
    // For user typing:
    const removeBeforeInputListner = editor.registerCommand(
        BEFORE_INPUT_COMMAND,
        (payload) => {
            if (payload.data === null) return false;

            let text = payload.data;
            let currentChars = charCounter(editor.getEditorState());
            let charsRemaining = remainingChars(currentChars, maxChar);

            if (text.length > charsRemaining) {
                let truncatedText = truncateText(text, charsRemaining);
                let selection = $getSelection();

                if (!$isRangeSelection(selection)) return false;

                payload.preventDefault();

                selection.insertText(truncatedText);
                return true;
            }

            return false;
            
        },
        COMMAND_PRIORITY_LOW
    );


    // For user pasting:
    const removePasteListener = editor.registerCommand(
        PASTE_COMMAND,
        (payload) => {
            if (payload instanceof ClipboardEvent) {
                if (payload.clipboardData === null) return false;

                let text = payload.clipboardData.getData('text/plain');
                let currentChars = charCounter(editor.getEditorState());
                let charsRemaining = remainingChars(currentChars, maxChar)

                if (text.length > charsRemaining) {
                    let truncatedText = truncateText(text, charsRemaining);
                    let selection = $getSelection();

                    if (!$isRangeSelection(selection)) return false;

                    payload.preventDefault();

                    selection.insertText(truncatedText);
                    return true;
                }

                return false;
            }
            return false;
        },
        COMMAND_PRIORITY_LOW
    );

    return () => {
        removeBeforeInputListner();
        removePasteListener();
    }
}