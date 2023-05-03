import React from 'react'
import './Signup.css'

/************************
 * The Signup Component *
 ************************/
export default function Signup()
{
    const [formData, setFormData] = React.useState({
        username: "",
        password: "",
        passconf: ""
    })

    function updateFormData(event)
    {
        setFormData(currentFormData => {
            return {...currentFormData, [event.target.name]: event.target.value}
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log(`Submitted Data: ${formData.username}, ${formData.password}, ${formData.passconf}`)
    }

    return (
        <div className="signup">
            <form
                className="signup-form"
                onSubmit={handleSubmit}
            >
                <label htmlFor="username" className="signup-form-label">Username</label>
                <input
                    className="signup-form-input"
                    type="text"
                    placeholder="Username"
                    name="username"
                    id="username"
                    value={formData.username}
                    onChange={updateFormData}
                />
                <label htmlFor="password" className="signup-form-label">Password</label>
                <input
                    className="signup-form-input"
                    type="text"
                    placeholder="Password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={updateFormData}
                />
                <label htmlFor="passconf" className="signup-form-label">Password Confirmation</label>
                <input
                    className="signup-form-input"
                    type="text"
                    placeholder="Password Confirm"
                    name="passconf"
                    id="passconf"
                    value={formData.passconf}
                    onChange={updateFormData}
                />
                <input
                    className="signup-form-submit"
                    type="submit"
                    value="Submit"
                />
            </form>
        </div>
    )
}
