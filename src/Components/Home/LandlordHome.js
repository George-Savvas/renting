import React from 'react'
import {useNavigate} from 'react-router-dom'
//import api from '../../Interface.js'
import './LandlordHome.css'

/*******************************
 * The Landlord Home Component *
 *******************************/
export default function LandlordHome({user})
{
    /* A hook we will use to redirect the landlord to
     * the detailed page of a room they have created,
     * so they can change its details, or to redirect
     * them to the page of the creation of a new room.
     */
    const navigate = useNavigate()

    /* Case the landlord has not been verified yet */
    if(user.active === false)
    {
        return (
            <div className="landlord-home-inactive-landlord">
                <p>Your account must be verified by the administration before you can upload your rooms</p>
                <p>This usually takes 3-5 days</p>
                <p>Thank you for your patience</p>
            </div>
        )
    }

    /* This function redirects the landlord to the page
     * where they can create a new room.
     */
    function redirectToNewRoomPage() { navigate("/newroom") }

    /* The content we return if the landlord has been verified */
    return (
        <div className="landlord-home">
            <div className="landlord-home-add-room-button-parent">
                <div
                    className="landlord-home-add-room-button"
                    onClick={redirectToNewRoomPage}
                >
                    + Add a new room
                </div>
            </div>
        </div>
    )
}
