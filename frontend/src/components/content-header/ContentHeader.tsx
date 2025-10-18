import "./ContentHeader.css";
import InputField from "../input-field/InputField";

type ContentHeaderProps = {
    title: string;
    onTitleChange: (newTitle: string) => void;
}


function ContentHeader({ title, onTitleChange } : ContentHeaderProps) {
    return(
        <div className="header-container">
            <div className="file-name-container">
                <p>File name:</p>
                <InputField value={title} onChange={(e) => onTitleChange(e.target.value)}/>
            </div>
        </div>
    )
}

export default ContentHeader;