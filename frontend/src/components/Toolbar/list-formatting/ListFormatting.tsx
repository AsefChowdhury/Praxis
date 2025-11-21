import "./ListFormatting.css"
import { useEffect, useState } from "react";
import { type ListType, type ListFormats, toggleListFormat, getActiveListFormat} from "./ListFormattingHelpers";
import { type LexicalEditor } from "lexical";
import { ListBulletsIcon, ListNumbersIcon } from "@phosphor-icons/react";

const listTypeMap = {
    "Bulleted List" : "bullet",
    "Numbered List" : "number"
}

const LIST_ICON: Record<ListFormats, React.ReactNode> = {
    "Bulleted List": <ListBulletsIcon size={22}/>,
    "Numbered List": <ListNumbersIcon size={22}/>
}

function ListFormatting({ editor }: {editor : LexicalEditor}) {
    const [activeFormat, setActiveFormat] = useState<ListFormats | null>(null);
    const listFormats: ListFormats[] = ["Bulleted List", "Numbered List"];

    useEffect(() => {
        const updateToolbar = () => {
            const activeFormat = getActiveListFormat(editor);
            setActiveFormat(activeFormat);
        }
        
        return editor.registerUpdateListener(updateToolbar)
    },[editor])

    return(
        <div className="list-formatting-options">
            {listFormats.map(listFormat => (
                <button
                key={listFormat}
                className={`list-format-button ${activeFormat === listFormat ? "active" : ""}`}
                onClick={() => {
                    toggleListFormat(editor, listTypeMap[listFormat] as ListType)
                }}
                >{LIST_ICON[listFormat]}</button>
            ))}
        </div>
    )
}

export default ListFormatting;