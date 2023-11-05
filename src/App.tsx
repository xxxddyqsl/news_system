import React from 'react'
import './App.css'
import './assets/css/style.scss'
import { BrowserRouter } from 'react-router-dom'
import MRouters from './routers'
export default function App() {
  return (
    <BrowserRouter>
      <MRouters></MRouters>
    </BrowserRouter>
  )
}
