import React from 'react'
import {useNavigate} from "react-router-dom"
import './Logout.css'

/************************
 * The Logout Component *
 ************************/
export default function Logout({appState, setAppState})
{
    /* A hook we will use to redirect the user to
     * the home page when they click the link button.
     */
    const navigate = useNavigate()

    /* A function that leads the user to the home page */
    function handleClick() { navigate("/") }

    return (
        <div className="logout">
            <div className="logout-text">
                You have been logged out
            </div>
            <div
                className="logout-home-link"
                onClick={handleClick}
            >
                Go back to home
            </div>
        </div>
    )
}
