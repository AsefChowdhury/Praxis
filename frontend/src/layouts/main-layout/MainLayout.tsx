import { Outlet } from "react-router-dom"
import SideDrawer from "../../components/side-drawer/SideDrawer"
import dashboard from '../../assets/dashboard.svg?react'
import notes from '../../assets/notes.svg?react'
import menu from '../../assets/menu.svg?react'
import flashcards from '../../assets/flashcards.svg?react'
import quizzes from "../../assets/quizzes.svg?react"
import DrawerItem from "../../components/side-drawer/DrawerItem"
import './main-layout-styles/MainLayout.css'
import ButtonSearchField from "../../components/button-search-field/ButtonSearchField"
import Notifications from "./Notifications"
import Profile from "./Profile"
import NavigationBar from "../../components/navigation-bar/NavigationBar"
import IconButton from "../../components/icon-button/IconButton";
import { useState } from "react"
import CreationButton from "./CreationButton"

function MainLayout() {
    const [openDrawer, setOpenDrawer] = useState(false);
    
    return (
        <div className="main-layout">
            <NavigationBar>
                <div className="navbar-left">
                    <div className="menu-button">
                        <IconButton icon={menu} onClick={() => {setOpenDrawer(!openDrawer)}}/>
                    </div>
                    <h1 className='logo'>Logo</h1>
                </div>
                <div className="navbar-search">
                    <ButtonSearchField />
                </div>
                <div className="navbar-right">
                    <CreationButton/>
                    <Notifications />
                    <Profile />
                </div>
                <div className="navbar-search-mobile">
                    <ButtonSearchField />
                </div>
            </NavigationBar>
            <div className="content-container">
                <SideDrawer type="temporary" open={openDrawer} onClose={() => {setOpenDrawer(false)}}>
                    <DrawerItem to="/dashboard" icon={dashboard} text={'Dashboard'} onClick={() => {setOpenDrawer(false)}}/>
                    <DrawerItem to="/flashcards" icon={flashcards} text={'Flashcards'} onClick={() => {setOpenDrawer(false)}}/>
                    <DrawerItem to="/notes" icon={notes} text={'Notes'} onClick={() => {setOpenDrawer(false)}}/>
                    <DrawerItem to="/quizzes" icon={quizzes} text={'Quizzes'} onClick={() => {setOpenDrawer(false)}}/>
                </SideDrawer>
                <SideDrawer type="permanent" open={openDrawer}>
                    <DrawerItem to="/dashboard" icon={dashboard} text={'Dashboard'} />
                    <DrawerItem to="/flashcards" icon={flashcards} text={'Flashcards'}/>
                    <DrawerItem to="/notes" icon={notes} text={'Notes'}/>
                    <DrawerItem to="/quizzes" icon={quizzes} text={'Quizzes'}/>
                </SideDrawer>
                <div className="page-content">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default MainLayout