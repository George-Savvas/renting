import React from 'react'
import StaffMember from './StaffMember.js'
import staffMembers from './StaffMembersInfo.js'
import './Staff.css'

export default function Staff()
{
    const domStaffMembers = staffMembers.map(staffMember => {
        return (
            <StaffMember
                key={staffMember.id}
                id={staffMember.id}
                name={staffMember.name}
                email={staffMember.email}
                image={staffMember.image}
                alt={staffMember.alt}
                occupation={staffMember.occupation}
            />
        )
    })

    return (
        <div className="staff">
            <div className="staff-title">
                Staff members of Housing Easy
            </div>
            <div className="staff-members">
                {domStaffMembers}
            </div>
        </div>
    )
}
