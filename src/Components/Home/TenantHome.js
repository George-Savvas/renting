import React from 'react'
import api from '../../Interface.js'
import DatePicker from 'react-date-picker'
import {CountrySelect, StateSelect, CitySelect} from "react-country-state-city"
import "react-country-state-city/dist/react-country-state-city.css"
import 'react-date-picker/dist/DatePicker.css'
import 'react-calendar/dist/Calendar.css'
import './TenantHome.css'

/************************************
 * The path to the empty room image *
 ************************************/
const emptyImageSource = "./Images/EmptyHouseImage.jpg"

/**************************************************
 * Returns all the existing rooms in the database *
 **************************************************/
async function getAllRooms()
{
    let rooms;

    await fetch(`${api}/rooms/getAllRooms`)
    .then((res) => res.json())
    .then((data) => {rooms = data.rooms})

    return rooms
}

/*****************************
 * The Tenant Home Component *
 *****************************/
export default function TenantHome({user})
{
    /* States that store the currently selected check-in & check-out dates */
    const [checkInDate, setCheckInDate] = React.useState(new Date())
    const [checkOutDate, setCheckOutDate] = React.useState(new Date())

    /* States that store the country, state and city that are currently chosen */
    const [countryId, setCountryId] = React.useState(0)
    const [stateId, setStateId] = React.useState(0)
    const [cityId, setCityId] = React.useState(0)

    /* States that store filters about the number of people, room type and other services */
    const [numOfPeople, setNumOfPeople] = React.useState(0)
    const [roomType, setRoomType] = React.useState("House")
    const [maxCost, setMaxCost] = React.useState(100)
    const [heating, setHeating] = React.useState(false)

    /* A state with all the rooms that are displayed in the home page */
    const [resultRooms, setResultRooms] = React.useState([])

    /* When the component loads for the first time, no filters have been
     * selected yet and therefore we fetch all the rooms of the database.
     */
    React.useEffect(() => {

        /* This function fetches the information of all the rooms */
        async function fetchRooms() {

            /* Else we fetch the data and store it to the user state */
            setResultRooms(await getAllRooms())
        }

        /* We call the above function to fetch all the existing rooms */
        fetchRooms()

    }, [])

    /* A form that allows selection of country, state and city
     *
     * Source: https://socket.dev/npm/package/react-country-state-city
     */
    const locationSelectionForm = (
        <div className="tenant-home-location-form-items">
            <div>
                <div className="tenant-home-location-form-item-title">Country</div>
                <CountrySelect
                    onChange={(e) => {
                        setCountryId(e.id)
                    }}
                    placeHolder="Select Country"
                />
            </div>
            <div>
                <div className="tenant-home-location-form-item-title">State</div>
                <StateSelect
                    countryid={countryId}
                    onChange={(e) => {
                        setStateId(e.id)
                    }}
                    placeHolder="Select State"
                />
            </div>
            <div>
                <div className="tenant-home-location-form-item-title">City</div>
                <CitySelect
                    countryid={countryId}
                    stateid={stateId}
                    onChange={(e) => {
                        setCityId(e.id)
                    }}
                    placeHolder="Select City"
                />
            </div>
        </div>
    )

    /* A form that contains filters about properties and services of the room */
    const roomDetailsForm = (
        <div className="tenant-home-room-details-filtering">
            <div className="tenant-home-room-details-filtering-entry">
                <label
                    className="tenant-home-room-details-filtering-label"
                    htmlFor="roomDetailsFilteringNumOfPeople"
                >
                    Number of people
                </label>
                <select
                    className="tenant-home-room-details-filtering-select"
                    id="roomDetailsFilteringNumOfPeople"
                    name="roomDetailsFilteringNumOfPeople"
                    onChange={(e) => {setNumOfPeople(e.target.value)}}
                >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                    <option value={6}>6</option>
                    <option value={7}>7</option>
                    <option value={8}>8</option>
                </select>
            </div>
            <div className="tenant-home-room-details-filtering-entry">
                <label
                    className="tenant-home-room-details-filtering-label"
                    htmlFor="roomDetailsFilteringRoomType"
                >
                    Room type
                </label>
                <select
                    className="tenant-home-room-details-filtering-select"
                    id="roomDetailsFilteringRoomType"
                    name="roomDetailsFilteringRoomType"
                    onChange={(e) => {setRoomType(e.target.value)}}
                >
                    <option value={"Private Room"}>Private Room</option>
                    <option value={"Shared Room"}>Shared Room</option>
                    <option value={"House"}>House</option>
                </select>
            </div>
            <div className="tenant-home-room-details-filtering-entry">
                <label
                    className="tenant-home-room-details-filtering-label"
                    htmlFor="roomDetailsFilteringMaxCost"
                >
                    Max cost (in euros)
                </label>
                <select
                    className="tenant-home-room-details-filtering-select"
                    id="roomDetailsFilteringMaxCost"
                    name="roomDetailsFilteringMaxCost"
                    onChange={(e) => {setMaxCost(e.target.value)}}
                >
                    <option value={100}>100</option>
                    <option value={200}>200</option>
                    <option value={300}>300</option>
                    <option value={400}>400</option>
                    <option value={500}>500</option>
                    <option value={600}>600</option>
                    <option value={700}>700</option>
                    <option value={800}>800</option>
                    <option value={900}>900</option>
                </select>
            </div>
            <div className="tenant-home-room-details-filtering-entry">
                <label
                    className="tenant-home-room-details-filtering-label"
                    htmlFor="roomDetailsFilteringHeating"
                >
                    Heating
                </label>
                <select
                    className="tenant-home-room-details-filtering-select"
                    id="roomDetailsFilteringHeating"
                    name="roomDetailsFilteringHeating"
                    onChange={(e) => {setHeating(e.target.value)}}
                >
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                </select>
            </div>
        </div>
    )

    /* Determines the source where the image of the given room will be retrieved from */
    function decideThumbnailImageSource(room)
    {
        /* Case the room has a non-empty thumbnail image */
        if(room.thumbnail_img !== null)
            return `${api}/${room.thumbnail_img}`

        /* Case the room does not have a thumbnail image */
        return emptyImageSource
    }

    /* We create a DOM element for each room that belongs to the results */
    const domResultRooms = resultRooms.map(room => {
        return (
            <div key={room.id} className="tenant-home-results-entry">
                <img className="tenant-home-results-entry-image"
                    src={decideThumbnailImageSource(room)}
                    alt={`Thumbnail of the room`}
                />
                <div className="tenant-home-results-entry-details">
                    <div className="tenant-home-results-entry-detail">Cost per night: {room.cost} euros</div>
                    <div className="tenant-home-results-entry-detail">Room type: {room.roomType}</div>
                    <div className="tenant-home-results-entry-detail">Number of beds: {room.numOfBeds}</div>
                    <div className="tenant-home-results-entry-detail-click">Click for more info</div>
                </div>
            </div>
        )
    })

    function handleFilters(event)
    {
        console.log(`${checkInDate}, ${checkOutDate}, ${countryId}, ${stateId}, ${cityId}, ${numOfPeople}, ${roomType}, ${maxCost}, ${heating}`)
    }

    return (
        <div className="tenant-home">
            <div className="tenant-home-dates"> 
                <div>
                    <div className="tenant-home-date-title">Check in date</div>
                    <DatePicker onChange={setCheckInDate} value={checkInDate}/>
                </div>
                <div>
                    <div className="tenant-home-date-title">Check out date</div>
                    <DatePicker onChange={setCheckOutDate} value={checkOutDate}/>
                </div>
            </div>
            <div className="tenant-home-location-form">
                {locationSelectionForm}
            </div>
            <div>
                {roomDetailsForm}
            </div>
            <div className="tenant-home-submit-filters" onClick={handleFilters}>
                Apply filters
            </div>
            <div className="tenant-home-results">
                <div className="tenant-home-results-panel">
                    {domResultRooms}
                </div>
            </div>
        </div>
    )
}
