import './NavbarButton.css'

/*******************************
 * The Navbar Button Component *
 *******************************/
export default function NavbarButton({textInButton, isActive, onClickAction})
{
    /* An active button has different style from an inactive button. Depending on the
     * value of the 'isActive' prop we are receiving we decide which of the two styles
     * to apply to the button. We also receive the on-click action and the text on the
     * button as props.
     */
    return (
        <button
            onClick={onClickAction}
            className={(isActive) ? "navbar-button-active" : "navbar-button-inactive"}
        >
            {textInButton}
        </button>
    )
}
