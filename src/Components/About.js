import {useNavigate} from 'react-router-dom'
import './About.css'

const backgroundHouseImageSrc = "./Images/HouseImage1.jpg"
const backgroundHouseImageAlt = "A modern house in the countryside"

export default function About()
{
    /* A hook we will use to redirect the user to
     * the home page when they click the link button.
     */
    const navigate = useNavigate()

    /* A function that leads the user to the home page */
    function handleClick() { navigate("/") }

    return (
        <div className="about">
            <div className="about-text">
                Housing Easy is an online house rental enterprise established in Greece.
                With our range of houses all over the world you can search for a good house
                for your standards anywhere easily and shortly. If you are a landlord, you
                can provide your property to our website so as people from anywhere can
                view it and communicate with you for a deal.
            </div>
            <div className="about-begin-button-parent">
                <div
                    className="about-begin-button"
                    onClick={handleClick}
                >
                    Begin!
                </div>
            </div>
            <img
                className="about-background-image"
                src={backgroundHouseImageSrc}
                alt={backgroundHouseImageAlt}
            />
            <div className="about-popularity-text">
                Over 100.000 people have found a suitable house with Housing Easy!
            </div>
        </div>
    )
}
