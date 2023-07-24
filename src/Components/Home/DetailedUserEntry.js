import React from 'react'
import {Link, useParams} from 'react-router-dom'
import api from '../../Interface'
import './DetailedUserEntry.css'

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

/*************************************************************************************************
 *  Given a user, this function finds out whether that user is a landlord, a tenant or both and  *
 * if they are a landlord, the function also retrieves if the user is a verified landlord or not *
 *************************************************************************************************/
function decideStatus(user)
{
    /* Special Case: The user is Administrator */
    if(user.isAdmin)
        return "Administrator"

    /* Case the user is both a Tenant and a Landlord */
    if(user.isLandlord && user.isTenant)
    {
        /* Case the landlord is verified */
        if(user.active)
            return "Tenant & Verified Landlord"

        /* Case the landlord is not verified */
        return "Tenant & Landlord"
    }

    /* Case the user is just Landlord */
    if(user.isLandlord)
    {
        /* Case the landlord is verified */
        if(user.active)
            return "Verified Landlord"

        /* Case the landlord is not verified */
        return "Landlord"
    }

    /* Case the user is just Tenant */
    return "Tenant"
}

/****************************************************************************************************
 * Given a user, this function decides what text should be displayed on the verify/unverify button. *
 * If the user is not a landlord, the verification process has no meaning and a DOM '-' is returned *
 ****************************************************************************************************/
function decideTextOfVerificationButton(user, toggleVerification)
{
    /* Case the user is landlord */
    if(user.isLandlord)
    {
        /* Case the landlord is verified (so pressing the button will unverify them) */
        if(user.active)
        {
            return (
                <div className="detailed-user-entry-button" onClick={toggleVerification}>
                    <div style={{color: "red"}}>Unverify</div>
                </div>
            )
        }

        /* Case the landlord is not verified (so pressing the button will verify them) */
        return (
            <div className="detailed-user-entry-button" onClick={toggleVerification}>
                <div style={{color: "green"}}>Verify</div>
            </div>
        )
    }

    /* Case the user is not a landlord (they are Tenant or an Admin).
     * There's no button in this case. A '-' is displayed instead.
     */
    return <div>-</div>
}

/*************************************
 * The Detailed User Entry Component *
 *************************************/
export default function DetailedUserEntry()
{
    /* We retrieve the username that is given as a url parameter */
    const {username} = useParams()

    /* We create a state which stores all the information related to
     * the given username (except for the password)
     */
    const [user, setUser] = React.useState({})

    /* We retrieve all the information assossiated with the given
     * username from the backend server (except for the password).
     */
    React.useEffect(() => {

        /* A function that alters the state with the user data */
        async function fetchUser() {
            setUser(await getUserByUsername(username))
        }

        /* The effect alters the state of the user by setting the
         * user-related information to the state variable.
         */
        fetchUser()

    }, [username])

    /* If the given user is not verified, this function verifies them.
     * If the given user is verified, this function renders them non-verified.
     */
    async function toggleUserVerification(user)
    {
        /* We toggle the verification status of the user (if the user is verified,
         * they become unverified and if they are unverified they become verified).
         */
        await fetch(`${api}/auth/activate/${user.id}`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({active: !user.active})
        })

        /* We need to update the state of the user in order to reflect the changes
         * on the page (the "verify" button will become "unverify" and vice versa).
         *
         * Because we need the value of the current state to create the value of the
         * next state, we will use a callback function to update the state.
         */
        setUser(currentUser => {
            return {...currentUser, active: !currentUser.active}
        })
    }

    /* An array with all the details of the user */
    const userDetails = [
        {fieldKey: 0, fieldTitle: "Username", fieldValue: user.username},
        {fieldKey: 1, fieldTitle: "Email", fieldValue: user.email},
        {fieldKey: 2, fieldTitle: "First Name", fieldValue: user.name},
        {fieldKey: 3, fieldTitle: "Last Name", fieldValue: user.lastname},
        {fieldKey: 4, fieldTitle: "Telephone", fieldValue: user.telephone},
        {fieldKey: 5, fieldTitle: "User since", fieldValue: user.createdAt},
        {fieldKey: 6, fieldTitle: "Change status", fieldValue: decideTextOfVerificationButton(user, () => toggleUserVerification(user))},
        {fieldKey: 7, fieldTitle: "Status", fieldValue: decideStatus(user)}
    ]

    /* We create a DOM version of the above array */
    const domUserDetails = userDetails.map(field => {
        return (
            <div key={field.fieldKey} className="detailed-user-entry-field">
                <div className="detailed-user-entry-field-title">{field.fieldTitle}:</div>
                <div className="detailed-user-entry-field-value">{field.fieldValue}</div>
            </div>
        )
    })

    return (
        <div className="detailed-user-entry">
            <div className="detailed-user-entry-title">
                <div className="detailed-user-entry-title-1">Profile of</div>
                <div className="detailed-user-entry-title-2">{username}</div>
            </div>
            <div className="detailed-user-entry-profile">
                <div className="detailed-user-entry-image">
                    Photo Image here
                </div>
                <div className="detailed-user-entry-details">
                    {domUserDetails}
                </div>
            </div>
            <Link to="/" className="detailed-user-entry-link">Back to the list of users</Link>
        </div>
    )
}
