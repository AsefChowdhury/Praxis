import "./Toolbar.css";
import { type ReactNode } from "react";

function Toolbar({ toolbarFeatures } : {toolbarFeatures : ReactNode}) {
    return(
        <div className="toolbar-container">
            {toolbarFeatures}
        </div>
    )
}

export default Toolbar;