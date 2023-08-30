import React from 'react'
import api from '../../Interface.js'
import PageNotFound from '../PageNotFound.js'
import './NewRoomForm.css'

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

/*******************************
 * The New Room Form Component *
 *******************************/
export default function NewRoomForm({appState, setAppState})
{
    /* We retrieve the username of the currently logged user */
    const username = appState.username

    /* We create a state that will contain all the information
     * related to the currently logged user (except for the password)
     */
    const [user, setUser] = React.useState({})

    /* This state determines if the user who just requested this page
     * is a verified landlord or not. If the user is not a verified
     * landlord, they have not the rights to use the content of this page.
     * Only verified landlords have the right to create new rooms.
     */
    const [isActiveLandlord, setIsActiveLandlord] = React.useState(true)

    /* We fetch the information that is related to the given
     * username from the backend server
     */
    React.useEffect(() => {

        /* This function fetches the user's information */
        async function fetchUser(usr) {

            /* Case no user is logged-in */
            if(usr === "")
            {
                setIsActiveLandlord(false)
                return
            }

            /* We fetch the data and store it to the user state */
            setUser(await getUserByUsername(usr))

            /* We examine if the user is indeed a verified landlord.
             * Only a verified landlord has the right to create new rooms
             * and showcase them in the site. If the user who requested
             * this page is not a verified landlord, the "Page Not Found"
             * component will be rendered to them instead.
             */
            if(user.active === false)
                setIsActiveLandlord(false)
        }

        /* If the user has already been fetched, we do not repeat the process.
         * This is useful if this effect will be executed multiple times. We
         * only need to fetch the user once - the first time this effect runs.
         */
        if(JSON.stringify(user) !== JSON.stringify({}))
            return

        /* We call the above function to fetch the user data */
        fetchUser(username)

    }, [username, user])

    /* If the user is not a verified landlord, we return "Page Not Found" */
    if(isActiveLandlord === false)
        return <PageNotFound/>

    return (
        <div className="new-room-form">
            New Room
        </div>
    )
}
