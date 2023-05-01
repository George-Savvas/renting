import React from 'react'
import {useNavigate} from 'react-router-dom'
import Navbar from './Navbar.js'
import './Header.css'

const logoImageSrc = "./Images/HousingEasyLogo.png"
const logoImageAlt = "Housing Easy Logo"

export default function Header({appState, setAppState})
{
    const navigate = useNavigate()

    function linkToHome()
    {
        navigate("/")
    }

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
