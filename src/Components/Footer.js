import FooterGeneralReference from './FooterGeneralReference.js'
import FooterContactReference from './FooterContactReference.js'
import FooterSocialMediaReference from './FooterSocialMediaReference.js'
import FooterCategory from './FooterCategory.js'
import './Footer.css'

const generalReferences = [
    {link: "/about", txt: "About"},
    {link: "/faq", txt: "Frequently asked questions"},
    {link: "/staff", txt: "Our staff"},
    {link: "/history", txt: "Our history"}
]

const phoneIconSrc = "./Images/PhoneIcon.png"
const phoneIconAlt = "Phone Symbol"
const emailIconSrc = "./Images/EmailIcon.webp"
const emailIconAlt = "Letter Symbol"
const skypeIconSrc = "./Images/SkypeIcon.png"
const skypeIconAlt = "A big S Symbol"

const contactReferences = [
    {src: phoneIconSrc, alt: phoneIconAlt, category: "Phone Number",  context: "(212) 555-1234"},
    {src: emailIconSrc, alt: emailIconAlt, category: "Email Address", context: "admin@housingeasy.com"},
    {src: skypeIconSrc, alt: skypeIconAlt, category: "Skype", context: "adminhousingeasy"}
]

const facebookImageSrc = "./Images/FacebookIcon.png"
const facebookImageAlt = "Facebook Mini Logo"
const twitterImageSrc = "./Images/TwitterIcon.svg"
const twitterImageAlt = "Twitter Mini Logo"
const instagramImageSrc = "./Images/InstagramIcon.png"
const instagramImageAlt = "Instagram Mini Logo"
const youtubeImageSrc = "./Images/YouTubeIcon.png"
const youtubeImageAlt = "YouTube Mini Logo"
const discordImageSrc = "./Images/DiscordIcon.png"
const discordImageAlt = "Discord Mini Logo"

const socialMediaReferences = [
    {src: facebookImageSrc, alt: facebookImageAlt, txt: "Facebook"},
    {src: twitterImageSrc, alt: twitterImageAlt, txt: "Twitter"},
    {src: instagramImageSrc, alt: instagramImageAlt, txt: "Instagram"},
    {src: youtubeImageSrc, alt: youtubeImageAlt, txt: "YouTube"},
    {src: discordImageSrc, alt: discordImageAlt, txt: "Discord"}
]

export default function Footer()
{
    const domGeneralReferences = generalReferences.map(reference => {
        return (
            <FooterGeneralReference
                link={reference.link}
                text={reference.txt}
            />
        )
    })

    const domContactReferences = contactReferences.map(reference => {
        return (
            <FooterContactReference
                imgSrc={reference.src}
                imgAlt={reference.alt}
                category={reference.category}
                context={reference.context}
            />
        )
    })

    const domMediaReferences = socialMediaReferences.map(reference => {
        return (
            <FooterSocialMediaReference
                imgSrc={reference.src}
                imgAlt={reference.alt}
                text={reference.txt}
            />
        )
    })

    const footerCategories = [
        {title: "General", contents: domGeneralReferences, gap: "40px"},
        {title: "Contact", contents: domContactReferences, gap: "10px"},
        {title: "Social Media", contents: domMediaReferences, gap: "10px"}
    ]

    const domCategories = footerCategories.map(category => {
        return (
            <FooterCategory
                title={category.title}
                contents={category.contents}
                gap={category.gap}
            />
        )
    })

    return (
        <div className="footer">
            <center className="footer-title">Housing Easy</center>
            <div className="footer-contents">
                {domCategories}
            </div>
        </div>
    )
}
