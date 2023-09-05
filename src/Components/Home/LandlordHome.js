import React from 'react'
import {useNavigate} from 'react-router-dom'
import api from '../../Interface.js'
import './LandlordHome.css'

/************************************
 * The path to the empty room image *
 ************************************/
const emptyImageSource = "./Images/EmptyHouseImage.jpg"

/***********************************************
 * Returns all the rooms of the given landlord *
 ***********************************************/
async function getLandlordRooms(user)
{
    let rooms;

    await fetch(`${api}/rooms/getUserRooms/${user.id}`)
    .then((res) => res.json())
    .then((data) => {rooms = data.rooms})

    return rooms
}

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

    /* This state will be storing all the rooms of the given landlord */
    const [landlordRooms, setLandlordRooms] = React.useState([])

    /* With this effect we will fetch all the rooms of the given landlord */
    React.useEffect(() => {

        /* This function fetches the information of all the landlord's rooms */
        async function fetchLandlordRooms(user) {

            /* Else we fetch the data and store it to the user state */
            setLandlordRooms(await getLandlordRooms(user))
        }

        /* We call the above function to fetch all the existing rooms */
        fetchLandlordRooms(user)

    }, [user])

    /* Determines the source where the image of the given room will be retrieved from */
    function decideThumbnailImageSource(room)
    {
        /* Case the room has a non-empty thumbnail image */
        if(room.thumbnail_img !== null)
            return `${api}/${room.thumbnail_img}`

        /* Case the room does not have a thumbnail image */
        return emptyImageSource
    }

    /* We create a DOM element for each room the landlord has created */
    const domLandlordRooms = landlordRooms.map(room => {
        return (
            <div key={room.id} className="landlord-home-results-entry">
                <img className="landlord-home-results-entry-image"
                    src={decideThumbnailImageSource(room)}
                    alt={`Thumbnail of the room`}
                />
                <div className="landlord-home-results-entry-details">
                    <div className="landlord-home-results-entry-detail">Cost per night: {room.cost} euros</div>
                    <div className="landlord-home-results-entry-detail">Room type: {room.roomType}</div>
                    <div className="landlord-home-results-entry-detail">Number of beds: {room.numOfBeds}</div>
                    <div className="landlord-home-results-entry-detail-click">Click to update</div>
                </div>
            </div>
        )
    })

    /* This function redirects the landlord to the page
     * where they can create a new room.
     */
    function redirectToNewRoomPage() { navigate("/newroom") }

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
            <div className="landlord-home-title-of-rooms-list">
                My published rooms
            </div>
            <div className="landlord-home-results-panel">
                {domLandlordRooms}
            </div>
        </div>
    )
}
