import './FooterSocialMediaReference.css'

export default function FooterSocialMediaReference({imgSrc, imgAlt, text})
{
    return (
        <div className="footer-media-reference">
            <img className="footer-media-reference-image"
                src={imgSrc}
                alt={imgAlt}
            />
            <p>{text}</p>
        </div>
    )
}
