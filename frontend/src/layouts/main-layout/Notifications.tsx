import IconButton from "../../components/icon-button/IconButton";
import notifications from '../../assets/notifications.svg?react'

function Notifications(){
    return(
        <>
            <IconButton icon={notifications} onClick={() => {console.log('test')}}/>
        </>
    )
}

export default Notifications