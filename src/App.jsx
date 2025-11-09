import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from "../pages/Home"
import {Profile} from "../pages/Profile"
import { PostDetails } from '../pages/PostDetails'
import {UserContext} from "../context/contextOfPosts"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  

  const [idOfPost , setIdOfPost] = useState()
  const [arrayOfPosts, setArrayOfPosts] = useState([])
  

  return (
    <>
    <UserContext.Provider value = {{idOfPost,setIdOfPost,arrayOfPosts,setArrayOfPosts}}>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/post/:id" element={<PostDetails />} />
          <Route path="/profile" element={<Profile />} />
      </Routes>
      </UserContext.Provider>
      
    </>
  )
}

export default App
