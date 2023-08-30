import React from 'react'
import api from '../Interface.js'
import EditProfileInputBox from './EditProfileInputBox.js'
import PageNotFound from './PageNotFound.js'
import './Account.css'

/******************************************************************************************
 * The path to the empty user image. It is used if the user has not given their own image *
 ******************************************************************************************/
const emptyImageSource = "./Images/EmptyProfileImage.png"

/*******************************************************************************
 * Possible error messages under the input boxes in the "Edit Profile" section *
 *******************************************************************************/
const noError = "No Error"
const emptyField = "Must not be empty"
const invalidUsernameSize = "Must have at least 4 and at most 30 characters"
const duplicateUsername = "This username already exists"
const invalidPasswordSize = "Must have at least 3 and at most 15 characters"
const noMatchBetweenPasswordAndPassconf = "Must be identical to the password"
const tooLargeTelephone = "Max 10 digits"
const nonArithmeticTelephone = "Must contain only arithmetic characters"

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

/**********************************************************
 *  Returns 'true' if the target username already exists  *
 *   If it does not exist, this function returns 'false'  *
 * If the target username matches "self", returns 'false' *
 **********************************************************/
async function usernameExists(targetUsername, self)
{
    /* Special Case: The target username is the user themselves */
    if(targetUsername === self)
        return false

    /* The body we will send to the server with our request */
    const requestBody = {username: targetUsername}

    /* We ask the backend server if the username exists */
    const response = await fetch(`${api}/auth/usernameExists`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
    })

    /* We convert the server's response to JSON format */
    const responseAsJson = await response.json()

    /* We return the final result */
    return (responseAsJson.Exist === "true")
}

/**********************************************************************
 *      Returns 'true' if the input string contains only digits       *
 * Returns 'false' if the string has at least one non-digit character *
 *                Returns 'false' for the empty string                *
 **********************************************************************/
function hasOnlyDigits(inputString)
{
    /* We consider that the empty string is not an arithmetic string. */
    if(inputString === "")
        return false

    /* Initially we consider the number has only digits */
    let allDigits = true
    let i, size = inputString.length

    /* We will examine each character of the string. If at
        * least one character is not a digit, we return 'false'.
        */
    for(i = 0; i < size; i++)
    {
        if(inputString[i] < '0' || inputString[i] > '9')
        {
            allDigits = false
            break
        }
    }

    /* We return the final result */
    return allDigits
}

/*************************************************************************************************
 *  Given a user, this function finds out whether that user is a landlord, a tenant or both and  *
 * if they are a landlord, the function also retrieves if the user is a verified landlord or not *
 *************************************************************************************************/
function decideStatus(user)
{
    /* Special Case: The user is Administrator */
    if(user.isAdmin)
        return "Administrator"

    /* Case the user is both a Tenant and a Landlord */
    if(user.isLandlord && user.isTenant)
    {
        /* Case the landlord is verified */
        if(user.active)
            return "Tenant & Verified Landlord"

        /* Case the landlord is not verified */
        return "Tenant & Landlord (Unverified)"
    }

    /* Case the user is just Landlord */
    if(user.isLandlord)
    {
        /* Case the landlord is verified */
        if(user.active)
            return "Verified Landlord"

        /* Case the landlord is not verified */
        return "Landlord (Unverified)"
    }

    /* Case the user is just Tenant */
    return "Tenant"
}

/********************************************************************************************
 * Given a user, this function returns an informative message that tells the landlord users *
 *             whether they have been accepted by the administration or not yet             *
 ********************************************************************************************/
