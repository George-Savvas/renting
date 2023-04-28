import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css'
import Header from './Components/Header.js'
import Home from './Components/Home.js'
import About from './Components/About.js'
import Signup from './Components/Signup'
import Login from './Components/Login.js'
import PageNotFound from './Components/PageNotFound.js'
import Footer from './Components/Footer.js'

export default function App() {

    return (
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/about' element={<About/>}/>
                <Route path='/signup' element={<Signup/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/*' element={<PageNotFound/>}/>
            </Routes>
            <Footer/>
        </BrowserRouter>
    )
}
