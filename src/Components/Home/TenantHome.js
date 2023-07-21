import React from 'react'
import './TenantHome.css'

export default function TenantHome({user})
{
    return (
        <div className="tenant-home">
            <div>
                User Is Logged in (Tenant)
            </div>
            <div>
                {user.username} {user.email} {user.name} {user.lastname}
            </div>
        </div>
    )
}
