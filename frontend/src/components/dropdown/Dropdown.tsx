import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import './dropdown-styles/Dropdown.css'

type DropdownProps = {
    anchor: HTMLElement | null;
    children: React.ReactNode;
    open: boolean;
    onClose: () => void
    id?: string
};

function Dropdown(props: DropdownProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [ready, setReady] = useState(false);
    const [position, setPosition] = useState<{top: number, left: number}>({top: 0, left: 0});
    
    useEffect(() => {
        if(!props.open) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (props.anchor === null) return;

            const eventTarget = event.target as Node;

            if (props.anchor.contains(eventTarget)) {
                return;
            }

            if (containerRef.current && !containerRef.current.contains(eventTarget)) {
                props.onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('scroll', props.onClose);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('scroll', props.onClose);
        };
        
    }, [props.open]);

    useEffect(() => {
        if(!props.open || !props.anchor){
            setReady(false);
            return;
        };

        const rect = props.anchor.getBoundingClientRect();
        setPosition({top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX});

        setReady(true);

    },[props.open, props.anchor]);
    
    if (!props.open || !ready) return null;

    return ReactDOM.createPortal(
        <div 
        className='dropdown-container' 
        ref={containerRef} 
        id={props.id}
        style={{position: 'fixed', top: position.top, left: position.left}}
        >
            {props.children}
        </div>,
        document.body
    )
}

export default Dropdown