import React from 'react'
import {useNavigate} from 'react-router-dom'
import api from '../../Interface.js'
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import {CountrySelect, StateSelect, CitySelect} from "react-country-state-city"
import "react-country-state-city/dist/react-country-state-city.css"
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css'
import 'react-calendar/dist/Calendar.css'
import './GuestHome.css'

/************************************
 * The path to the empty room image *
 ************************************/
const emptyImageSource = "./Images/EmptyHouseImage.jpg"

/*******************************************************
 * The amount of rooms that are displayed in each page *
 *******************************************************/
const numOfRoomsPerPage = 10

/***********************************************************************
 * Given the population number of a collection of items and the items  *
 *  that can be displayed in a single page, this function returns the  *
 * amount of needed pages to represent all the items of the collection *
 ***********************************************************************/
function getAmountOfNeededPages(itemsNum, itemsPerPage)
{
    /* The last page may not have 'itemsPerPage' items. If the last
     * page has not 'itemsPerPage' items, then the remainder of the
     * division 'itemsNum'/'itemsPerPage' is not zero. In this case
     * we return the quotient plus one for the non-full page.
     */
    const quotient = Math.floor(itemsNum / itemsPerPage)
    const remainder = itemsNum % itemsPerPage

    if(remainder !== 0)
        return quotient + 1

    return quotient
}

/**************************************************
 * Returns all the existing rooms in the database *
 **************************************************/
async function getAllRooms()
{
    let rooms;

    await fetch(`${api}/rooms/getAllRooms`)
    .then((res) => res.json())
    .then((data) => {
        rooms = data.rooms
        rooms.sort((a,b) => a.cost - b.cost)
    })

    return rooms
}

/****************************
 * The Guest Home Component *
 ****************************/
