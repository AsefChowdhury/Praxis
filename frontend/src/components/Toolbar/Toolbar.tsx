import "./Toolbar.css";
import History from "./history/History";
import ListFormatting from "./list-formatting/ListFormatting";
import CoreStyles from "./core-styles/CoreStyles";
import ExtendedStyles from "./extended-styles/ExtendedStyles";
import AlignmentFormats from "./alignment-formats/AlignmentFormats";
import Fontsize from "./fontsize/Fontsize";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

function Toolbar() {
    const [editor] = useLexicalComposerContext(); // Allows us to reference the editor

    return(
        <div className="toolbar-container">
            {/*Undo/Redo */}
            <History editor={editor}/>

            {/* Fontsize */}
            <Fontsize editor={editor}/>

            {/*Styling */}
            <div className="styling-options">
                <CoreStyles editor={editor}/>
                <ExtendedStyles editor={editor}/>
            </div>
            
            {/*Formatting */}
            <div className="formatting-options">
                {/*List formatting */}
                <ListFormatting editor={editor}/>

                {/*Alignment formatting*/}
                <AlignmentFormats editor={editor}/>
            </div>
        </div>
    )
}

export default Toolbar;