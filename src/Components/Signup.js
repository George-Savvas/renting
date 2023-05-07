import React from 'react'
import SignupButton from './SignupButton.js'
import './Signup.css'

/************************
 * The Signup Component *
 ************************/
export default function Signup()
{
    const [formData, setFormData] = React.useState({
        id: 0,
        username: "",
        password: "",
        name: "",
        lastname: "",
        email: "",
        telephone: "",
        role: ""
    })

    const [passconf, setPassconf] = React.useState("")

    function updateFormData(event)
    {
        setFormData(currentFormData => {
            return {...currentFormData, [event.target.name]: event.target.value}
        })

        console.log(`${event.target.name} was changed to ${event.target.value}`)
    }

    function updatePassConf(event)
    {
        setPassconf(event.target.value)
        console.log(`${event.target.name} was changed to ${event.target.value}`)
    }

    const handleSubmit = (event) => {

        /* We prevent the page refresh, which is the default action on form submit */
        event.preventDefault()

        console.log(formData)
        console.log(`Password: ${formData.password}, Passconf: ${passconf}`)

        // fetch("http://localhost:7000/auth/addUser", {
        //     method: 'POST',
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(formData)
        // })
    }

    const updateformDataCallback = (event) => {updateFormData(event)}
    const updatePassConfCallback = (event) => {updatePassConf(event)}

    const signupButtons = [
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
        },
        {
            index: 2,
            id: "passconf",
            name: "passconf",
            type: "password",
            placeholder: "Password Confirmation",
            value: passconf,
            onChangeAction: updatePassConfCallback
        },
        {
            index: 3,
            id: "name",
            name: "name",
            type: "text",
            placeholder: "First Name",
            value: formData.name,
            onChangeAction: updateformDataCallback
        },
        {
            index: 4,
            id: "lastname",
            name: "lastname",
            type: "text",
            placeholder: "Last Name",
            value: formData.lastname,
            onChangeAction: updateformDataCallback
        },
        {
            index: 5,
            id: "email",
            name: "email",
            type: "text",
            placeholder: "Email",
            value: formData.email,
            onChangeAction: updateformDataCallback
        },
        {
            index: 6,
            id: "telephone",
            name: "telephone",
            type: "text",
            placeholder: "Telephone",
            value: formData.telephone,
            onChangeAction: updateformDataCallback
        },
        {
            index: 7,
            id: "role",
            name: "role",
            type: "text",
            placeholder: "Role",
            value: formData.role,
            onChangeAction: updateformDataCallback
        },
    ]

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
            />
        )
    })

    return (
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
}
