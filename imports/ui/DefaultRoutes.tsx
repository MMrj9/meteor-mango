import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Main from './components/Main'


const DefaultRoutes = () => (
  <Routes>
    <Route path="/" element={<Main />} />
  </Routes>
)

export default DefaultRoutes
