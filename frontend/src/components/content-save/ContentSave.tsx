import { editorToJSON, editorStateToJSON, type NotePayload} from "../../notes/NoteUtils";
import { type LexicalEditor } from "lexical";
import Button from "../button/Button";
import { Save } from "lucide-react";

type ContentSaveProps = {
    editor : LexicalEditor;
    title : string;
    id : string | null;
    onSave: (payload: NotePayload) => void;
}

function ContentSave({ editor, title, id, onSave } : ContentSaveProps) {

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
        iconLeft={Save}
        text="Save"
        variant="outlined"
        onClick={handleSave}/>
    )
}

export default ContentSave;