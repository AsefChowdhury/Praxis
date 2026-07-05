import type React from "react"
import "./Card.css"

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode
    className?: string
    style?: React.CSSProperties
    onClick ?: React.MouseEventHandler<HTMLElement>
}

function Card({children, className, ...props}: CardProps) {
    return(
        <div className={`card-container ${className ?? ''}`} onClick={props.onClick}>
            {children}
        </div>
    )
}

export default Card