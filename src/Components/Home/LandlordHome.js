import React from 'react'
import './LandlordHome.css'

export default function LandlordHome({user})
{
    return (
        <div className="landlord-home">
            <div>
                User Is Logged in (Landlord)
            </div>
            <div>
                {user.username} {user.email} {user.name} {user.lastname}
            </div>
        </div>
    )
}
