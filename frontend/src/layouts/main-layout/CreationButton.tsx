import { useState } from 'react';
import './main-layout-styles/CreationButton.css'
import add from '../../assets/add.svg?react'
import flashcards from '../../assets/flashcards.svg?react'
import notes from '../../assets/notes.svg?react'
import quizzes from '../../assets/quizzes.svg?react'
import Dropdown from '../../components/dropdown/Dropdown';
import DropdownItem from '../../components/dropdown/DropdownItem';
import IconButton from "../../components/icon-button/IconButton";

function CreationButton() {
    const [dropdownAnchor, setDropdownAnchor] = useState<null | HTMLElement>(null);
    
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (dropdownAnchor !== null) {
            setDropdownAnchor(null);
            return;
        }
        setDropdownAnchor(event.currentTarget);
    };

    const handleClose = () => {
        setDropdownAnchor(null);
    };
    
    return (
        <div className="creation-button-container">
            <IconButton className='creation-button' icon={add} onClick={handleClick}/>
            <Dropdown anchor={dropdownAnchor as HTMLElement} open={dropdownAnchor !== null} onClose={handleClose} >
                <DropdownItem icon={flashcards} text='New deck' to='/flashcards/create' onClick={handleClose}/>
                <DropdownItem icon={quizzes} text='New quiz' onClick={handleClose}/>
                <DropdownItem icon={notes} text='New notes' onClick={handleClose}/>
            </Dropdown>
        </div>
        
    )
}

export default CreationButton