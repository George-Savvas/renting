import React from 'react'
import {useParams} from 'react-router-dom'
import api from '../../Interface.js'
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'
import {Icon} from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './DetailedRoomInformation.css'

/************************************
 * The path to the empty room image *
 ************************************/
const emptyImageSource = "./Images/EmptyHouseImage.jpg"

/********************************************************************
 * The OpenStreetMap Attribution (the credits to those who made the *
 *  map and also to the author of the custom icons of the markers)  *
 ********************************************************************/
const mapAttribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors | <a href="https://www.flaticon.com/free-icons/pin" title="pin icons">Pin icons created by Freepik - Flaticon</a>';

/*************************************************************
 * The OpenStreetMap url (the map we will use for this site) *
 *************************************************************/
const mapUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

/**************************************************************************
 * The custom icon we will use for the OpenStreetMap (created by Freepik) *
 **************************************************************************/
const mapIcon = new Icon({
    iconUrl: "./Images/OpenStreetMapIcon.png",
    iconSize: [38,38]
})

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

/***********************************************************************************************
 * Returns all the images except for the thumbnail image related to the room with the given ID *
 ***********************************************************************************************/
async function getRoomImages(roomId)
{
    let roomImages;

    await fetch(`${api}/rooms/getImages/${roomId}`)
    .then((res) => res.json())
    .then((data) => {roomImages = data.images})

    return roomImages
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

    /* A state that will be storing all the images related to the room (except the thumbnail image) */
    const [roomImages, setRoomImages] = React.useState([])

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

        /* A function that fetches all the images related to the room by
         * using the id of the room (excluding the thumbnail image)
         */
        async function fetchRoomImagesByRoomId(id) {
            setRoomImages(await getRoomImages(id))
        }

        /* A function that fetches all the information related to the user
         * with the given username and stores that information in the 'user' state
         */
        async function fetchUserByUsername(username) {
            setUser(await getUserByUsername(username))
        }

        /* We fetch the information related to the room of this page */
        fetchRoomById(roomId)

        /* We fetch the images related to the room of this page */
        fetchRoomImagesByRoomId(roomId)

        /* We fetch the information related to the user if one is logged-in */
        if(appState.userIsLogged === true)
            fetchUserByUsername(appState.username)

    }, [appState.userIsLogged, appState.username, roomId])

    /* We place all the details about the interior of the room in an array */
    const interiorDetails = {title: "Interior Details", content: [
        {index: 0, type: "Number of Beds", value: room.numOfBeds},
        {index: 1, type: "Number of Bathrooms", value: room.numOfBathrooms},
        {index: 2, type: "Room type", value: room.roomType},
        {index: 3, type: "Number of Bedrooms", value: room.numOfBedrooms},
        {index: 4, type: "Living Room", value: room.livingRoomInfo},
        {index: 5, type: "Area (in square meters)", value: room.roomArea}
    ]}

    /* We create a DOM element for each interior detail of the above array */
    const domInteriorDetails = interiorDetails.content.map(detail => {
        return (
            <div key={detail.index} className="detailed-room-information-single-detail">
                <div className="detailed-room-information-single-detail-type">
                    {detail.type}
                </div>
                <div className="detailed-room-information-single-detail-value">
                    {detail.value}
                </div>
            </div>
        )
    })

    /* The DOM Open Street Map we will use to display the geological location of the room
     * The center of the map is in the room's location
     */
    const map = (
        <MapContainer
            center={[10,10] /* room.openStreetMapY, room.openStreetMapX */}
            zoom={13}
        >
            <TileLayer
                attribution={mapAttribution}
                url={mapUrl}
            />
            <Marker
                position={[10,10] /* room.openStreetMapY, room.openStreetMapX */}
                icon={mapIcon}
            >
                <Popup>
                    {room.openStreetMapLabel}
                </Popup>
            </Marker>
        </MapContainer>
    )

    /* We convert the additional images that are provided for this room to DOM elements */
    const domRoomImages = roomImages.map(roomImage => {
        return (
            <div key={roomImage.id}>
                <img
                    className="detailed-room-information-additional-images-entry"
                    src={`${api}/${roomImage.path}`}
                    alt={"A detailed aspect of the room"}
                />
            </div>
        )
    })

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
            <div className="detailed-room-information-details">
                <div className="detailed-room-information-details-entry">
                    <div className="detailed-room-information-detail-title">
                        {interiorDetails.title}
                    </div>
                    <div className="detailed-room-information-detail-content">
                        {domInteriorDetails}
                    </div>
                </div>
                <div className="detailed-room-information-details-entry">
                    <div className="detailed-room-information-detail-title">
                        Room Description
                    </div>
                    <div className="detailed-room-information-detail-text">
                        {room.description}
                    </div>
                </div>
                <div className="detailed-room-information-details-entry">
                    <div className="detailed-room-information-detail-title">
                        Rules relating this room
                    </div>
                    <div className="detailed-room-information-detail-text">
                        {room.rules}
                    </div>
                </div>
            </div>
            <div className="detailed-room-information-map">
                {map}
            </div>
            <div className="detailed-room-information-additional-images">
                {domRoomImages}
            </div>
            <div>
                {details}
            </div>
        </div>
    )
}
