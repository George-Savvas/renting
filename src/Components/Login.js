import React from 'react'
import LoginButton from './LoginButton.js'
import {useNavigate} from 'react-router-dom'
import port from '../Port.js'
import './Login.css'

/***********************
 * The Login Component *
 ***********************/
export default function Login({appState, setAppState})
{
    /* A hook we will use to redirect the user to
     * the home page in case the login is successful.
     */
    const navigate = useNavigate()

    /* We create a state variable which stores the
     * username and the password the user types.
     */
    const [formData, setFormData] = React.useState({
        username: "", password: ""
    })

    /* We create a state variable which displays
     * the error message in case the login fails.
    */
    const [errorMessage, setErrorMessage] = React.useState("No Error")

    /* Updates the data of the 'formData' state variable
     * every time the user makes changes inside the username
     * or the password input box.
     */
    function updateFormData(event)
    {
        setFormData(currentState => {
            return {...currentState, [event.target.name] : event.target.value}
        })
    }

    /* Actions we will take when the "Login" button is clicked by the user */
    const handleSubmit = async (event) => {

        /* We prevent the page refresh, which is the default action on form submit */
        event.preventDefault()

        /* We request a user with the given username & password from the server */
        const response = await fetch(`http://localhost:${port}/auth/login`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        })

        /* We convert the server's response to JSON format */
        const responseAsJson = await response.json()

        /* We store the message from the server to a seperate variable */
        const serverMessage = responseAsJson.message

        /* Case the server sent an error message (failed login) */
        if(serverMessage !== "succesful login!")
        {
            /* We display the error in the screen */
            setErrorMessage(serverMessage)
            return
        }

        /* Case the server sent a success message (successful login)
         *
         * We store the user's username in the app state
         */
        setAppState(currentState => {
            return {...currentState,
                userIsLogged: true,
                username: formData.username
            }
        })

        /* Finally, we navigate to the home page on successful login */
        navigate("/")
    }

    /* A callback function that updates the form data. It can be used
     * as "onChange" action whenever a user types input in an input box.
     */
    const updateformDataCallback = (event) => {updateFormData(event)}

    /* An array with all the information of the two input boxes
     * of the login page (the username and the password input boxes).
     */
    const loginInputs = [
        {
            index: 0,
            id: "username",
            name: "username",
            type: "text",
            placeholder: "Username",
            value: formData.username,
            onChangeAction: updateformDataCallback
        },
        {
            index: 1,
            id: "password",
            name: "password",
            type: "password",
            placeholder: "Password",
            value: formData.password,
            onChangeAction: updateformDataCallback
        }
    ]

    /* Using the array of the two input boxes, we create
     * a renderable array of these two input boxes.
     */
    const domLoginInputs = loginInputs.map(input => {
        return (
            <LoginButton
                key={input.index}
                id={input.id}
                name={input.name}
                type={input.type}
                placeholder={input.placeholder}
                value={input.value}
                onChangeAction={input.onChangeAction}
            />
        )
    })

    return (
        <div className="login">
            <div className="login-title">
                Fill in your username and password
            </div>
            <div className="login-form-parent">
                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >
                    <div className="login-form-buttons">
                        {domLoginInputs}
                    </div>
                    <div
                        className="login-error-message"
                        style={(errorMessage === "No Error") ?
                            {color: 'transparent'} : {}
                        }
                    >
                        {errorMessage}
                    </div>
                    <div className="login-form-submit-button-parent">
                        <input
                            className="login-form-submit-button"
                            type="submit"
                            value="Login"
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}
