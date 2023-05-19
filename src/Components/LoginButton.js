import React from 'react'
import './LoginButton.css'

/*******************************************************************************
 *  Paths & Alternative texts for the two eye images (the open and closed eye) *
 * which are used to reveal or hide the password and the password confirmation *
 *******************************************************************************/
const revealingIcon = "./Images/EyeIconEnabled.png"
const revealingIconAlt = "A black & white eye"
const nonRevealingIcon = "./Images/EyeIconDisabled.png"
const nonRevealingIconAlt = "A black & white eye with a diagonal line on it"

/******************************
 * The Login Button Component *
 ******************************/
export default function LoginButton({id, name, type, placeholder, value, onChangeAction})
{
    /* A state that decides whether the password must be
     * revealed or not if the input box is a password box
     */
    const [passwordReveal, setPasswordReveal] = React.useState(false)

    /* A function that toggles the password revealing/non-revealing */
    function handleClick()
    {
        setPasswordReveal(currentPasswordReveal => {
            return !currentPasswordReveal
        })
    }

    /* Decides the "type" field of an input box */
    function decideType()
    {
        /* If the given 'type' prop is "password", then we must reveal
         * the password in the box if the 'passwordReveal' state variable
         * implies so, or hide it otherwise. To reveal the password, we
         * pass the "text" parameter to the "type" field of the input box.
         * To hide it, we pass the "password" parameter.
         */
        if(type === "password")
        {
            if(passwordReveal === true)
                return "text"

            return "password"
        }

        /* If the 'type' prop is different from "password", we simply
         * return the type itself, because there are no dynamic changes
         * on the rest input types.
         */
        return type
    }

    return (
        <div className="login-button">
            <label
                htmlFor={id}
                className="login-button-label"
            >
                {placeholder}
            </label>
            <div className="login-button-input-holder">
                <input
                    className="login-button-input"
                    type={decideType()}
                    placeholder={placeholder}
                    name={name}
                    id={id}
                    value={value}
                    onChange={onChangeAction}
                />
                <div className="login-button-icon-holder">
                    {(type === "password") ?
                        <img
                            className="login-button-icon"
                            src={(passwordReveal) ? revealingIcon : nonRevealingIcon}
                            alt={(passwordReveal) ? revealingIconAlt : nonRevealingIconAlt}
                            onClick={handleClick}
                        /> : <div></div>
                    }
                </div>
            </div>
        </div>
    )
}
