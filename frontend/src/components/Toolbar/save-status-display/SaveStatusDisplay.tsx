import "./SaveStatusDisplay.css";
import { type saveStatusOptions } from "../../../notes/ManageNotes";
import { ClockIcon, CheckIcon, XCircleIcon } from "@phosphor-icons/react";


type SaveStatusDisplayProps = {
    saveStatus: saveStatusOptions;
    lastSaved: Date | null;
}

function SaveStatusDisplay({ saveStatus, lastSaved } : SaveStatusDisplayProps) {

    const renderStatus = () => {
        switch (saveStatus) {
            case "saving":
                return(
                    <div className="save-status-saving">
                        <ClockIcon className="save-status-icon" weight="bold"/> Saving...
                    </div>
                )

            case "saved":
                return(
                    <div className="save-status-saved">
                        <CheckIcon className="save-status-icon" weight="bold"/> Saved
                    </div>
                )
            
            case "failed":
                return(
                    <div className="save-status-failed">
                        <XCircleIcon className="save-status-icon" weight="bold"/> Failed
                    </div>
                )

            case "idle":
            default:
                if(lastSaved){
                    return(
                        <div className="save-status-idle">
                            <span style={{color: '#888', fontSize: '0.9em'}}>
                                Last saved at {lastSaved.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                        </div>
                    )
                }
                return null;
        }
    }

    return(
        <div className="save-status-container">
            {renderStatus()}
        </div>
    )
}

export default SaveStatusDisplay;