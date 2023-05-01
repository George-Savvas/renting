import './FooterCategory.css'

export default function FooterCategory({title, contents, gap})
{
    return (
        <div className="footer-category">
            <p className="footer-category-title">{title}</p>
            <div style={{gap: gap}} className="footer-category-contents">
                {contents}
            </div>
        </div>
    )
}
