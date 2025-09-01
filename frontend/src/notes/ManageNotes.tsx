import "./note-styles/ManageNotes.css";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";

const theme = {};

function onError(error:Error): void {
    console.error(error);
}

function ManageNotes() {
    const initialConfig = {
        namespace: 'MyEditor',
        theme,
        onError
    }

    return(
        <div className="note-container">
            <div className="toolbar-container"></div>
            <div className="note-content-container">
                <LexicalComposer initialConfig={initialConfig}>
                    <RichTextPlugin
                        contentEditable={<ContentEditable className="note-content"/>}
                        placeholder={<div className="placeholder">Enter some text</div>}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                </LexicalComposer>
            </div>
        </div>
    );
};

export default ManageNotes;