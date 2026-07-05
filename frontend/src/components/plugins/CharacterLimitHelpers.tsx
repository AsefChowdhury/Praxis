import { $getRoot, $getSelection, $isElementNode, $isLineBreakNode, $isRangeSelection, $isTextNode, BEFORE_INPUT_COMMAND, COMMAND_PRIORITY_LOW, INSERT_LINE_BREAK_COMMAND, INSERT_PARAGRAPH_COMMAND, PASTE_COMMAND, type EditorState, type LexicalEditor, type LexicalNode } from "lexical";

function countNodeChars(node : LexicalNode) : number {
    let count = 0;

    if (!$isElementNode(node)) {
        return 0;
    }

    const children = node.getChildren();

    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        
        if ($isTextNode(child)) {
            count += child.getTextContent().length;
        }
        else if ($isLineBreakNode(child)) {
            count += 1;
        }
        else if ($isElementNode(child)){
            count += countNodeChars(child);

            if (!child.isInline() && i < children.length -1) {
                count += 1;
            }
        }
    }

    return count;
}


export function charCounter(editorState : EditorState) : number {
    let currentChars = 0;
    editorState.read(() => {
        currentChars = countNodeChars($getRoot());
    })
    return currentChars;
}

export function remainingChars(currentChars : number, maxChar : number) : number {
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

    // For Enter button:
    const removeInsertParagraphListener = editor.registerCommand(
        INSERT_PARAGRAPH_COMMAND,
        () => {
            let currentChars = charCounter(editor.getEditorState());
            let charsRemaining = remainingChars(currentChars, maxChar);

            if (charsRemaining <= 0) {
                return true;
            }
            return false;
        },
        COMMAND_PRIORITY_LOW
    );

    // For Shift+Enter button (i.e., Linebreak):
    const removeLineBreakListener = editor.registerCommand(
        INSERT_LINE_BREAK_COMMAND,
        () => {
            let currentChars = charCounter(editor.getEditorState());
            let charsRemaining = remainingChars(currentChars, maxChar);

            if (charsRemaining <= 0) {
                return true;
            }
            return false;
        },
        COMMAND_PRIORITY_LOW
    )

    return () => {
        removeBeforeInputListner();
        removePasteListener();
        removeInsertParagraphListener();
        removeLineBreakListener();
    }
}