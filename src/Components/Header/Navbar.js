import React from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import NavbarButton from './NavbarButton.js'
import {initialButtons, accountButtons} from './NavbarButtonsInfo.js'
import './Navbar.css'

/************************************************************************
 *  Given an array of buttons, this function activates the button that  *
 * is consistent with the current URL and deactivates the other buttons *
 *                                                                      *
 *  A button which is activated does nothing when clicked. Clicking an  *
 *  inactive button leads to the URL which is connected to that button  *
 ************************************************************************/
function updateButtonActivity(buttonArray)
{
    /* We will traverse the array of buttons */
    const buttonArrayLength = buttonArray.length
    let i

    /* For each button in the array we decide whether or not
     * we must activate it according to the current pathname.
     */
    for(i = 0; i < buttonArrayLength; i++)
    {
        const currentButton = buttonArray[i]

        if(currentButton.link !== window.location.pathname)
            currentButton.active = false

        else
            currentButton.active = true
    }
}

/************************
 * The Navbar Component *
 ************************/
export default function Navbar({appState, setAppState})
{
    /* A hook we will use to redirect to other pages */
    const navigate = useNavigate()

    /* A hook we will use to monitor page redirections */
    const location = useLocation()

    /* Actions when the program redirects to another page */
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
        /* If the button is active, no action must take place */
        if(button.active === true)
            return

        /* We log out the user in case the clicked button was the "Logout" button */
        if(button.name === "Logout")
        {
            setAppState(currentState => {
                return {...currentState,
                    userIsLogged: false,
                    username: ""
                }
            })
        }

        /* We navigate to the corresponding link of the button if the button is not
         * active (if the button is active, that means we are already in that link)
         */
        navigate(button.link)
    }

    /* We convert the buttons' array into a renderable array */
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
