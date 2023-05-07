import {Link} from "react-router-dom"
import './Login.css'

export default function Login({appState, setAppState})
{
    function handleClick()
    {
        setAppState(currentState => {
            return {...currentState, userIsLogged: true}
        })
    }

    return (
        <div className="login">
            <p>Login Page</p>
            <Link to="/" onClick={handleClick}>Login</Link>
        </div>
    )
}
