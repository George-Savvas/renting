import React from 'react'
import './ScorePanel.css'

/********************************************************************
 * We will use an "empty star" image to depict the unselected stars *
 *      and a "filled star" image to depict the selected stars      *
 ********************************************************************/
const emptyStarImage = "https://png.pngtree.com/png-clipart/20190619/original/pngtree-vector-star-icon-png-image_4013529.jpg"
const filledStarImage = "https://png.pngtree.com/png-clipart/20201106/ourmid/pngtree-cartoon-black-bordered-stars-clipart-png-image_2395194.jpg"
const emptyStarAlt = "An empty star"
const filledStarAlt = "A filled star"

/************************************************
 * The score panel consists of five star images *
 ************************************************/
const initialStarsArray = [
    {index: 0, active: false},
    {index: 1, active: false},
    {index: 2, active: false},
    {index: 3, active: false},
    {index: 4, active: false}
]

/*****************************
 * The Score Panel Component *
 *****************************/
export default function ScorePanel({score, setScore})
{
    /* A state the will be storing the status of every star of the panel */
    const [starsArray, setStarsArray] = React.useState(initialStarsArray)

    /* A function that is called whenever the mouse is hovered over a star.
     * We make that star and all the previous stars activated.
     */
    function onMouseEnterAction(event, index)
    {
        let i, stopIndex = index, starsArrayLength = starsArray.length, newStarsArray = []

        for(i = 0; i <= stopIndex; i++)
            newStarsArray.push({index: i, active: true})

        for(i = stopIndex + 1; i < starsArrayLength; i++)
            newStarsArray.push({index: i, active: false})

        setStarsArray(newStarsArray)
    }

    /* A function that is called whenever the mouse leaves a star.
     * We activate as many stars as the 'score' prop is telling us.
     */
    function onMouseLeaveAction(event)
    {
        let i, stopIndex = score, starsArrayLength = starsArray.length, newStarsArray = []

        for(i = 0; i < stopIndex; i++)
            newStarsArray.push({index: i, active: true})

        for(i = stopIndex; i < starsArrayLength; i++)
            newStarsArray.push({index: i, active: false})

        setStarsArray(newStarsArray)
    }

    /* A function that is called whenever a star is clicked.
     * We change the score to the number of all previous stars plus the clicked star.
     */
    function onClickAction(event, index)
    {
        setScore(index + 1)
    }

    /* We create a DOM array of the stars. Each star is an image. Specifically,
     * a star is assigned either the empty star image or the filled star image,
     * depending on the status of the star (whether it is active or not).
     */
    const domStarsArray = starsArray.map((star) => {
        return (
            <img
                key={star.index}
                className="score-panel-star"
                src={(star.active) ? filledStarImage : emptyStarImage}
                alt={(star.active) ? filledStarAlt : emptyStarAlt}
                onMouseEnter={(e) => onMouseEnterAction(e, star.index)}
                onMouseLeave={(e) => onMouseLeaveAction(e)}
                onClick={(e) => onClickAction(e, star.index)}
            />
        )
    })

    return (
        <div className="score-panel">
            {domStarsArray}
        </div>
    )
}
