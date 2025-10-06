import { DEFAULT_FONT_SIZE, MAX_ALLOWED_FONT_SIZE, MIN_ALLOWED_FONT_SIZE, adjustFontSize } from "./FontsizeHelpers";
import { type LexicalEditor } from "lexical";
import { useState, useEffect } from "react";

function Fontsize({ editor }: { editor: LexicalEditor}) {
    const [currentFontSize, setCurrentFontSize] = useState<number>(DEFAULT_FONT_SIZE);
    const [inputDisplayValue, setInputDisplayValue] = useState<string>(DEFAULT_FONT_SIZE.toString());

    const handleFontsize = (adjustment: "increase" | "decrease" | number) => {
        setCurrentFontSize(
            (prev) => {
                if (adjustment === "increase" && prev < MAX_ALLOWED_FONT_SIZE){
                    setInputDisplayValue((prev + 1).toString());
                    return prev + 1;
                }
                else if(adjustment === "decrease" && prev > MIN_ALLOWED_FONT_SIZE){
                    setInputDisplayValue((prev - 1).toString());
                    return prev - 1;
                }
                else if(adjustment !== "increase" && adjustment !== "decrease"){
                    if (isNaN(adjustment)) return prev;
                    if (adjustment > MAX_ALLOWED_FONT_SIZE) return MAX_ALLOWED_FONT_SIZE;
                    if (adjustment < MIN_ALLOWED_FONT_SIZE) return MIN_ALLOWED_FONT_SIZE;
                    
                    setInputDisplayValue(adjustment.toString());
                    return adjustment as number;
                }
                return prev;
            }
        )
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputDisplayValue(value);

        const num = Number(value);
        if (!isNaN(num)){
            handleFontsize(num);
        }
    }

    useEffect(() => {
        adjustFontSize(editor, currentFontSize);
    },[editor, currentFontSize]);

    return(
        <div className="fontsize-container">
            <button className="fontsize-decrement" onClick={() => {handleFontsize("decrease")}}>-</button>

            <input 
            className="fontsize-input" 
            value={inputDisplayValue} 
            onChange={handleInputChange}
            onBlur={() => setInputDisplayValue(currentFontSize.toString())}/>
            
            <button className="fontsize-increment" onClick={() => {handleFontsize("increase")}}>+</button>
        </div>        
    )
}

export default Fontsize;