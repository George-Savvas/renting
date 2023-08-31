import React from 'react'
import {MapContainer, TileLayer, useMap} from 'react-leaflet'
import {Icon} from 'leaflet'
import {GeoSearchControl, OpenStreetMapProvider} from 'leaflet-geosearch'
import api from '../../Interface.js'
import PageNotFound from '../PageNotFound.js'
import 'leaflet/dist/leaflet.css'
import 'leaflet-geosearch/dist/geosearch.css'
import './NewRoomForm.css'

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
    console.log(`${result.location.x} ${result.location.y}`)
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

    /* If the user is not a verified landlord, we return "Page Not Found" */
    if(isActiveLandlord === false)
        return <PageNotFound/>

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
        </div>
    )
}
