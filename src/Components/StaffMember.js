import React from 'react'
import './StaffMember.css'

/***************************************************************
 * Returns the color that is connected to the given occupation *
 ***************************************************************/

function getOccupationColor(occupation)
{
    if(occupation === "Site Developer")
        return "green"

    if(occupation === "Site Administrator")
        return "red"

    return "black"
}

/******************************
 * The Staff Member Component *
 ******************************/

export default function StaffMember({id, name, email, image, alt, occupation})
{
    const domProfileImage = (
        <img
            className="staff-member-image"
            src={image}
            alt={alt}
        />
    )

    const domProfileDetails = (
        <div className="staff-member-details">
            <div className="staff-member-details-name">
                {name}
            </div>
            <div className="staff-member-details-email">
                <div>Email:</div>
                <div>{email}</div>
            </div>
            <div className="staff-member-details-occupation">
                <div>Occupation:</div>
                <div style={{color: getOccupationColor(occupation)}}>{occupation}</div>
            </div>
        </div>
    )

    const domProfile = (
        (id % 2 === 0) ?
        <div className="staff-member">
            {domProfileImage}
            {domProfileDetails}
        </div> :
        <div className="staff-member">
            {domProfileDetails}
            {domProfileImage}
        </div>
    )

    return domProfile
}
