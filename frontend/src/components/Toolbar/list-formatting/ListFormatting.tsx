import { useState } from "react";
import type { ListType } from "./ListFormattingHelpers";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { toggleListFormat } from "./ListFormattingHelpers";

type ListFormats = "Bulleted List" | "Numbered List";

const listTypeMap = {
    "Bulleted List" : "bullet",
    "Numbered List" : "number"
}

function ListFormatting() {
    const [editor] = useLexicalComposerContext();
    const [activeFormat, setActiveFormat] = useState<ListFormats[]>([]);
    
    const listFormats: ListFormats[] = ["Bulleted List", "Numbered List"];

    return(
        <div className="list-formatting-options">
            {listFormats.map(listFormat => (
                <button
                key={listFormat}
                className={`format-button ${activeFormat.includes(listFormat) ? "active" : ""}`}
                onClick={() => {
                    toggleListFormat(editor, listTypeMap[listFormat] as ListType)
                }}
                >{listFormat}</button>
            ))}
        </div>
    )
}

export default ListFormatting;