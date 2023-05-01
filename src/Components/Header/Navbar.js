import React from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import NavbarButton from './NavbarButton.js'
import {initialButtons, accountButtons} from './NavbarButtonsInfo.js'
import './Navbar.css'

function updateButtonActivity(buttonArray)
{
    const buttonArrayLength = buttonArray.length
    let i

    for(i = 0; i < buttonArrayLength; i++)
    {
        const currentButton = buttonArray[i]

        if(currentButton.link !== window.location.pathname)
            currentButton.active = false
        else
            currentButton.active = true
    }
}

export default function Navbar({appState, setAppState})
{
    /* A hook we will use to redirect to other pages */
    const navigate = useNavigate()

    /* A hook we will use to monitor page redirections */
    const location = useLocation()

    /* Actions whenever the program redirects to another page */
    React.useEffect(() => {

        setAppState(currentState => {
            const updatedButtons = (currentState.userIsLogged) ? accountButtons : initialButtons
            updateButtonActivity(updatedButtons)
            return {...currentState, navbarButtons: updatedButtons}
        })

    }, [setAppState, location])

    /* Actions when a button is clicked */
    function navigateIfNotActive(button)
    {
        if(button.active === true)
            return

        /* One extra step in case the clicked button was the "Logout" button */
        if(button.name === "Logout")
        {
            setAppState(currentState => {
                return {...currentState, userIsLogged: false}
            })
        }

        /* We navigate to the corresponding link of the button if the button is not active
         * (if the button is active, that means we are already in that link)
         */
        navigate(button.link)
    }

    const domButtons = appState.navbarButtons.map(button => {
        return (
            <NavbarButton
                key={button.index}
                textInButton={button.name}
                isActive={button.active}
                onClickAction={() => {
                    navigateIfNotActive(button)
                }}
            />
        )
    })

    return (
        <div className="navbar">
            <div className="navbar-buttons">
                {domButtons}
            </div>
        </div>
    )
}
