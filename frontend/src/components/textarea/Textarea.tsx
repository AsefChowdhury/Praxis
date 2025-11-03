import './Textarea.css'

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  variant?: "outlined" | "underlined";
  error?: string;
}

function Textarea({variant = "outlined", className, ...props}: TextareaProps) {
  return (
    <div className={`textarea-container ${variant} ${className || ''}`}>
      <textarea {...props} className="textarea"/>
    </div>
  )
}

export default Textarea
