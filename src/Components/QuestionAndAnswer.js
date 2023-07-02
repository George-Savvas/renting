import React from 'react'
import './QuestionAndAnswer.css'

export default function QuestionAndAnswer({questionNumber, questionText, answerText})
{
    const [answerIsHidden, setAnswerIsHidden] = React.useState(true)

    function toggleAnswerStatus()
    {
        setAnswerIsHidden(currentStatus => {
            return !currentStatus
        })
    }

    const domHiddenAnswer = (
        <div></div>
    )

    const domRevealedAnswer = (
        <div className="qna-answer">
            A: {answerText}
        </div>
    )

    const domAnswer = (answerIsHidden) ? domHiddenAnswer : domRevealedAnswer

    return (
        <div className="qna" onClick={toggleAnswerStatus}>
            <div className="qna-question">
                {questionNumber}) {questionText}
            </div>
            {domAnswer}
        </div>
    )
}
