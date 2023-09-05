import React from 'react'
import {useNavigate} from 'react-router-dom'
import {MapContainer, TileLayer, useMap} from 'react-leaflet'
import {Icon} from 'leaflet'
import {GeoSearchControl, OpenStreetMapProvider} from 'leaflet-geosearch'
import {nanoid} from 'nanoid'
import {CountrySelect, StateSelect, CitySelect} from "react-country-state-city"
import api from '../../Interface.js'
import RoomImage from './RoomImage.js'
import PageNotFound from '../PageNotFound.js'
import "react-country-state-city/dist/react-country-state-city.css"
import 'leaflet/dist/leaflet.css'
import 'leaflet-geosearch/dist/geosearch.css'
import './NewRoomForm.css'

/************************************************************
 *   The path to the empty room image. It is used if the    *
 * landlord has not set up a thumbnail image for their room *
 ************************************************************/
const emptyImageSource = "./Images/EmptyHouseImage.jpg"

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

/*******************************
 * The New Room Form Component *
 *******************************/
export default function NewRoomForm({appState, setAppState})
{
    /* We will use this to redirect the user to the home page
     * when the creation of the new room is finished.
     */
    const navigate = useNavigate()

    /* We retrieve the username of the currently logged user */
    const username = appState.username

    /* We create a state that will contain all the information
     * related to the currently logged user (except for the password)
     */
    const [user, setUser] = React.useState({})

    /* This state determines if the user who just requested this page
     * is a verified landlord or not. If the user is not a verified
     * landlord, they have not the rights to use the content of this page.
     * Only verified landlords have the right to create new rooms.
     */
    const [isActiveLandlord, setIsActiveLandlord] = React.useState(true)

    /* We fetch the information that is related to the given
     * username from the backend server
     */
    React.useEffect(() => {

        /* This function fetches the user's information */
        async function fetchUser(usr) {

            /* Case no user is logged-in */
            if(usr === "")
            {
                setIsActiveLandlord(false)
                return
            }

            /* We fetch the data and store it to the user state */
            setUser(await getUserByUsername(usr))

            /* We examine if the user is indeed a verified landlord.
             * Only a verified landlord has the right to create new rooms
             * and showcase them in the site. If the user who requested
             * this page is not a verified landlord, the "Page Not Found"
             * component will be rendered to them instead.
             */
            if(user.active === false)
                setIsActiveLandlord(false)
        }

        /* If the user has already been fetched, we do not repeat the process.
         * This is useful if this effect will be executed multiple times. We
         * only need to fetch the user once - the first time this effect runs.
         */
        if(JSON.stringify(user) !== JSON.stringify({}))
            return

        /* We call the above function to fetch the user data */
        fetchUser(username)

    }, [username, user])

    /* The details of the room the landlord wants to create.
     * We will store the details in this state and send them
     * to the backend server when the time comes.
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
        roomType: "",
        rules: "",
        description: "",
        numOfBeds: 0,
        numOfBathrooms: 0,
        numOfBedrooms: 0,
        livingRoomInfo: "",
        roomArea: 0,
        heating: true
    })

    /* We create a state that will contain the room's main image */
    const [thumbnailImage, setThumbnailImage] = React.useState({
        empty: true,
        file: undefined,
        content: ""
    })

    /* This function returns the value that will be used for
     * the 'src' attribute of the thumbnail image tag.
     */
    function decideThumbnailImageSource()
    {
        /* If the thumbnail image state does not contain an image, that means
         * the user has not yet set a thumbnail image for their room. In this
         * case we will use an arbitrary image that indicates there is no
         * image.
         */
        if(thumbnailImage.empty === true)
            return emptyImageSource

        /* Case the landlord has set up a thumbnail image for the new room */
        return thumbnailImage.content
    }

    /* This state will be storing all the images that are assossiated
     * with the room (except for the main room image)
     */
    const [roomImages, setRoomImages] = React.useState([])

    /* States that store the country, state and city that are currently chosen */
    const [countryId, setCountryId] = React.useState(0)
    const [stateId, setStateId] = React.useState(0)
    const [cityId, setCityId] = React.useState(0)

    /* Updates the state of the room details whenever
     * the user changes the input of any box
     */
    function updateRoomDetails(event)
    {
        /* We update the state of the room details */
        setRoomDetails(currentRoomDetails => {
            return {...currentRoomDetails, [event.target.name]: event.target.value}
        })
    }

    /* A callback that will be used by the input boxes as "onChange" action */
    const updateRoomDetailsCallback = (event) => {updateRoomDetails(event)}

    /* We create the information we need for each input box */
    const inputBoxes = [
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
            type: "text",
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
            type: "select",
            placeholder: "Write your description here",
            value: roomDetails.heating,
            onChange: updateRoomDetailsCallback,
            labelText: "Does the room have a heating system?"
        }
    ]

    /* We create the DOM elements that will be using the above information */
    const domInputBoxes = inputBoxes.map(inputBox => {

        if(inputBox.type === "select")
        {
            return (
                <div key={inputBox.index} className="new-room-form-input-parent">
                    <label
                        className="new-room-form-label"
                        htmlFor={inputBox.id}
                    >
                        {inputBox.labelText}
                    </label>
                    <select
                        className="new-room-form-input"
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

        return (
            <div key={inputBox.index} className="new-room-form-input-parent">
                <label
                    className="new-room-form-label"
                    htmlFor={inputBox.id}
                >
                    {inputBox.labelText}
                </label>
                <input
                    className="new-room-form-input"
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

    /* If the user is not a verified landlord, we return "Page Not Found" */
    if(isActiveLandlord === false)
        return <PageNotFound/>

    /* The OpenStreetMap Attribution (the credits to those who made the
     * map and also to the author of the custom icons of the markers)
     */
    const mapAttribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors | <a href="https://www.flaticon.com/free-icons/pin" title="pin icons">Pin icons created by Freepik - Flaticon</a>'

    /* The OpenStreetMap url (the map we will use for this site) */
    const mapUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

    /* The custom icon we will use for the OpenStreetMap (created by Freepik) */
    const mapIcon = new Icon({
        iconUrl: "./Images/OpenStreetMapIcon.png",
        iconSize: [38,38]
    })

    /* This function is an event handler that is triggered every time the user
     * puts an address in the search bar of the Open Street Map. The function
     * retrieves the x and y coordinates of the point that matches the address
     * the user just gave. This point will be stored in the database and it will
     * be retrieved when a tenant views this room in the future.
     */
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
     * Below is a React Component that we need to create a search bar so the user can locate addresses on the map                                                *
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

    /* The DOM OpenStreetMap we will render in the component of this file
     * The center is in Paris (coordinates: [48.8566, 2.3522])
     */
    const map = (
        <MapContainer
            center={[48.8566, 2.3522]}
            zoom={13}
        >
            <TileLayer
                attribution={mapAttribution}
                url={mapUrl}
            />
            <SearchBar provider={new OpenStreetMapProvider()}/>
        </MapContainer>
    )

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
                    imgSource: content
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

    /* A form that allows selection of country, state and city
     *
     * Source: https://socket.dev/npm/package/react-country-state-city
     */
    const locationSelectionForm = (
        <div className="new-room-form-location-form-items">
            <div>
                <div className="new-room-form-location-form-item-title">Country</div>
                <CountrySelect
                    onChange={(e) => {
                        setCountryId(e.id)
                    }}
                    placeHolder="Select Country"
                />
            </div>
            <div>
                <div className="new-room-form-location-form-item-title">State</div>
                <StateSelect
                    countryid={countryId}
                    onChange={(e) => {
                        setStateId(e.id)
                    }}
                    placeHolder="Select State"
                />
            </div>
            <div>
                <div className="new-room-form-location-form-item-title">City</div>
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

    /* When the form is submitted, this function is called to handle the sumbit */
    const handleSumbit = async (event) => {

        /* We prevent the page refresh, which is the default action when a
         * form is submitted.
         */
        event.preventDefault()

        /* We complete the room details with the user ID of the landlord and
         * also the topological information of the room (country, state, city)
         */
        const finalRoomDetails = {
            ...roomDetails,
            userId: user.id,
            countryId: countryId,
            stateId: stateId,
            cityId: cityId
        }

        /* We will place all the information of the new room in a Form Data */
        let roomData = new FormData()

        /* We append every room detail to the form data */
        for(const [name, value] of Object.entries(finalRoomDetails))
            roomData.append(name, value)

        /* We also append the thumbnail image to the form data, if one exists */
        if(thumbnailImage.file !== undefined)
            roomData.append("thumbnail_img", thumbnailImage.file)

        /* Just for some server needs. Not useful for the user of the site */
        roomData.append("name", "name")
        roomData.append("price", "100")

        /* We will retrieve right back the room from the server
         * along with a unique id that the server will give to it.
         */
        let newRoom;
        await fetch(`${api}/rooms/addRoom`, {
            method: "POST",
            body: roomData
        })
        .then((res) => res.json())
        .then((data) => {newRoom = data.room})

        /* By using the unique id that was given to the room, which now
         * we know, we will store the additional images to the database.
         */
        let imagesData = new FormData()
        let i, len = roomImages.length;

        /* We append every image to the form data */
        for(i = 0; i < len; i++)
            imagesData.append(roomImages[i].imgName, roomImages[i].imgFile)

        /* We send the images to the backend server */
        await fetch(`${api}/rooms/addImages/${newRoom.id}`, {
            method: "POST",
            body: imagesData
        })
        .then((res) => res.json())
        .then((data) => {console.log(data.message)})

        /* Finally we redirect the user back to the home page,
         * where they can view the new room that was just added.
         */
        navigate("/")
    }

    return (
        <div className="new-room-form">
            <div className="new-room-form-title">
                Let's create your new room
            </div>
            <div className="new-room-form-steps-text">
                Step 1: Set the address of your room in Open Street Map using the search bar
            </div>
            <div className="new-room-form-map">
                {map}
            </div>
            <div className="new-room-form-steps-text">
                Step 2: Select from the dropdown menus the country, state and city where your room is located
            </div>
            <div>
                {locationSelectionForm}
            </div>
            <div className="new-room-form-steps-text">
                Step 3: Fill in the following information about your room
            </div>
            <form
                className="new-room-form-details-form"
                id="newRoomFormId"
                onSubmit={handleSumbit}
            >
                <div className="new-room-form-inputs-array">
                    {domInputBoxes}
                </div>
                <div className="new-room-form-steps-text">
                    Step 4: Choose a thumbnail image for your room.
                    In this image the whole house should be visible from the outside
                </div>
                <img className="new-room-form-thumbnail-image"
                    src={decideThumbnailImageSource()}
                    alt={`Thumbnail of the new room`}
                />
                <label htmlFor="thumbnailImage" className="new-room-form-image-label">
                    Set thumbnail image
                    <input
                        className="new-room-form-image-input"
                        id="thumbnailImage"
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailImageChange}
                    />
                </label>
                <div className="new-room-form-steps-text">
                    Step 5: Upload additional images of your room
                </div>
                <div className="new-room-form-extra-images">
                    {domRoomImages}
                </div>
                <label htmlFor="additionalImages" className="new-room-form-image-label">
                    Upload additional images
                    <input
                        className="new-room-form-image-input"
                        id="additionalImages"
                        type="file"
                        accept="image/*"
                        onChange={handleAdditionalImagesChange}
                    />
                </label>
                <div className="new-room-form-steps-text">
                    Step 6: Click the "Publish my new room!" button to deploy your room
                </div>
                <label
                    htmlFor="newRoomCreationSumbitButton"
                    className="new-room-submit-button-label"
                >
                    <input
                        className="new-room-submit-button"
                        id="newRoomCreationSumbitButton"
                        type="submit"
                        value="Publish my new room!"
                    />
                </label>
            </form>
        </div>
    )
}
