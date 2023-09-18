import React from 'react'
import {useParams} from 'react-router-dom'
import {MapContainer, TileLayer, Marker, Popup, useMap} from 'react-leaflet'
import {Icon} from 'leaflet'
import {GeoSearchControl, OpenStreetMapProvider} from 'leaflet-geosearch'
import {CountrySelect, StateSelect, CitySelect} from "react-country-state-city"
import {nanoid} from 'nanoid'
import api from '../../Interface.js'
import RoomImage from './RoomImage.js'
import "react-country-state-city/dist/react-country-state-city.css"
import 'leaflet/dist/leaflet.css'
import 'leaflet-geosearch/dist/geosearch.css'
import './UpdateRoom.css'

/************************************************************
 *   The path to the empty room image. It is used if the    *
 * landlord has not set up a thumbnail image for their room *
 ************************************************************/
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

/**************************************************************************
 * The DOM Open Street Map we will use to display the geological location *
 *      of the room. The center of the map is in the room's location      *
 **************************************************************************/
let map;

/**************************************************************************************
 * The array of input boxes which the user may edit to change the details of the room *
 **************************************************************************************/
let inputBoxes;

/*************************************************************************************************
 * The renderable array of input boxes which the user may edit to change the details of the room *
 *************************************************************************************************/
let domInputBoxes;

/***********************************************************************************
 * A set of three input boxes that allows the selection of country, state and city *
 ***********************************************************************************/
let locationSelectionForm;

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

/*****************************
 * The Update Room Component *
 *****************************/