export default function GuestHome({user})
{
    /* This will be used to navigate to the page of detailed information of a room */
    const navigate = useNavigate()

    /* A state that stores the currently selected check-in & check-out dates */
    const [dateValues, setDateValues] = React.useState([new Date(), new Date()])

    /* States that store the country, state and city that are currently chosen */
    const [countryId, setCountryId] = React.useState(0)
    const [stateId, setStateId] = React.useState(0)
    const [cityId, setCityId] = React.useState(0)

    /* States that store filters about the number of people, room type and other services */
    const [numOfPeople, setNumOfPeople] = React.useState("1")
    const [roomType, setRoomType] = React.useState("Any")
    const [maxCost, setMaxCost] = React.useState("0")
    const [heating, setHeating] = React.useState("Any")
    const [numOfBeds, setNumOfBeds] = React.useState("0")
    const [numOfBathrooms, setNumOfBathrooms] = React.useState("0")
    const [numOfBedrooms, setNumOfBedrooms] = React.useState("0")
    const [roomArea, setRoomArea] = React.useState("0")

    /* A state with all the rooms that are displayed in the home page */
    const [resultRooms, setResultRooms] = React.useState({
        content: [],
        hasBeenInitialized: false
    })

    /* We create a state with the first, the current and the last page of displayed rooms */
    const [pageTrio, setPageTrio] = React.useState({first: 1, current: 1, last: 1})

    /* When the component loads for the first time, no filters have been
     * selected yet and therefore we fetch all the rooms of the database.
     */
    React.useEffect(() => {

        /* This function fetches the information of all the rooms */
        async function fetchRooms() {

            let lengthOfRoomsArray;

            /* We fetch the data and store the rooms to the 'resultRooms' state
             * only if this is the first time we execute this effect.
             */
            if(!resultRooms.hasBeenInitialized)
            {
                const initialRooms = await getAllRooms()
                lengthOfRoomsArray = initialRooms.length

                setResultRooms({
                    content: initialRooms,
                    hasBeenInitialized: true
                })
            }

            else
                lengthOfRoomsArray = resultRooms.content.length

            /* We also initialize the page trio according to the rooms' quantity */
            setPageTrio({
                first: 1,
                current: 1,
                last: getAmountOfNeededPages(lengthOfRoomsArray, numOfRoomsPerPage)
            })
        }

        /* We call the above function to fetch all the existing rooms */
        fetchRooms()

    }, [resultRooms.content.length, resultRooms.hasBeenInitialized])

    /* A function that navigates the user to the first page of rooms */
    function goToFirstPage()
    {
        /* If we are already in the first page, there is nothing to do */
        if(pageTrio.current === pageTrio.first)
            return

        /* Else we change the state of the page trio so as it represents the first page */
        setPageTrio(currentPageTrio => {
            return {...currentPageTrio, current: pageTrio.first}
        })
    }

    /* A function that navigates the user to the last page of rooms */
    function goToLastPage()
    {
        /* If we are already in the last page, there is nothing to do */
        if(pageTrio.current === pageTrio.last)
            return

        /* Else we change the state of the page trio so as it represents the last page */
        setPageTrio(currentPageTrio => {
            return {...currentPageTrio, current: pageTrio.last}
        })
    }

    /* A function that navigates the user to the next page of rooms */
    function goToNextPage()
    {
        /* If we are in the last page, there is nothing to do */
        if(pageTrio.current === pageTrio.last)
            return

        /* Else we change the state of the page trio so as it represents the next page */
        setPageTrio(currentPageTrio => {
            return {...currentPageTrio, current: currentPageTrio.current + 1}
        })
    }

    /* A function that navigates the users to the previous page of rooms */
    function goToPreviousPage()
    {
        /* If we are in the first page, there is nothing to do */
        if(pageTrio.current === pageTrio.first)
            return

        /* Else we change the state of the page trio so as it represents the previous page */
        setPageTrio(currentPageTrio => {
            return {...currentPageTrio, current: currentPageTrio.current - 1}
        })
    }

    /* A function that navigates the user to an event-specified page of rooms */
    function goToSpecifiedPage(event)
    {
        /* The specified page where the user wants to go comes from an "onChange" event */
        const specifiedPage = Number(event.target.value)

        /* We change the state of the page trio so as it represents the specified page */
        setPageTrio(currentPageTrio => {
            return {
                ...currentPageTrio,
                current: (specifiedPage >= currentPageTrio.first && specifiedPage <= currentPageTrio.last) ? specifiedPage : currentPageTrio.current
            }
        })
    }

    /* A callback function used to call 'goToSpecifiedPage' */
    const goToSpecifiedPageCallback = (event) => {goToSpecifiedPage(event)}

    /* A form that allows selection of country, state and city
     *
     * Source: https://socket.dev/npm/package/react-country-state-city
     */
    const locationSelectionForm = (
        <div className="guest-home-location-form-items">
            <div>
                <div className="guest-home-location-form-item-title">Country</div>
                <CountrySelect
                    onChange={(e) => {
                        setCountryId(e.id)
                    }}
                    placeHolder="Select Country"
                />
            </div>
            <div>
                <div className="guest-home-location-form-item-title">State</div>
                <StateSelect
                    countryid={countryId}
                    onChange={(e) => {
                        setStateId(e.id)
                    }}
                    placeHolder="Select State"
                />
            </div>
            <div>
                <div className="guest-home-location-form-item-title">City</div>
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
        <div className="guest-home-room-details-filtering">
            <div className="guest-home-room-details-filtering-entry">
                <label
                    className="guest-home-room-details-filtering-label"
                    htmlFor="roomDetailsFilteringNumOfPeople"
                >
                    Number of people
                </label>
                <select
                    className="guest-home-room-details-filtering-select"
                    id="roomDetailsFilteringNumOfPeople"
                    name="roomDetailsFilteringNumOfPeople"
                    onChange={(e) => {setNumOfPeople(e.target.value)}}
                >
                    <option value={"1"}>1</option>
                    <option value={"2"}>2</option>
                    <option value={"3"}>3</option>
                    <option value={"4"}>4</option>
                    <option value={"5"}>5</option>
                    <option value={"6"}>6</option>
                    <option value={"7"}>7</option>
                    <option value={"8"}>8</option>
                </select>
            </div>
            <div className="guest-home-room-details-filtering-entry">
                <label
                    className="guest-home-room-details-filtering-label"
                    htmlFor="roomDetailsFilteringRoomType"
                >
                    Room type
                </label>
                <select
                    className="guest-home-room-details-filtering-select"
                    id="roomDetailsFilteringRoomType"
                    name="roomDetailsFilteringRoomType"
                    onChange={(e) => {setRoomType(e.target.value)}}
                >
                    <option value={"Any"}>Any</option>
                    <option value={"Private Room"}>Private Room</option>
                    <option value={"Shared Room"}>Shared Room</option>
                    <option value={"House"}>House</option>
                </select>
            </div>
            <div className="guest-home-room-details-filtering-entry">
                <label
                    className="guest-home-room-details-filtering-label"
                    htmlFor="roomDetailsFilteringMaxCost"
                >
                    Max cost (in euros)
                </label>
                <select
                    className="guest-home-room-details-filtering-select"
                    id="roomDetailsFilteringMaxCost"
                    name="roomDetailsFilteringMaxCost"
                    onChange={(e) => {setMaxCost(e.target.value)}}
                >
                    <option value={"0"}>Any</option>
                    <option value={"100"}>100</option>
                    <option value={"200"}>200</option>
                    <option value={"300"}>300</option>
                    <option value={"400"}>400</option>
                    <option value={"500"}>500</option>
                    <option value={"600"}>600</option>
                    <option value={"700"}>700</option>
                    <option value={"800"}>800</option>
                    <option value={"900"}>900</option>
                </select>
            </div>
            <div className="guest-home-room-details-filtering-entry">
                <label
                    className="guest-home-room-details-filtering-label"
                    htmlFor="roomDetailsFilteringHeating"
                >
                    Heating
                </label>
                <select
                    className="guest-home-room-details-filtering-select"
                    id="roomDetailsFilteringHeating"
                    name="roomDetailsFilteringHeating"
                    onChange={(e) => {setHeating(e.target.value)}}
                >
                    <option value={"Any"}>Any</option>
                    <option value={"true"}>Yes</option>
                    <option value={"false"}>No</option>
                </select>
            </div>
            <div className="guest-home-room-details-filtering-entry">
                <label
                    className="guest-home-room-details-filtering-label"
                    htmlFor="roomDetailsFilteringNumOfBeds"
                >
                    Number of beds
                </label>
                <select
                    className="guest-home-room-details-filtering-select"
                    id="roomDetailsFilteringNumOfBeds"
                    name="roomDetailsFilteringNumOfBeds"
                    onChange={(e) => {setNumOfBeds(e.target.value)}}
                >
                    <option value={"0"}>Any</option>
                    <option value={"1"}>1</option>
                    <option value={"2"}>2</option>
                    <option value={"3"}>3</option>
                    <option value={"4"}>4</option>
                    <option value={"5"}>5</option>
                    <option value={"6"}>6</option>
                    <option value={"7"}>7</option>
                    <option value={"8"}>8</option>
                </select>
            </div>
            <div className="guest-home-room-details-filtering-entry">
                <label
                    className="guest-home-room-details-filtering-label"
                    htmlFor="roomDetailsFilteringNumOfBathrooms"
                >
                    Number of bathrooms
                </label>
                <select
                    className="guest-home-room-details-filtering-select"
                    id="roomDetailsFilteringNumOfBathrooms"
                    name="roomDetailsFilteringNumOfBathrooms"
                    onChange={(e) => {setNumOfBathrooms(e.target.value)}}
                >
                    <option value={"0"}>Any</option>
                    <option value={"1"}>1</option>
                    <option value={"2"}>2</option>
                    <option value={"3"}>3</option>
                    <option value={"4"}>4</option>
                </select>
            </div>
            <div className="guest-home-room-details-filtering-entry">
                <label
                    className="guest-home-room-details-filtering-label"
                    htmlFor="roomDetailsFilteringNumOfBedrooms"
                >
                    Number of bedrooms
                </label>
                <select
                    className="guest-home-room-details-filtering-select"
                    id="roomDetailsFilteringNumOfBedrooms"
                    name="roomDetailsFilteringNumOfBedrooms"
                    onChange={(e) => {setNumOfBedrooms(e.target.value)}}
                >
                    <option value={"0"}>Any</option>
                    <option value={"1"}>1</option>
                    <option value={"2"}>2</option>
                    <option value={"3"}>3</option>
                    <option value={"4"}>4</option>
                </select>
            </div>
            <div className="guest-home-room-details-filtering-entry">
                <label
                    className="guest-home-room-details-filtering-label"
                    htmlFor="roomDetailsFilteringRoomArea"
                >
                    Room area
                </label>
                <select
                    className="guest-home-room-details-filtering-select"
                    id="roomDetailsFilteringRoomArea"
                    name="roomDetailsFilteringRoomArea"
                    onChange={(e) => {setRoomArea(e.target.value)}}
                >
                    <option value={"0"}>Any</option>
                    <option value={"20-30"}>20-30</option>
                    <option value={"30-40"}>30-40</option>
                    <option value={"40-50"}>40-50</option>
                    <option value={"50-60"}>50-60</option>
                    <option value={"60-70"}>60-70</option>
                    <option value={"70-80"}>70-80</option>
                    <option value={"80-90"}>80-90</option>
                    <option value={"90-100"}>90-100</option>
                    <option value={"100-110"}>100-110</option>
                    <option value={"110-120"}>110-120</option>
                    <option value={"120-130"}>120-130</option>
                    <option value={"130-140"}>130-140</option>
                    <option value={"140-150"}>140-150</option>
                    <option value={"150-160"}>150-160</option>
                    <option value={"160-170"}>160-170</option>
                    <option value={"170-180"}>170-180</option>
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

    /* This function redirects the user to the detailed page of the room they just clicked */
    function navigateToDetailedRoomPage(roomId)
    {
        navigate(`/roominfo/${roomId}/${dateValues[0]}/${dateValues[1]}`)
    }

    /* We create a DOM element for each room that belongs to the results */
    const domResultRooms = resultRooms.content.map(room => {
        return (
            <div key={room.id} className="guest-home-results-entry" onClick={() => {navigateToDetailedRoomPage(room.id)}}>
                <img className="guest-home-results-entry-image"
                    src={decideThumbnailImageSource(room)}
                    alt={`Thumbnail of the room`}
                />
                <div className="guest-home-results-entry-details">
                    <div className="guest-home-results-entry-detail">Cost per night: {room.cost} euros</div>
                    <div className="guest-home-results-entry-detail">Room type: {room.roomType}</div>
                    <div className="guest-home-results-entry-detail">Number of beds: {room.numOfBeds}</div>
                    <div className="guest-home-results-entry-detail">Rating: {(room.review_scores_rating > 0) ? `${room.review_scores_rating}/5` : "No rating"} ({room.number_of_reviews} reviews)</div>
                    <div className="guest-home-results-entry-detail-click">Click for more info</div>
                </div>
            </div>
        )
    })

    /* A system that helps the user change page of the displayed rooms */
    const pageManagement = (
        <div className="guest-home-page-management">
            <div className="guest-home-page-management-current-page-num">
                <div className="guest-home-page-management-current-page-num-context">Page</div>
                <div className="guest-home-page-management-current-page-num-value">{pageTrio.current}</div>
                <div className="guest-home-page-management-current-page-num-context">of</div>
                <div className="guest-home-page-management-current-page-num-value">{pageTrio.last}</div>
            </div>
            <button
                className={(pageTrio.current !== pageTrio.first) ?
                    "guest-home-page-management-button" :
                    "guest-home-page-management-disabled-button"
                }
                onClick={goToFirstPage}
            >
                First
            </button>
            <button
                className={(pageTrio.current !== pageTrio.first) ?
                    "guest-home-page-management-button" :
                    "guest-home-page-management-disabled-button"
                }
                onClick={goToPreviousPage}
            >
                Prev
            </button>
            <button
                className={(pageTrio.current !== pageTrio.last) ?
                    "guest-home-page-management-button" :
                    "guest-home-page-management-disabled-button"
                }
                onClick={goToNextPage}
            >
                Next
            </button>
            <button
                className={(pageTrio.current !== pageTrio.last) ?
                    "guest-home-page-management-button" :
                    "guest-home-page-management-disabled-button"
                }
                onClick={goToLastPage}
            >
                Last
            </button>
            <div className="guest-home-page-management-goto-page">
                <div className="guest-home-page-management-goto-page-title">
                    Go to page:
                </div>
                <div
                    className={(pageTrio.current !== pageTrio.first) ?
                        "guest-home-page-management-goto-page-altering-box" :
                        "guest-home-page-management-goto-page-altering-box-disabled"
                    }
                    onClick={goToPreviousPage}
                >
                    -
                </div>
                <input
                    className="guest-home-page-management-goto-page-input-box"
                    style={{color: ((pageTrio.current < pageTrio.first) || (pageTrio.current > pageTrio.last)) ? "red" : "black"}}
                    type="text"
                    name="current"
                    value={pageTrio.current}
                    onChange={goToSpecifiedPageCallback}
                />
                <div
                    className={(pageTrio.current !== pageTrio.last) ?
                        "guest-home-page-management-goto-page-altering-box" :
                        "guest-home-page-management-goto-page-altering-box-disabled"
                    }
                    onClick={goToNextPage}
                >
                    +
                </div>
            </div>
        </div>
    )

    /* We only want to display the rooms of the current page. We filter those rooms
     * from the array with all the rooms with the help of the 'slice' method.
     */
    const domResultRoomsOfCurrentPage = domResultRooms.slice((pageTrio.current - 1) * numOfRoomsPerPage,
    (pageTrio.current * numOfRoomsPerPage < domResultRooms.length) ? pageTrio.current * numOfRoomsPerPage : undefined)

    /* A function that converts a date such as: "Fri Sep 15 2023 19:21:20 GMT+0300 (Θερινή ώρα Ανατολικής Ευρώπης)"
     * into a date in the form "YYYY-MM-DD"
     */
    function refineDateString(rawDate)
    {
        const rawDateTokens = rawDate.toISOString().split(/-|T/)
        return `${rawDateTokens[0]}-${rawDateTokens[1]}-${rawDateTokens[2]}`
    }

    /* Fetches all the which satisfy the given filters */
    async function handleFilters(event)
    {
        /* We convert the given check-in & check-out dates to the form 'YYYY-MM-DD' */
        const finalInDate = refineDateString(dateValues[0])
        const finalOutDate = refineDateString(dateValues[1])

        /* We initialize the object that will contain all the filtering data
         *
         * The number of people and the check-in & check-out dates are obligatory fields
         */
        const finalFilterData = {
            numOfPeople: Number(numOfPeople),
            InDate: finalInDate,
            OutDate: finalOutDate,
        }

        /* We insert the country filter if one has been given */
        if(countryId !== 0)
            finalFilterData["countryId"] = countryId

        /* We insert the state filter if one has been given */
        if(stateId !== 0)
            finalFilterData["stateId"] = stateId

        /* We insert the city filter if one has been given */
        if(cityId !== 0)
            finalFilterData["cityId"] = cityId

        /* We insert the room type filter if one has been given */
        if(roomType !== "Any")
            finalFilterData["roomType"] = roomType

        /* We insert the maximum cost per night filter if one has been given */
        if(maxCost !== "0")
            finalFilterData["maxCost"] = Number(maxCost)

        /* We insert the heating filter if one has been given */
        if(heating !== "Any")
            finalFilterData["heating"] = (heating === "true") ? true : false

        /* We insert the number of beds filter if one has been given */
        if(numOfBeds !== "0")
            finalFilterData["numOfBeds"] = Number(numOfBeds)

        /* We insert the number of bathrooms filter if one has been given */
        if(numOfBathrooms !== "0")
            finalFilterData["numOfBathrooms"] = Number(numOfBathrooms)

        /* We insert the number of bedrooms filter if one has been given */
        if(numOfBedrooms !== "0")
            finalFilterData["numOfBedrooms"] = Number(numOfBedrooms)

        /* We insert the room area filter if one has been given */
        if(roomArea !== "0")
        {
            const roomAreaTokens = roomArea.split("-")
            finalFilterData["minArea"] = Number(roomAreaTokens[0])
            finalFilterData["maxArea"] = Number(roomAreaTokens[1])
        }

        console.log(finalFilterData)

        /* We retrieve all the rooms that satisfy the given filters */
        await fetch(`${api}/rooms/getAvailableRoomsByFilters`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(finalFilterData)
        })
        .then((res) => res.json())
        .then((data) => {
            let newResultRooms = data.rooms
            newResultRooms.sort((a,b) => a.cost - b.cost)
            setResultRooms(currentResultRooms => {
                return {
                    ...currentResultRooms,
                    content: newResultRooms
                }
            })
        })
    }

    return (
        <div className="guest-home">
            <div className="guest-home-dates">
                <div className="guest-home-dates-title">Select check-in & check-out dates</div>
                <DateRangePicker
                    onChange={setDateValues}
                    value={dateValues}
                />
            </div>
            <div className="guest-home-location-form">
                {locationSelectionForm}
            </div>
            <div>
                {roomDetailsForm}
            </div>
            <div className="guest-home-submit-filters" onClick={handleFilters}>
                Apply filters
            </div>
            <div className="guest-home-results">
                <div>
                    {pageManagement}
                </div>
                <div className="guest-home-results-panel">
                    {domResultRoomsOfCurrentPage}
                </div>
                <div>
                    {pageManagement}
                </div>
            </div>
        </div>
    )
}
