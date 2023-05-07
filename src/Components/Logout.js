import {Link} from "react-router-dom"
import './Logout.css'

export default function Logout({appState, setAppState})
{
    return (
        <div className="logout">
            <center>
                You have been logged out
            </center>
            <center>
                <Link to="/">Go back to home</Link>
            </center>
        </div>
    )
}
