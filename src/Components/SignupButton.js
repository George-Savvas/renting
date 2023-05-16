import React from 'react'
import './SignupButton.css'

/*******************************************************************************
 *  Paths & Alternative texts for the two eye images (the open and closed eye) *
 * which are used to reveal or hide the password and the password confirmation *
 *******************************************************************************/
const revealingIcon = "./Images/EyeIconEnabled.png"
const revealingIconAlt = "A black & white eye"
const nonRevealingIcon = "./Images/EyeIconDisabled.png"
const nonRevealingIconAlt = "A black & white eye with a diagonal line over it"

/*******************************
 * The Signup Button Component *
 *******************************/
export default function SignupButton({id, name, type, placeholder, value, onChangeAction, errorMessage})
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

    /* Text input used in case the 'type' prop is not "radio" */
    const domInputBox = (
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

    /* Radio inputs used in case the 'type' prop is "radio" */
    const domRadioInputs = (
        <div className="signup-radio">
            <label className="signup-button-label">
                What role do you want to have?
            </label>
            <div className="signup-radio-input-parent">
                <div className="signup-radio-label-and-input">
                    <input
                        className="signup-radio-input-circle"
                        id={id + "1"}
                        name={name}
                        type="radio"
                        value="Tenant"
                        onClick={onChangeAction}
                    />
                    <label
                        className="signup-radio-label"
                        htmlFor={id + "1"}>
                    Tenant
                    </label>
                </div>
                <div className="signup-radio-label-and-input">
                    <input
                        className="signup-radio-input-circle"
                        id={id + "2"}
                        name={name}
                        type="radio"
                        value="Landlord"
                        onClick={onChangeAction}
                    />
                    <label
                        className="signup-radio-label"
                        htmlFor={id + "2"}>
                    Landlord
                    </label>
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

    /* If the given 'type' prop is "radio", we render radio inputs.
     * Otherwise, we render a text input.
     */
    return (
        <div>
            {(type === "radio") ? domRadioInputs : domInputBox}
        </div>
    )
}
