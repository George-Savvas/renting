import React from 'react'
import api from '../Interface.js'
import './Account.css'

/***************************************************************************************
 * The path to the empty user image. It used if the user has not given their own image *
 ***************************************************************************************/
const emptyImageSource = "./Images/EmptyProfileImage.png"

/**************************************************************
 * Returns all the information (except for the password) that *
 *  is assossiated with the user who has the given username   *
 **************************************************************/
async function getUserByUsername(username)
{
    let user;

    await fetch(`${api}/auth/getUserByUsername/${username}`)
        .then((res) => res.json())
        .then((data) => {user = data.user})

    return user
}

/*************************
 * The Account Component *
 *************************/
export default function Account({appState, setAppState})
{
    /* We retrieve the username of the currently logged user */
    const username = appState.username

    /* We create a state that will contain all the information
     * related to the currently logged user (except for the password)
     */
    const [user, setUser] = React.useState({})

    /* We fetch the information that is related to the given
     * username from the backend from the backend server
     */
    React.useEffect(() => {

        /* This function fetches the user's information */
        async function fetchUser(usr) {

            /* First we fetch the data and store it to the
             * component's state.
             */
            setUser(await getUserByUsername(usr))
        }

        /* We call the above function to fetch the user data */
        fetchUser(username)

    }, [username])

    return (
        <div>
            <p>Account</p>
            <img className="account-profile-image"
                src={emptyImageSource}
                alt={`Profile avatar of ${user.username}`}
            />
            <div>{user.username}</div>
            <div>{user.email}</div>
            <div>{user.name}</div>
            <div>{user.lastname}</div>
            <div>{user.telephone}</div>
        </div>
    )
}
