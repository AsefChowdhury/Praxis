import "./note-styles/ManageNotes.css";
import Toolbar from "../components/Toolbar/Toolbar";
import ContentHeader from "../components/content-header/ContentHeader";
import { type NotePayload } from "./NoteUtils";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListItemNode, ListNode } from "@lexical/list";
import { useState } from "react";

type ManageNotesProps = {
    mode: "edit" | "create";
}

const theme = {
    text: {
        bold: 'editor-textBold',
        italic: 'editor-textItalic',
        underline: 'editor-textUnderline',
        uppercase: 'editor-textUppercase',
        lowercase: 'editor-textLowercase',
        strikethrough: 'editor-textStrikethrough',
    },
    list: {
        ol: 'editor-list-ol',
        ul: 'editor-list-ul',
        listitem: 'editor-listitem',
        nested: {
            listitem: 'editor-nested-listitem'
        }
    }
};

function onError(error:Error): void {
    console.error(error);
}

function ManageNotes(props: ManageNotesProps) {

    const initialConfig = {
        namespace: 'MyEditor',
        nodes: [
            ListNode,
            ListItemNode
        ],
        theme,
        onError
    }

    const handleNoteSave = (payload: NotePayload) => {
    }

    const [noteTitle, setNoteTitle] = useState<string>('Untitled Note');
    const [noteId, setNoteId] = useState<string | null>(null);

    return(
        <div className="note-container">
            <div className="note-content-container">
                <LexicalComposer initialConfig={initialConfig}>
                    <ContentHeader title={noteTitle} onTitleChange={setNoteTitle} id={noteId} onSave={handleNoteSave}/>
                    <Toolbar/>
                    <ListPlugin/>
                    <TabIndentationPlugin/>
                    <RichTextPlugin
                        contentEditable={<ContentEditable className="note-content"/>}
                        placeholder={<div className="placeholder">Enter some text</div>}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HistoryPlugin/>
                </LexicalComposer>
            </div>
            <div style={{height: '100vh', width: '1px'}}></div>
        </div>
    );
};

export default ManageNotes;