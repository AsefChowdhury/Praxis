import { Link } from 'react-router-dom';
import './IconButton.css'

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    tooltip?: string;
    to?: string;
    className?: string
}

function IconButton({icon: Icon, className,...props}: IconButtonProps) {
    const content = (
        <div className={`icon-button-container ${className ?? ''}`}>
            <button {...props} className="button" disabled={props.disabled}>
                <Icon className="icon-image" fill='currentColor'/>
                {props.tooltip && <span className="tooltiptext">{props.tooltip}</span>}
            </button>
        </div>
    )

    if(props.to){
        return(
            <div className="icon-button-container">
                <Link to={props.to}>
                    <button {...props} className='button'>
                        <Icon className="icon-image" fill='currentColor'/>
                        {props.tooltip && <span className="tooltiptext">{props.tooltip}</span>}
                    </button>
                </Link>
            </div>
        )
    }
    return content
}

export default IconButton