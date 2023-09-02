import React from 'react'
import {Link} from 'react-router-dom'
import api from '../../Interface.js'
import './UserEntry.css'

/******************************************************************************************
 * The path to the empty user image. It is used if the user has not given their own image *
 ******************************************************************************************/
const emptyImageSource = "./Images/EmptyProfileImage.png"

/****************************
 * The User Entry Component *
 ****************************/
export default function UserEntry({user})
{
    /* This function returns the value that will be used for
     * the 'src' attribute of the profile image tag.
     */
    function decideProfileImageSource()
    {
        /* Case the user has inserted a profile image in the past */
        if(user.profile_img !== null)
            return `${api}/${user.profile_img}`

        /* Case the user has never inserted a profile image
         *
         * In this case we return an arbitrary image that depicts
         * the user has not inserted any image.
         */
        return emptyImageSource
    }

    return (
        <div className="user-entry">
            <img
                className="user-entry-image"
                src={decideProfileImageSource()}
                alt={`${user.username}'s profile avatar`}
            />
            <div className="user-entry-details">
                <div className="user-entry-field">
                    <div className="user-entry-field-title">Username:</div>
                    <div className="user-entry-field-value">{user.username}</div>
                </div>
                <div className="user-entry-field">
                    <div className="user-entry-field-title">First Name:</div>
                    <div className="user-entry-field-value">{user.name}</div>
                </div>
                <div className="user-entry-field">
                    <div className="user-entry-field-title">Last Name:</div>
                    <div className="user-entry-field-value">{user.lastname}</div>
                </div>
            </div>
            <Link to={`/users/${user.username}`} className="user-entry-link">
                Open detailed info
            </Link>
        </div>
    )
}
