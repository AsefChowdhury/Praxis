import IconButton from "../icon-button/IconButton";
import "./toast.css";
import close from "../../assets/close.svg?react";
import Error from "../../assets/error.svg?react";
import Warning from "../../assets/warning.svg?react";
import Success from "../../assets/success.svg?react";
import { createContext, useContext, useState } from "react";

type ToastContextType = {
    addToast: (toast: ToastProps) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
    return useContext(ToastContext);
};

type ToastProps = {
    message: string;
    type: "success" | "error" | "warning";
    id?: number;
    onClose?: () => void;
}

function Toast(props: ToastProps) {
    return (
        <div className={`toast ${props.type}`}>
            <div className="toast-content">
                {props.type === "success" ? <Success className="toast-icon success"/> : props.type === "error" ? <Error className="toast-icon error"/> : <Warning className="toast-icon warning"/>}
                <p className="toast-message">{props.message}</p>
            </div>
            <IconButton icon={close} className="close-button" onClick={props.onClose}/>
        </div>
    );
}

type ToastProviderProps = {
    children: React.ReactNode
}
export function ToastProvider(props: ToastProviderProps) {
    const [toasts, setToasts] = useState<ToastProps[]>([]);

    const addToast = (toast: ToastProps) => {
        setToasts([...toasts, toast]);
    }

    const removeToast = (id: number) => {
        setToasts((toasts) => toasts.filter(toast => toast.id !== id));
    }

    return (
        <ToastContext value={{addToast}}>
            {props.children}
            <div className="toasts">
                {toasts.map((toast, index) => {
                    toast.id = index;
                    return (<Toast key={index} id={index} message={toast.message} type={toast.type} onClose={() => removeToast(index)}/>)
                })}
            </div>
        </ToastContext>
    )
}

