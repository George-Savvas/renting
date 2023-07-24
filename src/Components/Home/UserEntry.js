import React from 'react'
import './UserEntry.css'
import {Link} from 'react-router-dom'

/****************************
 * The User Entry Component *
 ****************************/
export default function UserEntry({user})
{
    return (
        <div className="user-entry">
            <div className="user-entry-image">
                Photo Image here
            </div>
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
