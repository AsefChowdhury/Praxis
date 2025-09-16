import DrawerItem from "../../components/side-drawer/DrawerItem";
import IconButton from "../../components/icon-button/IconButton";
import NavigationBar from "../../components/navigation-bar/NavigationBar";
import { Link, Outlet, NavLink } from "react-router-dom";
import { useState, type ReactElement } from "react";
import menu from '../../assets/menu.svg?react';
import "./core-pages-layout-styles/CorePagesStyles.css"
import Button from "../../components/button/Button";


type TopDropDownItemProps = {
    text: string;
    to: string;
    onClick?: () => void
}

type CorePagesDropDownMenuProps = {
    children: ReactElement<typeof DrawerItem> | ReactElement<typeof DrawerItem>[];
    open: boolean
    onClose?: () => void
}


function CorePagesDropDown(props: CorePagesDropDownMenuProps) {
    return (
        <>
            <nav className={`temporary-drop-down ${props.open ? 'open' : ''}`}>
                {props.children}
            </nav>
            <div className={`overlay ${props.open ? 'active' : ''}` } onClick={props.onClose}></div>
        </>
    )
}


function CorePagesDropDownItem(props: TopDropDownItemProps){
    return(
        <NavLink className={({isActive}) => (isActive ? 'drop-down-item active' : 'drop-down-item')}to={props.to} onClick={props.onClick}>
            {props.text}
        </NavLink>
    )
}

function CorePagesLayout(){
    const [openDrawer, setOpenDrawer] = useState(false);
    
    return(
        <div className="core-pages-layout">
            <NavigationBar>
                <div className="nav-bar-menu">
                    <div className="core-pages-menu-button">
                        <IconButton icon={menu} onClick={() => {setOpenDrawer(!openDrawer)}}/>
                    </div>
                    <h1 className='core-pages-logo'>Logo</h1>
                </div>

                <div className="core-pages-navigation">
                    <Link to="/" className="link">Home Page</Link>
                    <Link to="/about-us" className="link">About Us</Link>
                    <Link to="/contact-us" className="link">Contact Us</Link>
                </div>

                <div className="auth-link">
                    <Button text="Login" variant="filled" to="/auth/sign-in" />
                </div>              
            </NavigationBar>  
            <CorePagesDropDown open={openDrawer} onClose={() => {setOpenDrawer(false)}}>
                <CorePagesDropDownItem to="/" text="Home page" onClick={() => {setOpenDrawer(false)}}/>
                <CorePagesDropDownItem to="/about-us" text="About us" onClick={() => {setOpenDrawer(false)}}/>
                <CorePagesDropDownItem to="/contact-us" text="Contact us" onClick={() => {setOpenDrawer(false)}}/>
            </CorePagesDropDown>

            <Outlet/>
        </div>
    )
}

export default CorePagesLayout;