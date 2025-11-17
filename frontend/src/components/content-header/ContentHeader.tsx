import "./ContentHeader.css";
import Textarea from "../textarea/Textarea";
import ContentSave from "../content-save/ContentSave";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { type SavePayload } from "../../notes/ManageNotes";
import { useRef } from "react";

type ContentHeaderProps = {
    title: string;
    onTitleChange: (newTitle: string) => void;
    id: string | null;
    onSave: (payload: SavePayload) => void;
}


function ContentHeader({ title, onTitleChange, id, onSave} : ContentHeaderProps) {
    const [editor] = useLexicalComposerContext();
    const originalTitleRef = useRef(title);

    const handleTitleFocus = () => {
        originalTitleRef.current = title;
    }

    const handleTitleBlur = () => {
        const newTitle = title;

        if(id !== null && newTitle !== originalTitleRef.current){
            onSave({
                id: id,
                note_title: newTitle
            });
            originalTitleRef.current = newTitle;
        }
    }


    return(
        <div className="header-container">
            <div className="file-name-container">
                <Textarea 
                className="note-title"
                value={title} 
                onChange={(e) => onTitleChange(e.target.value)}
                onFocus={handleTitleFocus}
                onBlur={handleTitleBlur}
                maxLength={100}/>
            </div>
            <div className="file-operations">
                <ContentSave editor={editor} title={title} id={id} onSave={onSave} className="content-save-button"/>
            </div>
        </div>
    )
}

export default ContentHeader;