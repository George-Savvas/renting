import React from 'react'
import port from '../../Port.js'
import UserEntry from './UserEntry.js'
import './AdminHome.css'

/**************************************************************
 * Returns an array with all the registered users of the site *
 **************************************************************/
async function getAllUsers()
{
    let users;

    await fetch(`http://localhost:${port}/auth/getAllUsers`)
        .then((res) => res.json())
        .then((data) => {users = data.users})

    return users;
}

/****************************
 * The Admin Home Component *
 ****************************/
export default function AdminHome({admin})
{
    /* We create a state with the array of all the registered users */
    const [users, setUsers] = React.useState([])

    /* Fetches all the users that are registered in the site from the backend server */
    async function fetchUsers() {
        setUsers(await getAllUsers())
    }

    /* With the following effect we fetch all the registered users from the backend
     * server with the help of 'fetchUsers'.
     */
    React.useEffect(() => {
        fetchUsers()
    }, [])

    /* If the user with the given id is not verified, this function verifies them.
     * If the user is verified, this function renders them non-verified.
     */
    async function toggleUserVerification(id)
    {
        /* We will store the user we will retrieve by the given id in this variable */
        let retrievedUser;

        /* We retrieve the corresponding user from the given id */
        await fetch(`http://localhost:${port}/auth/getUser/${id}`)
            .then((res) => res.json())
            .then((data) => {retrievedUser = data.user})

        /* We toggle the verification status of the user (if the user is verified,
         * they become unverified and if they are unverified they become verified).
         */
        await fetch(`http://localhost:${port}/auth/activate/${id}`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({active: !retrievedUser.active})
        })

        /* We need to update the state of the users in order to reflect the change */
        setUsers(currentUsers => {
            return currentUsers.map(user => {
                return (user.id !== id) ? user : {...user, active: !user.active}
            })
        })
    }

    /* We create the DOM table of the users. The home page of the
     * admin will render the whole array of all the registered users.
     */
    const domUsers = users.map(user => {
        return (
            <UserEntry
                key={user.username}
                user={user}
                toggleVerification={() => toggleUserVerification(user.id)}
            />
        )
    })

    /* We return the final dom elements of the admin's home page */
    return (
        <div className="admin-home">
            <div className="admin-home-title">
                Table of registered users of the site
            </div>
            <div className="admin-home-column-titles">
                <div className="admin-home-column-title">Username</div>
                <div className="admin-home-column-title">Email</div>
                <div className="admin-home-column-title">First Name</div>
                <div className="admin-home-column-title">Last Name</div>
                <div className="admin-home-column-title">Telephone</div>
                <div className="admin-home-column-title">Status</div>
                <div className="admin-home-column-title">Verify/Unverify</div>
            </div>
            <div className="admin-home-users">
                {domUsers}
            </div>
        </div>
    )
}