function decideLandlordMessage(user)
{
    /* Case the user is not landlord. In this case there is nothing to say */
    if(!user.isLandlord)
        return ""

    /* Case the user is a verified landlord */
    if(user.active)
        return "Your request to be a landlord has been accepted by the administration."

    /* Case the user is not a verified landlord */
    return "Your request to be a landlord is still under processing."
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

    /* We fetch the information that is related to the given
     * username from the backend server
     */
    React.useEffect(() => {

        /* This function fetches the user's information */
        async function fetchUser(usr) {

            /* If the user is not logged-in, we do nothing */
            if(usr === "")
                return

            /* Else we fetch the data and store it to the user state */
            setUser(await getUserByUsername(usr))
        }

        /* If the user has already been fetched, we do not repeat the process
         * This is useful if this effect will be executed multiple times. We
         * only need to fetch the user once - the first time this effect runs.
         */
        if(JSON.stringify(user) !== JSON.stringify({}))
            return

        /* We call the above function to fetch the user data */
        fetchUser(username)

    }, [username, user])

    /* We create a state that will contain the user's image */
    const [image, setImage] = React.useState({
        empty: true,
        file: undefined,
        content: ""
    })

    /* This state contains all the data of the edit profile form, apart from the
     * password confirmation, which is stored in a seperate state because
     * on successful changes we send all the information in 'formData' to the
     * server, but we do not want to send the password confirmation there.
     * With that information the server will update the details of the user.
     */
    const [formData, setFormData] = React.useState({
        username: "",
        password: "",
        name: "",
        lastname: "",
        telephone: ""
    })

    /* The password confirmation's seperate state */
    const [passconf, setPassconf] = React.useState("")

    /* A state with the error message of each input box of the "Edit Profile"
     * section. All the errors need to be fixed for a successful profile update.
     */
    const [errorMessages, setErrorMessages] = React.useState([
        emptyField, emptyField, emptyField, noError, emptyField, emptyField
    ])

    /* A state which will store the server's response when the user updates
     * their profile in the "Edit Profile" section of the Account page.
     * The server's response will be rendered on the screen after the changes.
     */
    const [messageAfterChanges, setMessageAfterChanges] = React.useState("")

    /* Updates the error message under the input box where
     * the event took place if the message needs to change
     */
    async function updateErrorMessagesState(event)
    {
        /* We take different actions depending on which input box the event took place */
        switch(event.target.name)
        {
            /* Case the event took place in the username's input box */
            case "username":
            {
                /* We retrieve the current error message of the
                 * username box
                 */
                const currentMessage = errorMessages[0]
                let newMessage = currentMessage

                /* Case the new username is the empty string */
                if(event.target.value.length === 0)
                    newMessage = emptyField

                /* Case the username is too large or too small */
                else if((event.target.value.length < 4) || (event.target.value.length > 30))
                    newMessage = invalidUsernameSize

                /* Case the new username already exists */
                else if(await usernameExists(event.target.value, user.username))
                    newMessage = duplicateUsername

                /* Case the new username is a valid username */
                else
                    newMessage = noError

                /* We update the message under the username if it
                 * is different from the already existing message
                 */
                if(newMessage !== currentMessage)
                {
                    setErrorMessages(currentErrorMessages => {
                        return currentErrorMessages.map((message, i) => {
                            return (i !== 0) ? message : newMessage
                        })
                    })
                }

                /* There is nothing else to do in this case */
                break;
            }

            /* Case the event took place in the telephone's input box */
            case "telephone":
            {
                /* We retrieve the current message under the telephone's input box.
                * We also declare a variable for the new message.
                */
                const currentMessage = errorMessages[6]
                let newMessage = currentMessage;

                /* Case the new telephone is larger but now it is too large */
                if(event.target.value.length >= 11)
                    newMessage = tooLargeTelephone

                /* Case the old telephone was too large but now it is not */
                if(((event.target.value.length > 0)) && (event.target.value.length < 11))
                    newMessage = noError

                /* Case the new telephone is not an arithmetic */
                if(!hasOnlyDigits(event.target.value))
                    newMessage = nonArithmeticTelephone

                /* Case the new telephone is the empty string */
                if(event.target.value.length === 0)
                    newMessage = emptyField

                /* We update the message under the telephone if it
                * is different from the already existing message
                */
                if(newMessage !== currentMessage)
                {
                    setErrorMessages(currentErrorMessages => {
                        return currentErrorMessages.map((message, i) => {
                            return (i !== 1) ? message : newMessage
                        })
                    })
                }

                /* There is nothing else to do in this case */
                break
            }

            /* Case the event took place in the passwords's input box */
            case "password":
            {
                /* We retrieve the current message under the passwords's input box.
                 * We also declare a variable for the new message.
                 */
                const currentMessage = errorMessages[2]
                let newMessage = currentMessage;

                /* Case the new password does not have a correct size */
                if((event.target.value.length < 3) || (event.target.value.length > 15))
                    newMessage = invalidPasswordSize

                /* Case the new password has a correct size */
                else
                    newMessage = noError

                /* Case the new password is the empty string */
                if(event.target.value.length === 0)
                    newMessage = emptyField

                /* We update the message under the password if it
                 * is different from the already existing message
                 */
                if(newMessage !== currentMessage)
                {
                    setErrorMessages(currentErrorMessages => {
                        return currentErrorMessages.map((message, i) => {
                            return (i !== 2) ? message : newMessage
                        })
                    })
                }

                /* We retrieve the current error message of the password
                 * confirmation box
                 */
                const currentMessageForConf = errorMessages[3]
                let newMessageForConf = currentMessageForConf

                /* Case the new password is not equal to the confirmation */
                if(event.target.value !== passconf)
                    newMessageForConf = noMatchBetweenPasswordAndPassconf

                /* Case the new password is equal to the confirmation */
                else
                    newMessageForConf = noError

                /* We update the message under the passconf if it
                 * is different from the already existing message
                 */
                if(newMessageForConf !== currentMessageForConf)
                {
                    setErrorMessages(currentErrorMessages => {
                        return currentErrorMessages.map((message, i) => {
                            return (i !== 3) ? message : newMessageForConf
                        })
                    })
                }

                /* There is nothing else to do in this case */
                break
            }

            /* Case the event took place in the passconf's input box */
            case "passconf":
            {
                /* We retrieve the current error message of the password
                 * confirmation box
                 */
                const currentMessage = errorMessages[3]
                let newMessage = currentMessage

                /* Case the new passconf is not equal to the password */
                if(event.target.value !== formData.password)
                    newMessage = noMatchBetweenPasswordAndPassconf

                /* Case the new passconf is equal to the password */
                else
                    newMessage = noError

                /* We update the message under the passconf if it
                 * is different from the already existing message
                 */
                if(newMessage !== currentMessage)
                {
                    setErrorMessages(currentErrorMessages => {
                        return currentErrorMessages.map((message, i) => {
                            return (i !== 3) ? message : newMessage
                        })
                    })
                }

                /* There is nothing else to do in this case */
                break
            }

            /* Case the event took place in the first name's input box */
            case "name":
            {
                /* We retrieve the current error message of the first
                 * name box
                 */
                const currentMessage = errorMessages[4]
                let newMessage = currentMessage

                /* Case the new first name is the empty string */
                if(event.target.value.length === 0)
                    newMessage = emptyField

                /* Case the new first name is not the empty string */
                else
                    newMessage = noError

                /* We update the message under the first name if it
                 * is different from the already existing message
                 */
                if(newMessage !== currentMessage)
                {
                    setErrorMessages(currentErrorMessages => {
                        return currentErrorMessages.map((message, i) => {
                            return (i !== 4) ? message : newMessage
                        })
                    })
                }

                /* There is nothing else to do in this case */
                break;
            }

            /* Case the event took place in the last name's input box */
            case "lastname":
            {
                /* We retrieve the current error message of the last
                 * name box
                 */
                const currentMessage = errorMessages[5]
                let newMessage = currentMessage

                /* Case the new last name is the empty string */
                if(event.target.value.length === 0)
                    newMessage = emptyField

                /* Case the new last name is not the empty string */
                else
                    newMessage = noError

                /* We update the message under the last name if it
                 * is different from the already existing message
                 */
                if(newMessage !== currentMessage)
                {
                    setErrorMessages(currentErrorMessages => {
                        return currentErrorMessages.map((message, i) => {
                            return (i !== 5) ? message : newMessage
                        })
                    })
                }

                /* There is nothing else to do in this case */
                break;
            }

            /* Default case (we do nothing in this case) */
            default:
            {
                break
            }
        }
    }

    /* Updates the state of the form data whenever the user changes the
     * input of any button (except the password confirmation button).
     */
    function updateFormData(event)
    {
        /* We examine if the new input has any errors */
        updateErrorMessagesState(event)

        /* We update the state of the form */
        setFormData(currentFormData => {
            return {...currentFormData, [event.target.name]: event.target.value}
        })

        /* We make the final output message disappear if the user types in any
         * box after a profile change has already been submitted.
         */
        if(messageAfterChanges !== "")
            setMessageAfterChanges("")
    }

    /* Updates the state of the password confirmation whenever the
     * user changes the input of the password confirmation button.
     */
    function updatePassConf(event)
    {
        /* We examine if the new input has any errors */
        updateErrorMessagesState(event)

        /* We update the state of the password confirmation */
        setPassconf(event.target.value)

        /* We make the final output message disappear if the user types in any
         * box after a profile change has already been submitted.
         */
        if(messageAfterChanges !== "")
            setMessageAfterChanges("")
    }

    /* A callback function that updates the form data. It can be used
     * as "onChange" action whenever a user types input in an input box
     * (the password confirmation box is excluded).
     */
    const updateformDataCallback = (event) => {updateFormData(event)}

    /* A callback function that updates the password confirmation state.
     * It can be used as "onChange" action whenever a user types input in
     * the password confirmation box.
     */
    const updatePassConfCallback = (event) => {updatePassConf(event)}

    /* We store all the information of each input box of the "Edit Profile"
     * section in an array
     */
    let editProfileInputBoxes = [
        {
            index: 0,
            id: "username",
            name: "username",
            type: "text",
            placeholder: "Username",
            value: formData.username,
            onChangeAction: updateformDataCallback,
            errorMessage: errorMessages[0]
        },
        {
            index: 1,
            id: "telephone",
            name: "telephone",
            type: "text",
            placeholder: "Telephone",
            value: formData.telephone,
            onChangeAction: updateformDataCallback,
            errorMessage: errorMessages[1]
        },
        {
            index: 2,
            id: "password",
            name: "password",
            type: "password",
            placeholder: "Password",
            value: formData.password,
            onChangeAction: updateformDataCallback,
            errorMessage: errorMessages[2]
        },
        {
            index: 3,
            id: "passconf",
            name: "passconf",
            type: "password",
            placeholder: "Password Confirmation",
            value: passconf,
            onChangeAction: updatePassConfCallback,
            errorMessage: errorMessages[3]
        },
        {
            index: 4,
            id: "name",
            name: "name",
            type: "text",
            placeholder: "First Name",
            value: formData.name,
            onChangeAction: updateformDataCallback,
            errorMessage: errorMessages[4]
        },
        {
            index: 5,
            id: "lastname",
            name: "lastname",
            type: "text",
            placeholder: "Last Name",
            value: formData.lastname,
            onChangeAction: updateformDataCallback,
            errorMessage: errorMessages[5]
        }
    ]

    /* We create a renderable array of the "Edit Profile" input boxes */
    const domEditProfileInputBoxes = editProfileInputBoxes.map(inputBox => {
        return (
            <EditProfileInputBox
                key={inputBox.index}
                id={inputBox.id}
                name={inputBox.name}
                type={inputBox.type}
                placeholder={inputBox.placeholder}
                value={inputBox.value}
                onChangeAction={inputBox.onChangeAction}
                errorMessage={inputBox.errorMessage}
            />
        )
    })

    /* Examines if there are any errors in the submitted form */
    function errorExists()
    {
        /* Initially we consider there are no errors */
        let error = false
        let i, size = editProfileInputBoxes.length

        /* We examine each input box for errors */
        for(i = 0; i < size; i++)
        {
            /* If the current input box has an error,
             * the signup form cannot be submitted.
             */
            if(editProfileInputBoxes[i].errorMessage !== noError)
            {
                error = true
                break
            }
        }

        /* We return the final value of the error */
        return error
    }

    /* Actions we will take when the "Save Changes" button is clicked by the user */
    const handleSubmit = (event) => {

        /* We prevent the page refresh, which is the default action on form submit */
        event.preventDefault()

        /* If the form has errors, it cannot be submitted. Therefore we return */
        if(errorExists())
        {
            console.log("This form has errors. It cannot be submitted until the errors are fixed")
            return
        }

        /* Else if the form is valid, we have the server update the profile of the user */
        fetch(`${api}/auth/update/${user.id}`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        })
        .then((res) => res.json())
        .then((data) => {setMessageAfterChanges(data.message)})
        .catch((err) => console.error(err))

        /* We update the state with the user's information */
        setUser(currentUser => {
            return {
                ...currentUser,
                username: formData.username,
                name: formData.name,
                lastname: formData.lastname,
                telephone: formData.telephone
            }
        })

        /* We update the general state of the site if the user changed the username */
        if(appState.username !== formData.username)
        {
            setAppState(currentAppState => {
                return {
                    ...currentAppState,
                    username: formData.username
                }
            })
        }

        /* We reset the form data to clear the values inside the input boxes */
        setFormData({
            username: "",
            password: "",
            name: "",
            lastname: "",
            telephone: ""
        })

        /* We also reset password confirmation box */
        setPassconf("")

        /* We also reset the error messages to the initial error messages */
        setErrorMessages([
            emptyField, emptyField, emptyField, noError, emptyField, emptyField
        ])
    }

    /* A function that changes the image file of the user */
    function handleFileChange(event)
    {
        if(!event.target.files[0])
            return

        const chosenFile = event.target.files[0]
        const fileReader = new FileReader()

        fileReader.onloadend = (e) => {
            const content = fileReader.result
            setImage({
                empty: false,
                file: chosenFile,
                content: content
            })
        }

        fileReader.readAsDataURL(chosenFile)

        /* Now we will send the new image to the backend server */
        const imageToSend = new FormData()
        imageToSend.append("newImage", chosenFile)

        fetch(`${api}/auth/updateUserImage/${user.id}`, {
            method: "PUT",
            headers: { "Content-Type": "multipart/form-data" },
            body: imageToSend
        })
    }

    /* The details of the user's account */
    const accountDetails = [
        {index: 0, fieldName: "Username", fieldValue: user.username},
        {index: 1, fieldName: "Email", fieldValue: user.email},
        {index: 2, fieldName: "First Name", fieldValue: user.name},
        {index: 3, fieldName: "Last Name", fieldValue: user.lastname},
        {index: 4, fieldName: "Telephone", fieldValue: user.telephone},
        {index: 5, fieldName: "Status", fieldValue: decideStatus(user)}
    ]

    /* A DOM version of the above array with the details of the user's account */
    const domAccountDetails = accountDetails.map(detail => {
        return (
            <div key={detail.index} className="account-detail">
                <div className="account-detail-title">{detail.fieldName}:</div>
                <div className="account-detail-value">{detail.fieldValue}</div>
            </div>
        )
    })

    /* If the user is not logged-in, they cannot have an account page */
    if(username === "")
        return <PageNotFound/>

    /* Else we return the details of the user's account page */
    return (
        <div className="account">
            <div className="account-title">Account ({username})</div>
            <div className="account-panel">
                <img className="account-profile-image"
                    src={(image.empty === true) ? emptyImageSource : image.content}
                    alt={`Profile avatar of ${user.username}`}
                />
                <label htmlFor="profileImage" className="account-image-label">
                    Change Image
                    <input
                        className="account-image-input"
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </label>
                <div className="account-details-title">Account Details</div>
                <div className="account-details">
                    {domAccountDetails}
                </div>
                <div
                    className="account-message-for-landlords"
                    style={{color: (user.isLandlord) ? (user.active) ? "green" : "goldenrod" : "goldenrod"}}
                >
                    {decideLandlordMessage(user)}
                </div>
                <div className="account-edit-title">Edit Profile</div>
                <form className="account-edit-form" onSubmit={handleSubmit}>
                    {domEditProfileInputBoxes}
                    <label
                        htmlFor="accountEditSubmitButton"
                        className={(errorExists() ?
                            "account-edit-submit-button-label-disabled" :
                            "account-edit-submit-button-label"
                        )}
                    >
                        <input
                            className={(errorExists() ?
                                "account-edit-submit-button-disabled" :
                                "account-edit-submit-button"
                            )}
                            id="accountEditSubmitButton"
                            type="submit"
                            value="Save Changes"
                        />
                    </label>
                    <div className="account-message-after-changes">
                        {messageAfterChanges}
                    </div>
                </form>
            </div>
        </div>
    )
}
