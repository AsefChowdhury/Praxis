import { useState } from 'react';
import './main-layout-styles/Profile.css'
import settings from '../../assets/settings.svg?react'
import light from '../../assets/light.svg?react'
//import dark from '../../assets/dark.svg?react'
import logoutIcon from '../../assets/logout.svg?react'
import Dropdown from '../../components/dropdown/Dropdown';
import DropdownItem from '../../components/dropdown/DropdownItem';
import { useAuth } from '../../authentication/AuthContext';
import { useToast } from '../../components/toast/toast';
import api from '../../api';

function Profile() {
    const { setAuth } = useAuth();
    const toast = useToast();
    const [dropdownAnchor, setDropdownAnchor] = useState<null | HTMLElement>(null);

    const logoutUser = async () => {
        handleClose();
        try{
            const response = await api.post('/api/user/logout/', {}, {withCredentials: true});
    
            if (response.status === 200) {
                setAuth(null);
            } 
        } catch (error) {
            toast?.addToast({message: "Something went wrong whilst logging out, please try again", type: "error"});
        }
    }
    
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
        <div className="profile-container">
            <button className='profile-button' onClick={handleClick}></button>
            <Dropdown anchor={dropdownAnchor as HTMLElement} open={dropdownAnchor !== null} onClose={handleClose} >
                <DropdownItem text={'Settings'} icon={settings} onClick={handleClose}/>
                <DropdownItem text={'Light mode'} icon={light}/>
                <DropdownItem className='logout' text={'Logout'} icon={logoutIcon} onClick={logoutUser}/>
            </Dropdown>
        </div>
    )
}

export default Profile