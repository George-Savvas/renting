import {Link} from "react-router-dom"
export default function Logout({appState, setAppState})
{
    return (
        <div>
            <center>
                You have been logged out
            </center>
            <center>
                <Link to="/">Go back to home</Link>
            </center>
        </div>
    )
}
