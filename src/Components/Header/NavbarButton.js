import './NavbarButton.css'

export default function NavbarButton({textInButton, isActive, onClickAction})
{
    return (
        <button
            onClick={onClickAction}
            className={(isActive) ? "navbar-button-active" : "navbar-button-inactive"}
        >
            {textInButton}
        </button>
    )
}
