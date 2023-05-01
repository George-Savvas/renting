const initialButtons = [
    {index: 0, name: "Home", active: true, link: "/"},
    {index: 1, name: "About", active: false, link: "/about"},
    {index: 2, name: "Sign up", active: false, link: "/signup"},
    {index: 3, name: "Login", active: false, link: "/login"}
]

const accountButtons = [
    {index: 0, name: "Home", active: true, link: "/"},
    {index: 1, name: "About", active: false, link: "/about"},
    {index: 2, name: "Account", active: false, link: "/account"},
    {index: 3, name: "Logout", active: false, link: "/logout"}
]

module.exports.initialButtons = initialButtons
module.exports.accountButtons = accountButtons
