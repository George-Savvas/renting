import {Link} from 'react-router-dom'
import './FooterGeneralReference.css'

export default function FooterGeneralReference({link, text})
{
    return (
        <Link to={link} className="footer-general-reference-link">{text}</Link>
    )
}
