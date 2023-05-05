import React from 'react'
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
    }

    function updatePassConf(event)
    {
        setPassconf(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        console.log(JSON.stringify({ formData }))
        console.log(`Password: ${formData.password}, Passconf: ${passconf}`)

        fetch("http://localhost:7000/auth/addUser", {
            method: 'POST',
            body: JSON.stringify({ formData }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
    }

    return (
        <div className="signup">
            <form
                className="signup-form"
                onSubmit={handleSubmit}
            >
                <label htmlFor="id" className="signup-form-label">ID</label>
                <input
                    className="signup-form-input"
                    type="text"
                    placeholder="ID"
                    name="id"
                    id="id"
                    value={formData.id}
                    onChange={updateFormData}
                />
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
                    value={passconf}
                    onChange={updatePassConf}
                />
                <label htmlFor="name" className="signup-form-label">First Name</label>
                <input
                    className="signup-form-input"
                    type="text"
                    placeholder="First Name"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={updateFormData}
                />
                <label htmlFor="lastname" className="signup-form-label">Last Name</label>
                <input
                    className="signup-form-input"
                    type="text"
                    placeholder="Last Name"
                    name="lastname"
                    id="lastname"
                    value={formData.lastname}
                    onChange={updateFormData}
                />
                <label htmlFor="email" className="signup-form-label">Email</label>
                <input
                    className="signup-form-input"
                    type="text"
                    placeholder="Email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={updateFormData}
                />
                <label htmlFor="telephone" className="signup-form-label">Telephone</label>
                <input
                    className="signup-form-input"
                    type="text"
                    placeholder="Telephone"
                    name="telephone"
                    id="telephone"
                    value={formData.telephone}
                    onChange={updateFormData}
                />
                <label htmlFor="role" className="signup-form-label">Role</label>
                <input
                    className="signup-form-input"
                    type="text"
                    placeholder="Role"
                    name="role"
                    id="role"
                    value={formData.role}
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
