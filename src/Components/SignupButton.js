import React from 'react'
import './SignupButton.css'

const revealingIcon = "./Images/EyeIconEnabled.png"
const revealingIconAlt = "A black & white eye"
const nonRevealingIcon = "./Images/EyeIconDisabled.png"
const nonRevealingIconAlt = "A black & white eye with a diagonal line over it"

export default function SignupButton({id, name, type, placeholder, value, onChangeAction, errorMessage})
{
    const [passwordReveal, setPasswordReveal] = React.useState(false)

    function handleClick()
    {
        setPasswordReveal(currentPasswordReveal => {
            return !currentPasswordReveal
        })
    }

    function decideType()
    {
        if(type === "password")
        {
            if(passwordReveal === true)
                return "text"

            return "password"
        }

        return type
    }

    return (
        <div className="signup-button">
            <label
                htmlFor={id}
                className="signup-button-label"
            >
                {placeholder}
            </label>
            <div className="signup-button-input-holder">
                <input
                    className="signup-button-input"
                    type={decideType()}
                    placeholder={placeholder}
                    name={name}
                    id={id}
                    value={value}
                    onChange={onChangeAction}
                />
                <div className="signup-button-icon-holder">
                    {(type === "password") ?
                        <img
                            className="signup-button-icon"
                            src={(passwordReveal) ? revealingIcon : nonRevealingIcon}
                            alt={(passwordReveal) ? revealingIconAlt : nonRevealingIconAlt}
                            onClick={handleClick}
                        /> : <div></div>
                    }
                </div>
            </div>
            <div
                className="signup-button-error-message"
                style={(errorMessage === "No Error") ? {color: 'transparent'} : {}}
            >
                {errorMessage}
            </div>
        </div>
    )
}
