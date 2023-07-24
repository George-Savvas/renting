import React from 'react'
import api from '../../Interface.js'
import AdminHome from './AdminHome.js'
import LandlordHome from './LandlordHome.js'
import TenantHome from './TenantHome.js'
import GuestHome from './GuestHome.js'
import './Home.css'

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

/**********************
 * The Home Component *
 **********************/
export default function Home({appState, setAppState})
{
    /* We create a state with the information assossiated
     * with the currently logged user (if one exists).
     *
     * The state is initialized with the empty object, but
     * if a registered user visits the home page, the state
     * will be modified by the following effect.
     */
    const [user, setUser] = React.useState({})

    /* If a user is logged in, we retrieve their data from
     * the backend server once when the component is first loaded.
     * If no user is logged in, the effect has no effect.
     */
    React.useEffect(() => {

        /* A function that alters the state with the user data (except
         * for the password), if a user is currently logged in the site.
         */
        async function fetchUserIfLoggedIn() {

            if(appState.userIsLogged === false)
                return

            setUser(await getUserByUsername(appState.username))
        }

        /* The effect alters the state of the user if one is logged in */
        fetchUserIfLoggedIn()

    }, [appState])

    /* The Home Component returns different DOM items depeding
     * on the status of the user (Admin, Landlord, Tenant, Guest).
     *
     * Case the user is registered in the site (not a guest)
     */
    if(appState.userIsLogged)
    {
        /* Case the logged user is an administrator */
        if(user.isAdmin)
            return <AdminHome admin={user}/>

        /* Case the logged user is both tenant and landlord */
        if(user.isLandlord && user.isTenant)
        {
            return (
                <div>
                    <TenantHome user={user}/>
                    <LandlordHome user={user}/>
                </div>
            )
        }

        /* Case the logged user is only landlord */
        if(user.isLandlord)
            return <LandlordHome user={user}/>

        /* Case the logged user is only tenant */
        if(user.isTenant)
            return <TenantHome user={user}/>
    }

    /* Case the user is a guest (not registered) */
    return <GuestHome/>
}
