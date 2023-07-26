import React from 'react'
import {Link} from 'react-router-dom'
import './UserEntry.css'

/***************************************************************************************
 * The path to the empty user image. It used if the user has not given their own image *
 ***************************************************************************************/
const emptyImageSource = "./Images/EmptyProfileImage.png"

/****************************
 * The User Entry Component *
 ****************************/
export default function UserEntry({user})
{
    return (
        <div className="user-entry">
            <img
                className="user-entry-image"
                src={emptyImageSource}
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
