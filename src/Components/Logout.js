import { useNavigate } from "react-router-dom"
export default function Logout({appState, setAppState})
{
    const navigate = useNavigate()

    setAppState(prevState => {
        return {...prevState, userIsLogged: false}
    })

    navigate("/")

    return (
        <p>Logout Page</p>
    )
}
