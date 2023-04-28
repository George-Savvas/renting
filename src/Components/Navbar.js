import React from 'react'
import {useNavigate} from 'react-router-dom'
import NavbarButton from './NavbarButton.js'
import './Navbar.css'

const initialButtons = [
    {index: 0, name: "Home", active: true, link: "/"},
    {index: 1, name: "About", active: false, link: "/about"},
    {index: 2, name: "Sign up", active: false, link: "/signup"},
    {index: 3, name: "Login", active: false, link: "/login"}
]

export default function Navbar({logoSwitch})
{
    const navigate = useNavigate()

    const [buttons, setButtons] = React.useState(initialButtons)

    React.useEffect(() => {
        setButtons(initialButtons)
    }, [logoSwitch])

    function navigateIfNotActive(buttonIndex)
    {
        const targetButton = buttons[buttonIndex]

        if(targetButton.active === true)
            return

        setButtons(previousButtons => {
            return previousButtons.map(previousButton => {
                return {...previousButton, active: (previousButton.index === buttonIndex) ? true : false}
            })
        })

        navigate(targetButton.link)
    }

    const renderedButtons = buttons.map(button => {
        return (
            <NavbarButton
                textInButton={button.name}
                isActive={button.active}
                onClickAction={() => {
                    navigateIfNotActive(button.index)
                }}
            />
        )
    })

    return (
        <div className="navbar">
            <div className="navbar-buttons">
                {renderedButtons}
            </div>
        </div>
    )
}
