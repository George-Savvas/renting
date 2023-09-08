import React from 'react'
import {useParams} from 'react-router-dom'
import api from '../../Interface.js'
import './DetailedRoomInformation.css'

/************************************
 * The path to the empty room image *
 ************************************/
const emptyImageSource = "./Images/EmptyHouseImage.jpg"

/*********************************************************************
 * Returns all the information related to the room with the given ID *
 *********************************************************************/
async function getRoomInfo(roomId)
{
    let roomInfo;

    await fetch(`${api}/rooms/viewroom/${roomId}`)
    .then((res) => res.json())
    .then((data) => {roomInfo = data.room})

    return roomInfo
}

/**************************************************************
 * Returns all the information (except for the password) that *
 *  is assossiated with the user who has the given username   *
 **************************************************************/
async function getUserByUsername(username)
{
    let user;

    await fetch(`${api}/auth/getUserByUsername/${username}`)
        .then((res) => res.json())
        .then((data) => {user = data.user})

    return user
}

/*******************************************
 * The Detailed Room Information Component *
 *******************************************/
export default function DetailedRoomInformation({appState, setAppState})
{
    /* We retrieve the room ID, the check-in and the check-out dates from the URL parameters */
    const {roomId, inDate, outDate} = useParams()

    /* A state that will be storing all the information related to the room of this page */
    const [room, setRoom] = React.useState({})

    /* A state that will be storing all the information related to the tenant who visited the
     * page. If the user is not a tenant but a guest, the state value will remain the empty object.
     */
    const [user, setUser] = React.useState({})

    /* Returns 'true' if the user who just visited the page is a tenant.
     * Else if the user is a guest, the function returns 'false'.
     */
    function userIsTenant()
    {
        return (JSON.stringify(user) !== JSON.stringify({}))
    }

    /* Returns the string that should be inserted in the 'src' prop
     * of the 'img' tag which depicts the thumbnail image of the room
     */
    function decideSourceOfThumbnailImage()
    {
        /* Case the room has a non-empty thumbnail image */
        if(room.thumbnail_img !== null)
            return `${api}/${room.thumbnail_img}`

        /* Case the room does not have a thumbnail image */
        return emptyImageSource
    }

    /* When the component first loads, we fetch all the information related
     * to the room this page is about and the tenant if one is logged in
     */
    React.useEffect(() => {

        /* A function that fetches all the information related to the room
         * with the given id and stores that information in the 'room' state
         */
        async function fetchRoomById(id) {
            setRoom(await getRoomInfo(id))
        }

        /* A function that fetches all the information related to the user
         * with the given username and stores that information in the 'user' state
         */
        async function fetchUserByUsername(username) {
            setUser(await getUserByUsername(username))
        }

        /* We fetch the information related to the room of this page */
        fetchRoomById(roomId)

        /* We fetch the information related to the user if one is logged-in */
        if(appState.userIsLogged === true)
            fetchUserByUsername(appState.username)

    }, [appState.userIsLogged, appState.username, roomId])

    const details = (
        <div>
            <div>
                <div>
                    Check-in date: {inDate}
                </div>
                <div>
                    Check-out date: {outDate}
                </div>
            </div>
            <div>
                User: {(userIsTenant()) ? `${user.id}` : "No user is logged-in"}
            </div>
            <div>
                Room: {room.id}
            </div>
        </div>
    )

    return (
        <div className="detailed-room-information">
            <img
                className="detailed-room-information-thumbnail-image"
                src={decideSourceOfThumbnailImage()}
                alt={"Thumbnail of the room of this page"}
            />
            <div>
                {details}
            </div>
        </div>
    )
}
