import {Link} from 'react-router-dom'
import './PageNotFound.css'

export default function PageNotFound()
{
    return (
        <div className="page-not-found">
            <h1 className="page-not-found-title">Sorry!</h1>
            <p className="page-not-found-context">The page you are requesting was not found</p>
            <Link to="/" className="page-not-found-link">Back to Home</Link>
        </div>
    )
}
