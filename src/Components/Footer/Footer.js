/***********
 * Imports *
 ***********/
import FooterGeneralReference from './FooterGeneralReference.js'
import FooterContactReference from './FooterContactReference.js'
import FooterSocialMediaReference from './FooterSocialMediaReference.js'
import FooterCategory from './FooterCategory.js'
import './Footer.css'

/****************************************
 * General References (About, FAQ, ...) *
 ****************************************/
const generalReferences = [
    {index: 0, link: "/about", txt: "About"},
    {index: 1, link: "/faq", txt: "Frequently asked questions"},
    {index: 2, link: "/staff", txt: "Our staff"},
    {index: 3, link: "/history", txt: "Our history"}
]

/*************************************************
 * Contact References (Phone Number, Email, ...) *
 *************************************************/
const phoneIconSrc = "./Images/PhoneIcon.png"
const phoneIconAlt = "Phone Symbol"
const emailIconSrc = "./Images/EmailIcon.webp"
const emailIconAlt = "Letter Symbol"
const skypeIconSrc = "./Images/SkypeIcon.png"
const skypeIconAlt = "A big S Symbol"

const contactReferences = [
    {index: 0, src: phoneIconSrc, alt: phoneIconAlt, category: "Phone Number",  context: "(212) 555-1234"},
    {index: 1, src: emailIconSrc, alt: emailIconAlt, category: "Email Address", context: "admin@housingeasy.com"},
    {index: 2, src: skypeIconSrc, alt: skypeIconAlt, category: "Skype", context: "adminhousingeasy"}
]

/****************************************************
 * Social Media References (Facebook, Twitter, ...) *
 ****************************************************/
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
    {index: 0, src: facebookImageSrc, alt: facebookImageAlt, txt: "Facebook"},
    {index: 1, src: twitterImageSrc, alt: twitterImageAlt, txt: "Twitter"},
    {index: 2, src: instagramImageSrc, alt: instagramImageAlt, txt: "Instagram"},
    {index: 3, src: youtubeImageSrc, alt: youtubeImageAlt, txt: "YouTube"},
    {index: 4, src: discordImageSrc, alt: discordImageAlt, txt: "Discord"}
]

/************************
 * The Footer Component *
 ************************/
export default function Footer()
{
    /* First we convert all the arrays with references into renderable objects */
    const domGeneralReferences = generalReferences.map(reference => {
        return (
            <FooterGeneralReference
                key={reference.index}
                link={reference.link}
                text={reference.txt}
            />
        )
    })

    const domContactReferences = contactReferences.map(reference => {
        return (
            <FooterContactReference
                key={reference.index}
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
                key={reference.index}
                imgSrc={reference.src}
                imgAlt={reference.alt}
                text={reference.txt}
            />
        )
    })

    /* We create an array with all the renderable arrays we have created.
     * We specify a title for each array and how much vertical gap will
     * exist between the items of a single array.
     */
    const footerCategories = [
        {index: 0, title: "General", contents: domGeneralReferences, gap: "40px"},
        {index: 1, title: "Contact", contents: domContactReferences, gap: "10px"},
        {index: 2, title: "Social Media", contents: domMediaReferences, gap: "10px"}
    ]

    /* We convert the array we just created into a renderable array */
    const domCategories = footerCategories.map(category => {
        return (
            <FooterCategory
                key={category.index}
                title={category.title}
                contents={category.contents}
                gap={category.gap}
            />
        )
    })

    /* We will render our brand's title at the top of the footer and
     * then we will render the final DOM array we created above.
     */
    return (
        <div className="footer">
            <center className="footer-title">Housing Easy</center>
            <div className="footer-contents">
                {domCategories}
            </div>
        </div>
    )
}
