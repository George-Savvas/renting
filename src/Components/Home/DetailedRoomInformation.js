import React from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import api from '../../Interface.js'
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'
import {Icon} from 'leaflet'
import ScorePanel from './ScorePanel.js'
import 'leaflet/dist/leaflet.css'
import './DetailedRoomInformation.css'

/************************************
 * The path to the empty room image *
 ************************************/
const emptyRoomImageSource = "./Images/EmptyHouseImage.jpg"

/************************************
 * The path to the empty user image *
 ************************************/
const emptyLandlordImageSource = "./Images/EmptyProfileImage.png"

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

/**************************************************************************
 * The DOM Open Street Map we will use to display the geological location *
 *      of the room. The center of the map is in the room's location      *
 **************************************************************************/
let map;

/**************************************************************
 * Returns all the information (except for the password) that *
 *     is assossiated with the user who has the given ID      *
 **************************************************************/
async function getUserById(id)
{
    let user;

    await fetch(`${api}/auth/getUser/${id}`)
        .then((res) => res.json())
        .then((data) => {user = data.user})

    return user
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

/**************************************************************************************
 * Creates and returns the DOM Open Street Map which depicts the location of the room *
 **************************************************************************************/
function createMap(x, y, label)
{
    return (
        <MapContainer
            center={[y, x]}
            zoom={13}
        >
            <TileLayer
                attribution={mapAttribution}
                url={mapUrl}
            />
            <Marker
                position={[y, x]}
                icon={mapIcon}
            >
                <Popup>
                    {label}
                </Popup>
            </Marker>
        </MapContainer>
    )
}

/*********************************************************************
 * Returns all the information related to the room with the given ID *
 *********************************************************************/
async function getRoomInfoAndLandlordInfo(roomId)
{
    let roomInfo, landlordInfo, roomImages;

    await fetch(`${api}/rooms/viewroom/${roomId}`)
    .then((res) => res.json())
    .then(async (data) => {
        roomInfo = data.room
        landlordInfo = await getUserById(roomInfo.userId)
        roomImages = await getRoomImages(roomInfo.id)
        map = createMap(
            roomInfo.openStreetMapX,
            roomInfo.openStreetMapY,
            roomInfo.openStreetMapLabel
        )
    })

    return [roomInfo, landlordInfo, roomImages]
}

/***************************************************************
 * Returns all the information (except for the password) that  *
 *   is assossiated with the user who has the given username   *
 *                                                             *
 * Also the function adds 1 visit to the total number of times *
 *     the user has visited the detailed page of this room     *
 ***************************************************************/
async function getUserByUsernameAndAddVisit(username, roomId)
{
    let user;

    await fetch(`${api}/auth/getUserByUsername/${username}`)
        .then((res) => res.json())
        .then((data) => {

            /* We store the data of the user in the variable we will return */
            user = data.user

            /* We add 1 visit to the total amount of visits of this page by this user */
            fetch(`${api}/recommendations/addVisit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: data.user.id,
                    roomId: roomId
                })
            })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.message)
            })
        })

    return user
}

/*******************************************
 * The Detailed Room Information Component *
 *******************************************/
export default function DetailedRoomInformation({appState, setAppState})
{
    /* We will use this to redirect the user to the home page
     * if they confirm the booking of this room's page
     */
    const navigate = useNavigate()

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

    /* A state that will be storing all the information related to the landlord
     * who owns the property which is displayed in this page.
     */
    const [landlord, setLandlord] = React.useState({})

    /* A state the will be storing the current score that the user may have selected for the room */
    const [reviewScore, setReviewScore] = React.useState(0)

    /* A state that will be controlling the textarea that the tenant may use to write a comment */
    const [commentContents, setCommentContents] = React.useState("")

    /* A state that will be storing the message the backend server sent after the review was sent */
    const [reviewPostingServerMessage, setReviewPostingServerMessage] = React.useState("")

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
        return emptyRoomImageSource
    }

    /* Returns the string that should be inserted in the 'src' prop
     * of the 'img' tag which depicts the profile image of the landlord
     */
    function decideSourceOfLandlordImage()
    {
        /* Case the landlord has a non-empty profile image */
        if(landlord.profile_img !== null)
            return `${api}/${landlord.profile_img}`

        /* Case the landlord does not have a profile image */
        return emptyLandlordImageSource
    }

    /* When the component first loads, we fetch all the information related
     * to the room this page is about and the tenant if one is logged in
     */
    React.useEffect(() => {

        /* We declare a flag variable to ensure that only 1 visit will be added */
        let aVisitHasBeenAdded = false

        /* This function fetches data about the room and the logged-in user if one exists */
        async function fetchData(idRoom) {

            /* We retrieve the data of the room (details, images, assossiated landlord) */
            const roomData = await getRoomInfoAndLandlordInfo(idRoom)

            /* We update the states with the data we received
             * 1st index: Data of the room itself (interior, other details, etc)
             * 2nd index: Data of the landlord who owns the room
             * 3rd index: Data of the images assossiated with the room
             */
            setRoom(roomData[0])
            setLandlord(roomData[1])
            setRoomImages(roomData[2])

            /* We retrieve the data of the user and add 1 visit if a user is logged-in */
            if((appState.userIsLogged) && (aVisitHasBeenAdded === false))
                setUser(await getUserByUsernameAndAddVisit(appState.username, roomId))
        }

        /* We scroll smoothly at the top of the page */
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'})

        /* We fetch the data of the room, including the landlord's data */
        fetchData(roomId)

        /* We set the flag variable to 'true' in order to add no more than 1 visits */
        return () => {aVisitHasBeenAdded = true}

    }, [appState.userIsLogged, appState.username, roomId])

    /* We place all the details about the interior of the room in an array */
    const interiorDetails = {title: "Interior Details", content: [
        {index: 0, type: "Number of Beds", value: room.numOfBeds},
        {index: 1, type: "Number of Bathrooms", value: room.numOfBathrooms},
        {index: 2, type: "Room type", value: room.roomType},
        {index: 3, type: "Number of Bedrooms", value: room.numOfBedrooms},
        {index: 4, type: "Living Room", value: room.livingRoomInfo},
        {index: 5, type: "Area (in square meters)", value: room.roomArea},
        {index: 6, type: `Starting cost per night (${room.numOfPeople} people)`, value: room.cost},
        {index: 7, type: `Additional cost per person (max ${room.maxNumOfPeople} people)`, value: room.additionalCostPerPerson},
        {index: 8, type: "Review score", value: room.review_scores_rating},
        {index: 9, type: "Number of reviews", value: room.number_of_reviews}
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

    /* A function that converts an ISO date such as: "YYYY-MM-DDThh:mm:ss.xxxZ"
     * into a date in the form "YYYY-MM-DD"
     */
    function refineISODateString(rawDate)
    {
        const rawDateTokens = rawDate.toISOString().split(/-|T/)
        return `${rawDateTokens[0]}-${rawDateTokens[1]}-${rawDateTokens[2]}`
    }

    /* A function that converts a date such as: "Fri Sep 15 2023 19:21:20 GMT+0300 (Θερινή ώρα Ανατολικής Ευρώπης)"
     * into a date in the form "YYYY-MM-DD"
     */
    function refineDateString(rawDate)
    {
        const rawDateTokens = rawDate.split(' ')
        const rawMonth = rawDateTokens[1]
        const day = rawDateTokens[2]
        const year = rawDateTokens[3]
        let refinedMonth;

        if(rawMonth === "Jan")
            refinedMonth = "01"
        else if(rawMonth === "Feb")
            refinedMonth = "02"
        else if(rawMonth === "Mar")
            refinedMonth = "03"
        else if(rawMonth === "Apr")
            refinedMonth = "04"
        else if(rawMonth === "May")
            refinedMonth = "05"
        else if(rawMonth === "Jun")
            refinedMonth = "06"
        else if(rawMonth === "Jul")
            refinedMonth = "07"
        else if(rawMonth === "Aug")
            refinedMonth = "08"
        else if(rawMonth === "Sep")
            refinedMonth = "09"
        else if(rawMonth === "Oct")
            refinedMonth = "10"
        else if(rawMonth === "Nov")
            refinedMonth = "11"
        else if(rawMonth === "Dec")
            refinedMonth = "12"

        return `${year}-${refinedMonth}-${day}`
    }

    /* Stores the user's booking in the database */
    async function handleBookingConfirmation(event)
    {
        /* There is nothing to do if the user a guest (in other words, not logged-in) */
        if(!userIsTenant())
            return

        /* We convert the check-in & check-out dates in the form 'YYYY-MM-DD' */
        const refinedCheckInDate = refineDateString(inDate)
        const refinedCheckOutDate = refineDateString(outDate)

        /* We store all the booking details in the following object */
        const bookingData = {
            InDate: refinedCheckInDate,
            OutDate: refinedCheckOutDate,
            roomId: roomId,
            userId: user.id
        }

        /* We send the booking details to the backend server */
        await fetch(`${api}/bookings/addBooking`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookingData)
        })
        .then((res) => res.json())
        .then((data) => {console.log(data.booking)})

        /* Finally, we redirect the user to the home page */
        navigate("/")
    }

    /* Stores the tenant's review for this room (rating + comment)
     * in the database
     */
    async function handleReviewSubmission(event)
    {
        const finalReviewData = {
            date: refineISODateString(new Date()),
            score: reviewScore,
            reviewer_name: `${user.name} ${user.lastname}`,
            comments: commentContents,
            userId: user.id,
            roomId: Number(roomId)
        }

        /* We send the review details to the backend server */
        await fetch(`${api}/rooms/addReview`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(finalReviewData)
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data.review)
            setReviewPostingServerMessage("Your review was submitted successfully")
        })
    }

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
            <div className="detailed-room-information-landlord-info">
                <div className="detailed-room-information-landlord-info-title">
                    <div className="detailed-room-information-landlord-info-title-name">
                        {landlord.name} {landlord.lastname}
                    </div>
                    <div className="detailed-room-information-landlord-info-title-context">
                        owns this property
                    </div>
                </div>
                <img
                    className="detailed-room-information-landlord-info-image"
                    src={decideSourceOfLandlordImage()}
                    alt={`${landlord.name} ${landlord.lastname}, owner of the room`}
                />
                <div className="detailed-room-information-landlord-info-title">
                    <div className="detailed-room-information-landlord-info-title-context">
                        {landlord.name}'s phone number:
                    </div>
                    <div className="detailed-room-information-landlord-info-title-name">
                        {landlord.telephone}
                    </div>
                </div>
            </div>
            {
                userIsTenant() && (
                    <div className="detailed-room-information-book-button-parent">
                        <div
                            className="detailed-room-information-book-button"
                            onClick={handleBookingConfirmation}
                        >
                            Book this room! ({refineDateString(inDate)} - {refineDateString(outDate)})
                        </div>
                    </div>
                )
            }
            {
                userIsTenant() && (
                    <div>
                        <div className="detailed-room-information-review-section">
                            <div className="detailed-room-information-review-section-score-title">
                                Your opinion matters<br/>Submit your rating for this room
                            </div>
                            <ScorePanel score={reviewScore} setScore={setReviewScore}/>
                            <label
                                htmlFor="detailedRoomInformationCommentSectionArea"
                                className="detailed-room-information-review-section-comment-title"
                            >
                                Write a comment to provide feedback to the landlord of this room
                            </label>
                            <textarea
                                className="detailed-room-information-review-section-comment-textarea"
                                id="detailedRoomInformationCommentSectionArea"
                                rows={10}
                                cols={50}
                                value={commentContents}
                                onChange={(e) => setCommentContents(e.target.value)}
                            />
                        </div>
                        <div className="detailed-room-information-review-section-submit-button-parent">
                            <div
                                className="detailed-room-information-review-section-submit-button"
                                onClick={handleReviewSubmission}
                            >
                                Submit my rating and comment for this room
                            </div>
                        </div>
                        <div className="detailed-room-information-review-section-response">
                            {reviewPostingServerMessage}
                        </div>
                    </div>
                )
            }
        </div>
    )
}
