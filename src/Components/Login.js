import {Link} from "react-router-dom"
export default function Login({appState, setAppState})
{
    function handleClick()
    {
        setAppState(currentState => {
            return {...currentState, userIsLogged: true}
        })
    }

    return (
        <div>
            <p>Login Page</p>
            <Link to="/" onClick={handleClick}>Login</Link>
        </div>
    )
}
