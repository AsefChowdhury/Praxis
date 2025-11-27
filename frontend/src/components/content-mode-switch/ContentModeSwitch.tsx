import "./ContentModeSwitch.css";
import Button from "../button/Button";
import Dropdown from "../dropdown/Dropdown";
import DropdownItem from "../dropdown/DropdownItem";

import { type ManageNotesMode } from "../../notes/ManageNotes";
import { useEffect, useState } from "react";
import { GearIcon } from "@phosphor-icons/react";
import IconButton from "../icon-button/IconButton";

type ContentModeSwitchProps = {
    onModeChange : (payload: ManageNotesMode) => void;
    className ?: string
    currentMode: ManageNotesMode
}

function ContentModeSwitch({ onModeChange, className, currentMode } : ContentModeSwitchProps) {
    const modes: ManageNotesMode[] = ["Preview", "Edit"];
    const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" ? window.innerWidth < 768 : false);
    const [dropdownAnchor, setDropdownAnchor] = useState<HTMLElement | null>(null);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleDropdownToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        setDropdownAnchor((prev) => (prev ? null : e.currentTarget));
    }

    const handleModeSelect = (mode: ManageNotesMode) => {
        onModeChange(mode);
        setDropdownAnchor(null);
    }

    if(isMobile){
        return(
            <div className="mode-container">
                <IconButton
                    icon={GearIcon}
                    onClick={handleDropdownToggle}
                    className="header-extra-operations"
                />
                <Dropdown
                    anchor={dropdownAnchor}
                    open={dropdownAnchor !== null}
                    onClose={() => setDropdownAnchor(null)}
                >
                    {modes.map(mode => (
                        <DropdownItem
                            key={mode}
                            text={mode}
                            onClick={() => handleModeSelect(mode)}
                        />
                    ))}
                </Dropdown>
            </div>
        )
    }

    return(
        <div className="mode-container">
            <Button 
                text="Preview" 
                variant="outlined" 
                onClick={() => onModeChange("Preview")}
                className={className}
                disabled={currentMode === "Preview"}
            />

            <Button 
                text="Edit" 
                variant="outlined" 
                onClick={() => onModeChange("Edit")}
                className={className}
                disabled={currentMode === "Edit"}
            />
        </div>
    )
}

export default ContentModeSwitch;