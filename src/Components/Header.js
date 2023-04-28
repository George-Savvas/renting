import React from 'react'
import {useNavigate} from 'react-router-dom'
import Navbar from './Navbar.js'
import './Header.css'

const logoImageSrc = "./Images/HousingEasyLogo.png"
const logoImageAlt = "Housing Easy Logo"

export default function Header()
{
    const navigate = useNavigate()

    const [logoSwitch, setLogoSwitch] = React.useState(true)

    function flipLogoSwitch()
    {
        setLogoSwitch(prevLogoSwitch => !prevLogoSwitch)
    }

    function linkToHome()
    {
        flipLogoSwitch()
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
            <Navbar logoSwitch={logoSwitch}/>
        </div>
    )
}
