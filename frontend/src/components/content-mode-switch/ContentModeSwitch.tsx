import "./ContentModeSwitch.css";
import Button from "../button/Button";
import { type ManageNotesMode } from "../../notes/ManageNotes";

type ContentModeSwitchProps = {
    onModeChange : (payload: ManageNotesMode) => void;
    className ?: string
    currentMode: ManageNotesMode
}

function ContentModeSwitch({ onModeChange, className, currentMode } : ContentModeSwitchProps) {

    return(
        <div className="mode-container">
            <Button 
                text="Preview" 
                variant="outlined" 
                onClick={() => onModeChange("Preview")}
                className={className}
                disabled={currentMode === "Preview"}
            />

            <Button 
                text="Edit" 
                variant="outlined" 
                onClick={() => onModeChange("Edit")}
                className={className}
                disabled={currentMode === "Edit"}
            />
        </div>
    )
}

export default ContentModeSwitch;