import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// import {BrowserRouter,Routes,Route} 
import Card from './components/Card'
import Button from './components/Button'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MuiCard from './components/MUICard'
import View from './pages/View'
import Add from './pages/Add'
import { ToastContainer, toast } from 'react-toastify';
import Edit from './pages/Edit'
import NotFound from './pages/NotFound' // Import 404 page

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<View/>}/>
        <Route path="/add" element={<Add/>}/>
        <Route path="/edit/:id" element={<Edit/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
      </BrowserRouter>

    </div>
  )
}

export default App
