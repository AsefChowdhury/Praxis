import "./note-styles/ManageNotes.css";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import Toolbar from "../components/Toolbar/Toolbar";
import { ListItemNode, ListNode } from "@lexical/list";

const theme = {
    text: {
        bold: 'editor-textBold',
        italic: 'editor-textItalic',
        underline: 'editor-textUnderline',
        uppercase: 'editor-textUppercase',
        lowercase: 'editor-textLowercase',
        strikethrough: 'editor-textStrikethrough',
    }
};

function onError(error:Error): void {
    console.error(error);
}

function ManageNotes() {
    const initialConfig = {
        namespace: 'MyEditor',
        nodes: [
            ListNode,
            ListItemNode
        ],
        theme,
        onError
    }

    return(
        <div className="note-container">
            <div className="note-content-container">
                <LexicalComposer initialConfig={initialConfig}>
                    <Toolbar/>
                    <ListPlugin/>
                    <RichTextPlugin
                        contentEditable={<ContentEditable className="note-content"/>}
                        placeholder={<div className="placeholder">Enter some text</div>}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HistoryPlugin/>
                </LexicalComposer>
            </div>
        </div>
    );
};

export default ManageNotes;