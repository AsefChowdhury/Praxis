import { editorToJSON, editorStateToJSON, type NotePayload} from "../../notes/NoteUtils";
import { type LexicalEditor } from "lexical";
import Button from "../button/Button";
import SaveIcon from "../../assets/SaveIcon.svg?react"

type ContentSaveProps = {
    editor : LexicalEditor;
    title : string;
    id : string | null;
    onSave: (payload: NotePayload) => void;
    className ?: string
}

function ContentSave({ editor, title, id, onSave, className } : ContentSaveProps) {

    const handleSave = () => {
        const jsonData = editorToJSON(editor);

        const payload: NotePayload = {
            id: id,
            note_title: title,
            note_content: jsonData,
        }
        onSave(payload);
    }

    return(
        <Button 
        iconLeft={SaveIcon}
        text="Save"
        variant="outlined"
        onClick={handleSave}
        className={className}
        />
    )
}

export default ContentSave;