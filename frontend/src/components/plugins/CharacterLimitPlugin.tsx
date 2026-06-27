import { useEffect } from "react";
import { enforceCharLimit } from "./CharacterLimitHelpers";
import type { LexicalEditor } from "lexical";

function CharacterLimitPlugin({ editor, maxChar} : { editor : LexicalEditor,  maxChar : number}) {
    useEffect(() => {
        console.log("enforceCharLimit called")
        return enforceCharLimit(editor, maxChar);
    },[editor, maxChar]);

    return null;
}

export default CharacterLimitPlugin;