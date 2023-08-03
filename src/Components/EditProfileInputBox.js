import React from 'react'
import './EditProfileInputBox.css'

/*******************************************************************************
 *  Paths & Alternative texts for the two eye images (the open and closed eye) *
 * which are used to reveal or hide the password and the password confirmation *
 *******************************************************************************/
const revealingIcon = "./Images/EyeIconEnabled.png"
const revealingIconAlt = "A black & white eye"
const nonRevealingIcon = "./Images/EyeIconDisabled.png"
const nonRevealingIconAlt = "A black & white eye with a diagonal line on it"

/****************************************
 * The Edit Profile Input Box Component *
 ****************************************/
export default function EditProfileInputBox({id, name, type, placeholder, value, onChangeAction, errorMessage})
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
        <div className="edit-profile-input-box">
            <label htmlFor={id} className="edit-profile-input-box-label">
                {placeholder}
            </label>
            <div className="edit-profile-input-box-input-holder">
                <input
                    className="edit-profile-input-box-input"
                    type={decideType()}
                    placeholder={placeholder}
                    name={name}
                    id={id}
                    value={value}
                    onChange={onChangeAction}
                />
                <div className="edit-profile-input-box-icon-parent">
                    {(type === "password") ?
                        <img
                            className="edit-profile-input-box-icon"
                            src={(passwordReveal) ? revealingIcon : nonRevealingIcon}
                            alt={(passwordReveal) ? revealingIconAlt : nonRevealingIconAlt}
                            onClick={handleClick}
                        /> : <div></div>
                    }
                </div>
            </div>
            <div
                className="edit-profile-input-box-error"
                style={{color: (errorMessage === "No Error") ? "transparent" : "red"}}
            >
                {errorMessage}
            </div>
        </div>
    )
}
