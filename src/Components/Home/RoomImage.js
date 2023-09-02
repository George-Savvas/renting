import React from 'react'
import './RoomImage.css'

/**********************************************************************************************
 * The source of the auxiliary image that is shown to indicate to the user to delete an image *
 **********************************************************************************************/
const deletionIndicatorImageSource = "./Images/Red_X_Symbol.png"

/****************************
 * The Room Image Component *
 ****************************/
export default function RoomImage({roomImageSource, onClickAction})
{
    return (
        <div className="room-image" onClick={onClickAction}>
            <img
                className="room-image-source"
                src={roomImageSource}
                alt={"A look of the room"}
            />
            <img
                className="room-image-delete"
                src={deletionIndicatorImageSource}
                alt={"A deletion indicator that implies deletion"}
            />
        </div>
    )
}
