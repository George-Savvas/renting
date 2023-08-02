import React from 'react'
import api from '../Interface.js'
import './Account.css'

/******************************************************************************************
 * The path to the empty user image. It is used if the user has not given their own image *
 ******************************************************************************************/
const emptyImageSource = "./Images/EmptyProfileImage.png"

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

/*************************
 * The Account Component *
 *************************/
export default function Account({appState, setAppState})
{
    /* We retrieve the username of the currently logged user */
    const username = appState.username

    /* We create a state that will contain all the information
     * related to the currently logged user (except for the password)
     */
    const [user, setUser] = React.useState({})

    /* We create a state that will contain the user's image */
    const [image, setImage] = React.useState({
        empty: true,
        file: undefined,
        content: ""
    })

    /* We fetch the information that is related to the given
     * username from the backend from the backend server
     */
    React.useEffect(() => {

        /* This function fetches the user's information */
        async function fetchUser(usr) {

            /* We fetch the data and store it to the
             * component's state.
             */
            setUser(await getUserByUsername(usr))
        }

        /* We call the above function to fetch the user data */
        fetchUser(username)

    }, [username])

    /* A function that changes the image file of the user */
    function handleFileChange(event)
    {
        if(!event.target.files[0])
            return

        const chosenFile = event.target.files[0]
        const fileReader = new FileReader()

        fileReader.onloadend = (e) => {
            const content = fileReader.result
            console.log(content)
            setImage({
                empty: false,
                file: chosenFile,
                content: content
            })
        }

        fileReader.readAsDataURL(chosenFile)
    }

    return (
        <div className="account">
            <div className="account-title">Account ({username})</div>
            <img className="account-profile-image"
                src={(image.empty === true) ? emptyImageSource : image.content}
                alt={`Profile avatar of ${user.username}`}
            />
            <input
                type="file"
                onChange={handleFileChange}
            />
            <div>
                <div>{user.username}</div>
                <div>{user.email}</div>
                <div>{user.name}</div>
                <div>{user.lastname}</div>
                <div>{user.telephone}</div>
            </div>
            <div>
                <div>username</div>
                <div>telephone</div>
                <div>password</div>
                <div>passconf</div>
                <div>first name</div>
                <div>last name</div>
            </div>
        </div>
    )
}
