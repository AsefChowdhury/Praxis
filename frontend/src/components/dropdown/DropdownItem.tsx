import { Link, useNavigate } from "react-router-dom";
import './dropdown-styles/DropdownItem.css'

type DropdownItemProps = {
    className?: string;
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
    text: string;
    to?: string;
    style?: React.CSSProperties;
    onClick?: () => void
};

function DropdownItem(props: DropdownItemProps){

    if (props.to) {
        return(
            <Link className={`dropdown-item  ${props.className ?? ''}`} to={props.to} onClick={props.onClick} style={props.style}>
                {props.icon && <props.icon className='dropdown-item-icon' />}
                <span className='dropdown-item-text'>{props.text}</span>
            </Link>
        )
    }

    return(
        <a className={`dropdown-item  ${props.className ?? ''}`} onClick={props.onClick} style={props.style}>
            {props.icon && <props.icon className={`dropdown-item-icon ${props.className ?? ''}`} />}
            <span className='dropdown-item-text'>{props.text}</span>
        </a>
    )
}

export default DropdownItem