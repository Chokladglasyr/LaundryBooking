import { useState } from 'react'
import './App.css'
import { Outlet } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'

function App() {
const [loggedIn, setLoggedIn] = useState(false)



  return (
    <>
    {loggedIn && <Home></Home>}
    {!loggedIn && <Login />}
<Outlet></Outlet>


    </>
  )
}

export default App
