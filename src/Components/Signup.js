import React from 'react'
import SignupButton from './SignupButton.js'
import './Signup.css'

/*************************************************
 * Possible error messages under the input boxes *
 *************************************************/
const noError = "No Error"
const emptyField = "Must not be empty"
const invalidPasswordSize = "Must have at least 3 and at most 15 characters"
const noMatchBetweenPasswordAndPassconf = "Must be identical to the password"
const tooLargeTelephone = "Max 9 digits"
const nonArithmeticTelephone = "Must contain only arithmetic characters"

/************************
 * The Signup Component *
 ************************/
export default function Signup()
{
    /* This state determines whether or not the user has completed the signup.
     * If the user has completed the signup, the signup form no longer appears
     * on the screen. An informative message appears instead.
     */
    const [signupState, setSignupState] = React.useState(false)

    /* This state contains all the data of the signup form, apart from the
     * password confirmation, which is stored in a seperate state because
     * on successful signup we send all the information in 'formData' to the
     * server, but we do not want to send the password confirmation there.
     * With that information the server will create a new user in the system.
     */
    const [formData, setFormData] = React.useState({
        username: "",
        password: "",
        name: "",
        lastname: "",
        email: "",
        telephone: "",
        role: ""
    })

    /* The password confirmation's seperate state */
    const [passconf, setPassconf] = React.useState("")

    /* A state with the error message of each button */
    const [errorMessages, setErrorMessages] = React.useState([
        emptyField, emptyField, emptyField, emptyField,
        emptyField, emptyField, emptyField, noError
    ])

    /* Returns 'true' if the input string contains only digits.
     * Returns 'false' if the string has at least one non-digit character.
     * Returns 'false' for the empty string.
     */
    function hasOnlyDigits(inputString)
    {
        /* We consider that the empty string is not an arithmetic string. */
        if(inputString === "")
            return false

        /* Initially we consider the number has only digits */
        let allDigits = true
        let i, size = inputString.length

        /* We will examine each character of the string. If at
         * least one character is not a digit, we return 'false'.
         */
        for(i = 0; i < size; i++)
        {
            if(inputString[i] < '0' || inputString[i] > '9')
            {
                allDigits = false
                break
            }
        }

        /* We return the final result */
        return allDigits
    }

    /* Updates the error message under the input box where
     * the event took place if the message needs to change
     */
    function updateErrorMessagesState(event)
    {
        /* We take different actions depending on which input box the event took place */
        switch(event.target.name)
        {
            /* Case the event took place in the passwords's input box */
            case "password":
            {
                /* We retrieve the current message under the passwords's input box.
                 * We also declare a variable for the new message.
                 */
                const currentMessage = errorMessages[2]
                let newMessage = currentMessage;

                /* Case the new password does not have a correct size */
                if((event.target.value.length < 3) || (event.target.value.length > 15))
                    newMessage = invalidPasswordSize

                /* Case the new password has a correct size */
                else
                    newMessage = noError

                /* Case the new password is the empty string */
                if(event.target.value.length === 0)
                    newMessage = emptyField

                /* We update the message under the password if it
                 * is different from the already existing message
                 */
                if(newMessage !== currentMessage)
                {
                    setErrorMessages(currentErrorMessages => {
                        return currentErrorMessages.map((message, i) => {
                            return (i !== 2) ? message : newMessage
                        })
                    })
                }

                /* We retrieve the current error message of the password
                 * confirmation box
                 */
                const currentMessageForConf = errorMessages[3]
                let newMessageForConf = currentMessage

                /* Case the new password is not equal to the confirmation */
                if(event.target.value !== passconf)
                    newMessageForConf = noMatchBetweenPasswordAndPassconf

                /* We update the message under the passconf if it
                 * is different from the already existing message
                 */
                if(newMessageForConf !== currentMessageForConf)
                {
                    setErrorMessages(currentErrorMessages => {
                        return currentErrorMessages.map((message, i) => {
                            return (i !== 3) ? message : newMessageForConf
                        })
                    })
                }

                /* There is nothing else to do in this case */
                break
            }

            /* Case the event took place in the passconf's input box */
            case "passconf":
            {
                /* We retrieve the current error message of the password
                 * confirmation box
                 */
                const currentMessage = errorMessages[3]
                let newMessage = currentMessage

                /* Case the new passconf is the empty string */
                if(event.target.value.length === 0)
                    newMessage = emptyField

                /* Case the new passconf is not equal to the password */
                if(event.target.value !== formData.password)
                    newMessage = noMatchBetweenPasswordAndPassconf

                /* Case the new passconf is not empty and equal to the
                 * password
                 */
                else
                    newMessage = noError

                /* We update the message under the passconf if it
                 * is different from the already existing message
                 */
                if(newMessage !== currentMessage)
                {
                    setErrorMessages(currentErrorMessages => {
                        return currentErrorMessages.map((message, i) => {
                            return (i !== 3) ? message : newMessage
                        })
                    })
                }

                /* There is nothing else to do in this case */
                break
            }

            /* Case the event took place in the telephone's input box */
            case "telephone":
            {
                /* We retrieve the current message under the telephone's input box.
                 * We also declare a variable for the new message.
                 */
                const currentMessage = errorMessages[6]
                let newMessage = currentMessage;

                /* Case the new telephone is larger but now it is too large */
                if(event.target.value.length >= 10)
                    newMessage = tooLargeTelephone

                /* Case the old telephone was too large but now it is not */
                if(((event.target.value.length > 0)) && (event.target.value.length < 10))
                    newMessage = noError

                /* Case the new telephone is not an arithmetic */
                if(!hasOnlyDigits(event.target.value))
                    newMessage = nonArithmeticTelephone

                /* Case the new telephone is the empty string */
                if(event.target.value.length === 0)
                    newMessage = emptyField

                /* We update the message under the telephone if it
                 * is different from the already existing message
                 */
                if(newMessage !== currentMessage)
                {
                    setErrorMessages(currentErrorMessages => {
                        return currentErrorMessages.map((message, i) => {
                            return (i !== 6) ? message : newMessage
                        })
                    })
                }

                /* There is nothing else to do in this case */
                break
            }

            /* Default case (we do nothing in this case) */
            default:
            {
                break
            }
        }
    }

    /* Updates the state of the form data whenever the user changes the
     * input of any button (except the password confirmation button).
     */
    function updateFormData(event)
    {
        updateErrorMessagesState(event)

        setFormData(currentFormData => {
            return {...currentFormData, [event.target.name]: event.target.value}
        })

        console.log(`${event.target.name} was changed to ${event.target.value}`)
    }

    /* Updates the state of the password confirmation whenever the
     * user changes the input of the password confirmation button.
     */
    function updatePassConf(event)
    {
        updateErrorMessagesState(event)

        setPassconf(event.target.value)
        console.log(`${event.target.name} was changed to ${event.target.value}`)
    }

    /* A callback function that updates the form data. It can be used
     * as "onChange" action whenever a user types input in an input box
     * (the password confirmation box is excluded).
     */
    const updateformDataCallback = (event) => {updateFormData(event)}

    /* A callback function that updates the password confirmation state.
     * It can be used as "onChange" action whenever a user types input in
     * the password confirmation box.
     */
    const updatePassConfCallback = (event) => {updatePassConf(event)}

    /* We store all the information of each input box in an array */
    let signupButtons = [
        {
            index: 0,
            id: "username",
            name: "username",
            type: "text",
            placeholder: "Username",
            value: formData.username,
            onChangeAction: updateformDataCallback,
            errorMessage: errorMessages[0]
        },
        {
            index: 1,
            id: "email",
            name: "email",
            type: "text",
            placeholder: "Email",
            value: formData.email,
            onChangeAction: updateformDataCallback,
            errorMessage: errorMessages[1]
        },
        {
            index: 2,
            id: "password",
            name: "password",
            type: "password",
            placeholder: "Password",
            value: formData.password,
            onChangeAction: updateformDataCallback,
            errorMessage: errorMessages[2]
        },
        {
            index: 3,
            id: "passconf",
            name: "passconf",
            type: "password",
            placeholder: "Password Confirmation",
            value: passconf,
            onChangeAction: updatePassConfCallback,
            errorMessage: errorMessages[3]
        },
        {
            index: 4,
            id: "name",
            name: "name",
            type: "text",
            placeholder: "First Name",
            value: formData.name,
            onChangeAction: updateformDataCallback,
            errorMessage: errorMessages[4]
        },
        {
            index: 5,
            id: "lastname",
            name: "lastname",
            type: "text",
            placeholder: "Last Name",
            value: formData.lastname,
            onChangeAction: updateformDataCallback,
            errorMessage: errorMessages[5]
        },
        {
            index: 6,
            id: "telephone",
            name: "telephone",
            type: "text",
            placeholder: "Telephone",
            value: formData.telephone,
            onChangeAction: updateformDataCallback,
            errorMessage: errorMessages[6]
        },
        {
            index: 7,
            id: "role",
            name: "role",
            type: "text",
            placeholder: "Role",
            value: formData.role,
            onChangeAction: updateformDataCallback,
            errorMessage: errorMessages[7]
        },
    ]

    /* Examines if there are any errors in the submitted form */
    function errorExists()
    {
        /* Initially we consider there are no errors */
        let error = false
        let i, size = signupButtons.length

        /* We examine each input box for errors */
        for(i = 0; i < size; i++)
        {
            /* If the current input box has an error,
             * the signup form cannot be submitted.
             */
            if(signupButtons[i].errorMessage !== noError)
            {
                error = true
                break
            }
        }

        /* We return the final value of the error */
        return error
    }

    /* Actions we will take when the "Submit" button is clicked by the user */
    const handleSubmit = (event) => {

        /* We prevent the page refresh, which is the default action on form submit */
        event.preventDefault()

        /* If the form has errors, it cannot be submitted. Therefore we return */
        if(errorExists())
        {
            console.log("This form has errors. It cannot be submitted until the errors are fixed")
            return
        }

        console.log(formData)
        console.log(`Password: ${formData.password}, Passconf: ${passconf}`)

        fetch("http://localhost:7000/auth/addUser", {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
            })

        setSignupState(true)
    }

    /* We create a renderable array of the input boxes */
    const domSignupButtons = signupButtons.map(button => {
        return (
            <SignupButton
                key={button.index}
                id={button.id}
                name={button.name}
                type={button.type}
                placeholder={button.placeholder}
                value={button.value}
                onChangeAction={button.onChangeAction}
                errorMessage={button.errorMessage}
            />
        )
    })

    /* Scenario 1: The user has not yet completed the singup.
     * ^^^^^^^^^^
     */
    const domSignupForm = (
        <div className="signup">
            <form onSubmit={handleSubmit}>
                <div className="signup-form-buttons">
                    {domSignupButtons}
                </div>
                <div className="signup-form-submit-parent">
                    <input
                        className="signup-form-submit"
                        type="submit"
                        value="Submit"
                    />
                </div>
            </form>
        </div>
    )

    /* Scenario 2: The user has successfully completed the singup.
     * ^^^^^^^^^^
     */
    const domSignupComplete = (
        <div className="signup-complete">
            The signup was completed successfully!
        </div>
    )

    /* We render one of the two scenarios, depending on the "singupComplete" state variable */
    return (
        <div>
            {(signupState) ? domSignupComplete : domSignupForm}
        </div>
    )
}
