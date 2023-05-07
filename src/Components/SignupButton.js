import './SignupButton.css'

export default function SignupButton({id, name, type, placeholder, value, onChangeAction})
{
    return (
        <div className="signup-button">
            <label
                htmlFor={id}
                className="signup-button-label"
            >
                {placeholder}
            </label>
            <input
                className="signup-button-input"
                type={type}
                placeholder={placeholder}
                name={name}
                id={id}
                value={value}
                onChange={onChangeAction}
            />
        </div>
    )
}
