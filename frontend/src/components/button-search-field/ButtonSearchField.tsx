import search from '../../assets/search.svg';
import close from '../../assets/close.svg?react';
import './ButtonSearchField.css'
import { useState } from 'react';
import IconButton from "../icon-button/IconButton";

function ButtonSearchField () {
    const [searchTerm, setSearchTerm] = useState('');
    
    const handleSearch = () => {
        if(searchTerm.length <= 0){
            return;
        }
        console.log(searchTerm)
    }
    return (
        <div className="search-field-container">
            <input type="text" placeholder="Search" className="search-field" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
            {searchTerm.length > 0 &&
                <div className="delete-button">
                    <IconButton icon={close} onClick={() => {setSearchTerm('')}}/>
                </div>
            }
            <button className="search-button" onClick={handleSearch}>
                <img src={search} alt="Search"/>
            </button>
        </div>
    )
}

export default ButtonSearchField