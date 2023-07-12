import QuestionAndAnswer from './QuestionAndAnswer.js'
import './FAQ.css'
import faqContents from './FAQContents.js'

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
