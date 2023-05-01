import React from 'react'
import {useNavigate} from 'react-router-dom'
import Navbar from './Navbar.js'
import './Header.css'

/**************************************************************
 * The path of the logo image and its alternative description *
 **************************************************************/
const logoImageSrc = "./Images/HousingEasyLogo.png"
const logoImageAlt = "Housing Easy Logo"

/************************
 * The Header Component *
 ************************/
export default function Header({appState, setAppState})
{
    /* A hook we will use to redirect to the home page
     * whenever the logo on the top left side is clicked
     */
    const navigate = useNavigate()

    /* A function that redirects the user to the home */
    function linkToHome() { navigate("/") }

    return (
        <div className="header">
            <div className="header-logo" onClick={linkToHome}>
                <img className="header-logo-image"
                    src={logoImageSrc}
                    alt={logoImageAlt}
                />
                <p className="header-logo-title">
                    Housing Easy
                </p>
            </div>
            <Navbar appState={appState} setAppState={setAppState}/>
        </div>
    )
}
