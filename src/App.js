/***********
 * Imports *
 ***********/
import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Header from './Components/Header/Header.js'
import Home from './Components/Home/Home.js'
import About from './Components/About.js'
import Signup from './Components/Signup'
import Login from './Components/Login.js'
import Footer from './Components/Footer/Footer.js'
import FAQ from './Components/FAQ.js'
import Staff from './Components/Staff.js'
import History from './Components/History.js'
import Account from './Components/Account.js'
import DetailedUserEntry from './Components/Home/DetailedUserEntry.js'
import NewRoomForm from './Components/Home/NewRoomForm.js'
import DetailedRoomInformation from './Components/Home/DetailedRoomInformation.js'
import Logout from './Components/Logout.js'
import PageNotFound from './Components/PageNotFound.js'
import {initialButtons} from './Components/Header/NavbarButtonsInfo.js'
import './App.css'

/*********************
 * The App Component *
 *********************/
export default function App()
{
    const [appState, setAppState] = React.useState({
        userIsLogged: false,
        username: "",
        navbarButtons: initialButtons
    })

    //const domState = []
    //const propertiesNum = Object.keys(appState).length
    //let i
    //for(i = 0; i < propertiesNum; i++)
    //    domState.push(<p key={i}>{Object.keys(appState)[i].toString()}({Object.values(appState)[i].toString()})</p>)

    //<div>{domState}</div>
    //console.log(appState)

    return (
        <BrowserRouter>
            <Header appState={appState} setAppState={setAppState}/>
            <Routes>
                <Route path='/' element={<Home appState={appState} setAppState={setAppState}/>}/>
                <Route path='/about' element={<About/>}/>
                <Route path='/signup' element={<Signup/>}/>
                <Route path='/login' element={<Login appState={appState} setAppState={setAppState}/>}/>
                <Route path='/faq' element={<FAQ/>}/>
                <Route path='/staff' element={<Staff/>}/>
                <Route path='/history' element={<History/>}/>
                <Route path='/account' element={<Account appState={appState} setAppState={setAppState}/>}/>
                <Route path='/users/:username' element={<DetailedUserEntry appState={appState} setAppState={setAppState}/>}/>
                <Route path='/newroom' element={<NewRoomForm appState={appState} setAppState={setAppState}/>}/>
                <Route path='/roominfo/:roomId/:inDate/:outDate' element={<DetailedRoomInformation appState={appState} setAppState={setAppState}/>}/>
                <Route path='/logout' element={<Logout appState={appState} setAppState={setAppState}/>}/>
                <Route path='/*' element={<PageNotFound/>}/>
            </Routes>
            <Footer/>
        </BrowserRouter>
    )
}