export default function UpdateRoom({appState, setAppState})
{
    /* We retrieve the id of the room which is to be updated from the URL parameters */
    const {roomId} = useParams()

    /* We retrieve the username of the currently logged user */
    const username = appState.username

    /* We create a state that will contain all the information
     * related to the currently logged user (except for the password)
     */
    const [user, setUser] = React.useState({})

    /* This state will be storing all the details of the room (interior
     * details, rules, the main (thumbnail) image of the room, etc)
     */
    const [roomDetails, setRoomDetails] = React.useState({
        userId: "",
        openStreetMapX: 0,
        openStreetMapY: 0,
        openStreetMapLabel: "",
        address: "",
        accessibilityToMeansOfTransport: "",
        maxNumOfPeople: 0,
        cost: 0,
        additionalCostPerPerson: 0,
        roomType: "Private Room",
        rules: "",
        description: "",
        numOfBeds: 0,
        numOfBathrooms: 0,
        numOfBedrooms: 0,
        livingRoomInfo: "",
        roomArea: 0,
        heating: true
    })

    /* This state will be storing all the images that are assossiated
     * with the room (except for the main room image)
     */
    const [roomImages, setRoomImages] = React.useState([])

    /* We create a state that will contain the room's main image */
    const [thumbnailImage, setThumbnailImage] = React.useState({
        empty: true,
        file: undefined,
        content: ""
    })

    /*****************************************************************************
     *  This function is an event handler that is triggered every time the user  *
     *  puts an address in the search bar of the Open Street Map. The function   *
     *  retrieves the x and y coordinates of the point that matches the address  *
     * the user just gave. This point will be stored in the database and it will *
     *         be retrieved when a tenant views this room in the future          *
     *****************************************************************************/
    function searchEventHandler(result) {
        setRoomDetails(currentRoomDetails => {
            return {
                ...currentRoomDetails,
                openStreetMapX: result.location.x,
                openStreetMapY: result.location.y,
                openStreetMapLabel: result.location.label
            }
        })
    }

    /*******************************************************************************************************************************************
     * Below is a React Component that we need to create a search bar so the user can locate addresses on the map                              *
     *                                                                                                                                         *
     * Source 1: https://stackoverflow.com/questions/48290555/react-leaflet-search-box-implementation                                          *
     * Source 2: https://github.com/smeijer/leaflet-geosearch                                                                                  *
     * Source 3: https://gis.stackexchange.com/questions/421128/getting-coordinates-after-address-has-been-picked-in-leaflet-geosearch-control *
     *******************************************************************************************************************************************/
    const SearchBar = (props) => {

        /* Access to leaflet map */
        const map = useMap()
        const {provider} = props

        React.useEffect(() => {

            const searchControl = new GeoSearchControl({
                provider: provider, // required
                style: 'bar',
                showMarker: true, // optional: true|false  - default true
                showPopup: true, // optional: true|false  - default false
                marker: {
                // optional: L.Marker    - default L.Icon.Default
                icon: mapIcon,
                draggable: false,
                },
                popupFormat: ({ query, result }) => result.label, // optional: function    - default returns result label,
                resultFormat: ({ result }) => result.label, // optional: function    - default returns result label
                maxMarkers: 1, // optional: number      - default 1
                retainZoomLevel: false, // optional: true|false  - default false
                animateZoom: true, // optional: true|false  - default true
                autoClose: false, // optional: true|false  - default false
                searchLabel: 'Enter Room Address', // optional: string      - default 'Enter address'
                keepResult: false, // optional: true|false  - default false
                updateMap: true, // optional: true|false  - default true
                autoComplete: true, // optional: true|false  - default true
                autoCompleteDelay: 250 // optional: number      - default 250
            });

            map.on('geosearch/showlocation', searchEventHandler)

            /* This is how you add a control in vanilla leaflet */
            map.addControl(searchControl)
            return () => map.removeControl(searchControl)

        }, [props, map, provider])

        /* We do not want anything to show up from this component */
        return null
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
                <SearchBar provider={new OpenStreetMapProvider()}/>
            </MapContainer>
        )
    }

    /*******************************************************************
     *     A form that allows selection of country, state and city     *
     * Source: https://socket.dev/npm/package/react-country-state-city *
     *******************************************************************/
    function createLocationSelectionForm()
    {
        return (
            <div className="update-room-location-form-items">
                <div>
                    <div className="update-room-location-form-item-title">Country</div>
                    <CountrySelect
                        onChange={(e) => {
                            setRoomDetails(currentRoomDetails => {
                                return {
                                    ...currentRoomDetails,
                                    countryId: e.id
                                }
                            })
                        }}
                        placeHolder="Select Country"
                    />
                </div>
                <div>
                    <div className="update-room-location-form-item-title">State</div>
                    <StateSelect
                        countryid={roomDetails.countryId}
                        onChange={(e) => {
                            setRoomDetails(currentRoomDetails => {
                                return {
                                    ...currentRoomDetails,
                                    stateId: e.id
                                }
                            })
                        }}
                        placeHolder="Select State"
                    />
                </div>
                <div>
                    <div className="update-room-location-form-item-title">City</div>
                    <CitySelect
                        countryid={roomDetails.countryId}
                        stateid={roomDetails.stateId}
                        onChange={(e) => {
                            setRoomDetails(currentRoomDetails => {
                                return {
                                    ...currentRoomDetails,
                                    cityId: e.id
                                }
                            })
                        }}
                        placeHolder="Select City"
                    />
                </div>
            </div>
        )
    }

    /* We create the 3-input-box form that allows selection of country, state and city */
    locationSelectionForm = createLocationSelectionForm()

    /* Updates the state of the room details whenever
     * the user changes the input of any box
     */
    function updateRoomDetails(event)
    {
        /* We update the state of the room details */
        setRoomDetails(currentRoomDetails => {
            return {
                ...currentRoomDetails,
                [event.target.name]: event.target.value
            }
        })
    }

    /* A callback that will be used by the input boxes as "onChange" action */
    const updateRoomDetailsCallback = (event) => {updateRoomDetails(event)}

    /***********************************************************************************
     * When the component first loads, we fetch all the information we need to display *
     ***********************************************************************************/
    React.useEffect(() => {

        /* Fetches all the information of the currently logged-in user */
        async function fetchUser() {
            setUser(await getUserByUsername(username))
        }

        /* Returns all the information assossiated with the room that has the given ID */
        async function getRoomInfo(roomId)
        {
            let retrievedRoomDetails, retrievedRoomImages;

            await fetch(`${api}/rooms/viewRoom/${roomId}`)
            .then((res) => res.json())
            .then(async (data) => {

                /* We store the details of the room that were just delivered */
                retrievedRoomDetails = data.room

                /* We fetch and store the images of the room as well */
                retrievedRoomImages = await getRoomImages(retrievedRoomDetails.id)

                /* With the details we received, we re-create the Open Street Map of the room */
                map = createMap(
                    retrievedRoomDetails.openStreetMapX,
                    retrievedRoomDetails.openStreetMapY,
                    retrievedRoomDetails.openStreetMapLabel
                )

                /* We update the corresponding states of the component */
                setRoomDetails(retrievedRoomDetails)

                const finalRetrievedRoomImages = retrievedRoomImages.map(image => {
                    return {
                        imgId: nanoid(),
                        imgFile: null,
                        imgName: "images",
                        imgSource: `${api}/${image.path}`,
                        imgIsNew: false
                    }
                })

                setRoomImages(finalRetrievedRoomImages)
            })
        }

        /* Fetches all the details & images of the room of this page */
        async function fetchRoomInfo() {
            await getRoomInfo(roomId)
        }

        /* We fetch the landlord who is currently logged-in */
        fetchUser()

        /* We fetch the details & images of the room */
        fetchRoomInfo()

    }, [username, roomId])

    /* We create the editable input boxes that describe the details of the house */
    inputBoxes = [
        {
            index: 0,
            id: "address",
            name: "address",
            type: "text",
            placeholder: "Write your description here",
            value: roomDetails.address,
            onChange: updateRoomDetailsCallback,
            labelText: "Write the address of your room"
        },
        {
            index: 1,
            id: "accessibilityToMeansOfTransport",
            name: "accessibilityToMeansOfTransport",
            type: "text",
            placeholder: "Write your description here",
            value: roomDetails.accessibilityToMeansOfTransport,
            onChange: updateRoomDetailsCallback,
            labelText: "Describe the accessibility to the Means Of Transport from your room"
        },
        {
            index: 2,
            id: "maxNumOfPeople",
            name: "maxNumOfPeople",
            type: "text",
            placeholder: "Write your description here",
            value: roomDetails.maxNumOfPeople,
            onChange: updateRoomDetailsCallback,
            labelText: "What is the maximum amount of people that can reside in your room?"
        },
        {
            index: 3,
            id: "cost",
            name: "cost",
            type: "text",
            placeholder: "Write your description here",
            value: roomDetails.cost,
            onChange: updateRoomDetailsCallback,
            labelText: "How much does your room cost (in euros) for a night?"
        },
        {
            index: 4,
            id: "additionalCostPerPerson",
            name: "additionalCostPerPerson",
            type: "text",
            placeholder: "Write your description here",
            value: roomDetails.additionalCostPerPerson,
            onChange: updateRoomDetailsCallback,
            labelText: "How much (in euros) does the cost increase for each additional person?"
        },
        {
            index: 5,
            id: "roomType",
            name: "roomType",
            type: "selectRoomType",
            placeholder: "Write your description here",
            value: roomDetails.roomType,
            onChange: updateRoomDetailsCallback,
            labelText: "Describe the type of your room"
        },
        {
            index: 6,
            id: "rules",
            name: "rules",
            type: "text",
            placeholder: "Write your description here",
            value: roomDetails.rules,
            onChange: updateRoomDetailsCallback,
            labelText: "Describe any rules you may have set for your room"
        },
        {
            index: 7,
            id: "description",
            name: "description",
            type: "text",
            placeholder: "Write your description here",
            value: roomDetails.description,
            onChange: updateRoomDetailsCallback,
            labelText: "Write here a general description for your room"
        },
        {
            index: 8,
            id: "numOfBeds",
            name: "numOfBeds",
            type: "text",
            placeholder: "Write your description here",
            value: roomDetails.numOfBeds,
            onChange: updateRoomDetailsCallback,
            labelText: "How many beds does your room have?"
        },
        {
            index: 9,
            id: "numOfBathrooms",
            name: "numOfBathrooms",
            type: "text",
            placeholder: "Write your description here",
            value: roomDetails.numOfBathrooms,
            onChange: updateRoomDetailsCallback,
            labelText: "How many bathrooms does your room have?"
        },
        {
            index: 10,
            id: "numOfBedrooms",
            name: "numOfBedrooms",
            type: "text",
            placeholder: "Write your description here",
            value: roomDetails.numOfBedrooms,
            onChange: updateRoomDetailsCallback,
            labelText: "How many bedrooms does your room have?"
        },
        {
            index: 11,
            id: "livingRoomInfo",
            name: "livingRoomInfo",
            type: "text",
            placeholder: "Write your description here",
            value: roomDetails.livingRoomInfo,
            onChange: updateRoomDetailsCallback,
            labelText: "Is there a living room in your room? Give some information about that"
        },
        {
            index: 12,
            id: "roomArea",
            name: "roomArea",
            type: "text",
            placeholder: "Write your description here",
            value: roomDetails.roomArea,
            onChange: updateRoomDetailsCallback,
            labelText: "What's the area (in square meters) of your room?"
        },
        {
            index: 13,
            id: "heating",
            name: "heating",
            type: "selectHeating",
            placeholder: "Write your description here",
            value: roomDetails.heating,
            onChange: updateRoomDetailsCallback,
            labelText: "Does the room have a heating system?"
        }
    ]

    /* We create the DOM elements that will be using the above information */
    domInputBoxes = inputBoxes.map(inputBox => {

        if(inputBox.type === "selectHeating")
        {
            return (
                <div key={inputBox.index} className="update-room-input-parent">
                    <label
                        className="update-room-label"
                        htmlFor={inputBox.id}
                    >
                        {inputBox.labelText}
                    </label>
                    <select
                        className="update-room-input"
                        id={inputBox.id}
                        name={inputBox.name}
                        onChange={inputBox.onChange}
                    >
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                    </select>
                </div>
            )
        }

        if(inputBox.type === "selectRoomType")
        {
            return (
                <div key={inputBox.index} className="update-room-input-parent">
                    <label
                        className="update-room-label"
                        htmlFor={inputBox.id}
                    >
                        {inputBox.labelText}
                    </label>
                    <select
                        className="update-room-input"
                        id={inputBox.id}
                        name={inputBox.name}
                        onChange={inputBox.onChange}
                    >
                        <option value={"Private Room"}>Private Room</option>
                        <option value={"Shared Room"}>Shared Room</option>
                        <option value={"House"}>House</option>
                    </select>
                </div>
            )
        }

        return (
            <div key={inputBox.index} className="update-room-input-parent">
                <label
                    className="update-room-label"
                    htmlFor={inputBox.id}
                >
                    {inputBox.labelText}
                </label>
                <input
                    className="update-room-input"
                    type={inputBox.type}
                    placeholder={inputBox.placeholder}
                    name={inputBox.name}
                    id={inputBox.id}
                    value={inputBox.value}
                    onChange={inputBox.onChange}
                />
            </div>
        )
    })

    /* This function returns the value that will be used for
     * the 'src' attribute of the thumbnail image tag.
     */
    function decideThumbnailImageSource()
    {
        /* If the thumbnail image state does not contain an image, that means
         * the user has not yet set a new thumbnail image for their room, so
         * the already existing image will be displayed (if one exists).
         */
        if(thumbnailImage.empty === true)
        {
            if(roomDetails.thumbnail_img !== null)
                return `${api}/${roomDetails.thumbnail_img}`

            return emptyImageSource
        }

        /* Case the landlord has set up a new thumbnail image for the room */
        return thumbnailImage.content
    }

    /* A function that changes the thumbnail image of the room */
    function handleThumbnailImageChange(event)
    {
        if(!event.target.files[0])
            return

        const chosenFile = event.target.files[0]
        const fileReader = new FileReader()

        fileReader.onloadend = (e) => {
            const content = fileReader.result
            setThumbnailImage({
                empty: false,
                file: chosenFile,
                content: content
            })
        }

        fileReader.readAsDataURL(chosenFile)
    }

    /* Adds the newly selected image to the array of additional images */
    function handleAdditionalImagesChange(event)
    {
        if(!event.target.files[0])
            return

        const chosenFile = event.target.files[0]
        const fileReader = new FileReader()

        fileReader.onloadend = (e) => {
            const content = fileReader.result
            setRoomImages(currentRoomImages => {
                let newRoomImages = currentRoomImages.map(image => image)
                newRoomImages.push({
                    imgId: nanoid(),
                    imgFile: chosenFile,
                    imgName: "images",
                    imgSource: content,
                    imgIsNew: true
                })
                return newRoomImages
            })
        }

        fileReader.readAsDataURL(chosenFile)
    }

    /* Removes from the room images state the image with the desired ID */
    function removeRoomImageById(id)
    {
        setRoomImages(currentRoomImages => {

            /* We copy the current images array to a new array */
            let newRoomImages = currentRoomImages.map(image => image)

            /* We will search the array for the image we want to delete */
            let i, len = newRoomImages.length
            for(i = 0; i < len; i++)
            {
                const currentImage = newRoomImages[i]

                /* If we found the desired image for deletion, we delete
                 * it and we return the new array with one less image.
                 */
                if(currentImage.imgId === id)
                {
                    newRoomImages.splice(i, 1)
                    return newRoomImages
                }
            }

            /* The code should not reach this place, but we
             * typically return the new array of images.
             */
            return newRoomImages
        })
    }

    const domRoomImages = roomImages.map(roomImage => {
        return (
            <RoomImage
                key={roomImage.imgId}
                roomImageSource={roomImage.imgSource}
                onClickAction={() => removeRoomImageById(roomImage.imgId)}
            />
        )
    })

    const details = (
        <div>
            <div>Update Room ({user.name} {user.lastname}, Room id: {roomId})</div>
            <div>Room id: {roomDetails.id}, Room area: {roomDetails.roomArea}</div>
            <div>Number of extra images: {roomImages.length}</div>
        </div>
    )

    return (
        <div className="update-room">
            <div className="update-room-title">
                Change any details you would like and click on the
                "Save Changes" button at the bottom of the page
            </div>
            <div>
                {map}
            </div>
            <div>
                {locationSelectionForm}
            </div>
            <div className="update-room-inputs-array">
                {domInputBoxes}
            </div>
            <div className="update-room-thumbnail-image-parent">
                <img className="update-room-thumbnail-image"
                    src={decideThumbnailImageSource()}
                    alt={`Thumbnail of the new room`}
                />
                <label htmlFor="thumbnailImage" className="update-room-image-label">
                    Set thumbnail image
                    <input
                        className="update-room-image-input"
                        id="thumbnailImage"
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailImageChange}
                    />
                </label>
            </div>
            <div className="update-room-extra-images-parent">
                <div className="update-room-extra-images">
                    {domRoomImages}
                </div>
                <label htmlFor="additionalImages" className="update-room-image-label">
                    Upload additional images
                    <input
                        className="update-room-image-input"
                        id="additionalImages"
                        type="file"
                        accept="image/*"
                        onChange={handleAdditionalImagesChange}
                    />
                </label>
            </div>
            <div>
                {details}
            </div>
        </div>
    )
}
