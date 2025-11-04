import "./ContentHeader.css";
import Textarea from "../textarea/Textarea";
import ContentSave from "../content-save/ContentSave";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { type NotePayload } from "../../notes/NoteUtils";

type ContentHeaderProps = {
    title: string;
    onTitleChange: (newTitle: string) => void;
    id: string | null;
    onSave: (payload: NotePayload) => void;
}


function ContentHeader({ title, onTitleChange, id, onSave} : ContentHeaderProps) {
    const [editor] = useLexicalComposerContext();
    return(
        <div className="header-container">
            <div className="file-name-container">
                <Textarea 
                className="note-title"
                value={title} 
                onChange={(e) => onTitleChange(e.target.value)}
                maxLength={100}/>
            </div>
            <div className="file-operations">
                <ContentSave editor={editor} title={title} id={id} onSave={onSave}/>
            </div>
        </div>
    )
}

export default ContentHeader;