import IconButton from "../icon-button/IconButton";
import { editorToJSON, editorStateToJSON, type NotePayload} from "../../notes/NoteUtils";
import type { LexicalEditor } from "lexical";

function ContentSave({ editor } : { editor : LexicalEditor}) {

    const handleSave = () => {
        const jsonData = editorToJSON(editor);

        const payload: NotePayload = {
            title: "",
            content: jsonData,
            noteId: undefined
        }
    }

    return(
        <button className="save-button" onClick={handleSave}>Save</button>
    )
}

export default ContentSave;