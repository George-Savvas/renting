import './FooterContactReference.css'

export default function FooterContactReference({imgSrc, imgAlt, category, context})
{
    return (
        <div className="footer-contact-reference">
            <img className="footer-contact-reference-image"
                src={imgSrc}
                alt={imgAlt}
            />
            <div className="footer-contact-reference-text">
                <p>{category}:</p>
                <p className="footer-contact-reference-text-context">{context}</p>
            </div>
        </div>
    )
}
