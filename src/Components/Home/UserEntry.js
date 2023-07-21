import React from 'react'
import './UserEntry.css'

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
                <div className="button" onClick={toggleVerification}>
                    <div style={{color: "red"}}>Unverify</div>
                </div>
            )
        }

        /* Case the landlord is not verified (so pressing the button will verify them) */
        return (
            <div className="button" onClick={toggleVerification}>
                <div style={{color: "green"}}>Verify</div>
            </div>
        )
    }

    /* Case the user is not a landlord (they are Tenant or an Admin).
     * There's no button in this case. A '-' is displayed instead.
     */
    return <div className="dash">-</div>
}

/****************************
 * The User Entry Component *
 ****************************/
export default function UserEntry({user, toggleVerification})
{
    return (
        <div className="user-entry">
            <div className="user-entry-username">
                {user.username}
            </div>
            <div className="user-entry-email">
                {user.email}
            </div>
            <div className="user-entry-name">
                {user.name}
            </div>
            <div className="user-entry-lastname">
                {user.lastname}
            </div>
            <div className="user-entry-telephone">
                {user.telephone}
            </div>
            <div className="user-entry-status">
                {decideStatus(user)}
            </div>
            <div className="user-entry-verification-toggle">
                {decideTextOfVerificationButton(user, toggleVerification)}
            </div>
        </div>
    )
}
