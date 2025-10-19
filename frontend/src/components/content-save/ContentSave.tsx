import IconButton from "../icon-button/IconButton";
import { editorToJSON, editorStateToJSON, type NotePayload} from "../../notes/NoteUtils";
import { type LexicalEditor } from "lexical";

type ContentSaveProps = {
    editor : LexicalEditor;
    title : string;
    id : number | null;
    onSave: (payload: NotePayload) => void;
}

function ContentSave({ editor, title, id, onSave } : ContentSaveProps) {

    const handleSave = () => {
        const jsonData = editorToJSON(editor);

        const payload: NotePayload = {
            title: title,
            content: jsonData,
            noteId: id
        }
        onSave(payload);
    }

    return(
        <button className="save-button" onClick={handleSave}>Save</button>
    )
}

export default ContentSave;