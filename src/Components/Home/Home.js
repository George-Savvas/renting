import React from 'react'
import port from '../../Port.js'
import AdminHome from './AdminHome.js'
import LandlordHome from './LandlordHome.js'
import TenantHome from './TenantHome.js'
import GuestHome from './GuestHome.js'
import './Home.css'

async function getUserByUsername(username)
{
    let user;

    await fetch(`http://localhost:${port}/auth/getUserByUsername/${username}`)
        .then((res) => res.json())
        .then((data) => {user = data.user})

    return user
}

/**********************
 * The Home Component *
 **********************/
export default function Home({appState, setAppState})
{
    const [user, setUser] = React.useState({})

    React.useEffect(() => {

        async function fetchUserIfLoggedIn() {

            if(appState.userIsLogged === false)
                return

            setUser(await getUserByUsername(appState.username))
        }

        fetchUserIfLoggedIn()

    }, [appState])

    if(appState.userIsLogged)
    {
        if(user.isAdmin)
            return <AdminHome admin={user}/>

        if(user.isLandlord && user.isTenant)
        {
            return (
                <div>
                    <TenantHome user={user}/>
                    <LandlordHome user={user}/>
                </div>
            )
        }

        if(user.isLandlord)
            return <LandlordHome user={user}/>

        if(user.isTenant)
            return <TenantHome user={user}/>
    }

    return <GuestHome/>
}
