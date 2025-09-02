import "./toolbar.css";

function Toolbar() {
    return(
        <div className="temp-wrapper">
            <div className="toolbar-container">
                <div className="history">
                    <button className="undo">Undo</button>
                    <button className="redo">Redo</button>
                </div>
                <div className="styling-options">
                    <button className="style-bold">Bold</button>
                    <button className="style-italic">Italic</button>
                    <button className="style-underline">Underline</button>
                    {/* Fontsize tsx */}
                </div>
                <div className="formatting-options">
                    <button className="bulleted-list">Bulleted List</button>
                    <button className="numbered-list">Numbered List</button>
                    {/*Alignment tsx*/}
                </div>
            </div>

        </div>
    )
}

export default Toolbar;