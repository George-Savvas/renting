import QuestionAndAnswer from './QuestionAndAnswer.js'
import './FAQ.css'

const faqContents = [
    {
        id: 0,
        question: "If I'm interested in a specific property, how can I communicate with the landlord of that property?",
        answer: "For every landlord there is an available phone number and an available email listed in their properties' info."
    },
    {
        id: 1,
        question: "Which payment methods are available to make transactions with a landlord?",
        answer: "This is a topic between you and the landlord. You need to communicate with the landlord and come to an agreement on the payment method."
    },
    {
        id: 2,
        question: "How can I become a landlord?",
        answer: "You need to create an account for the application. Make sure to select either the \"Landlord\" or the \"Both\" option under the roles section to create a landlord account. Landlords must be first approved by the site administrator before they can use the site. The administrator's response takes no longer than 5 days."
    }
]

export default function FAQ()
{
    const domFaqContents = faqContents.map(qna => {
        return (
            <QuestionAndAnswer
                key={qna.id}
                questionNumber={qna.id + 1}
                questionText={qna.question}
                answerText={qna.answer}
            />
        )
    })

    return (
        <div className="faq">
            <div className="faq-title">
                Frequently asked Questions
            </div>
            <div className="faq-contents">
                {domFaqContents}
            </div>
        </div>
    )
}
