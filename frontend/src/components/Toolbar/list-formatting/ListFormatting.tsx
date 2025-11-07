import "./ListFormatting.css"
import { useState } from "react";
import { type ListType, toggleListFormat} from "./ListFormattingHelpers";
import type { LexicalEditor } from "lexical";
import { ListBulletsIcon, ListNumbersIcon } from "@phosphor-icons/react";

type ListFormats = "Bulleted List" | "Numbered List";

const listTypeMap = {
    "Bulleted List" : "bullet",
    "Numbered List" : "number"
}

const LIST_ICON: Record<ListFormats, React.ReactNode> = {
    "Bulleted List": <ListBulletsIcon size={22}/>,
    "Numbered List": <ListNumbersIcon size={22}/>
}

function ListFormatting({ editor }: {editor : LexicalEditor}) {
    const [activeFormat, setActiveFormat] = useState<ListFormats[]>([]);
    
    const listFormats: ListFormats[] = ["Bulleted List", "Numbered List"];

    return(
        <div className="list-formatting-options">
            {listFormats.map(listFormat => (
                <button
                key={listFormat}
                className={`list-format-button ${activeFormat.includes(listFormat) ? "active" : ""}`}
                onClick={() => {
                    toggleListFormat(editor, listTypeMap[listFormat] as ListType)
                }}
                >{LIST_ICON[listFormat]}</button>
            ))}
        </div>
    )
}

export default ListFormatting;