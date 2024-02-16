import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Main from './components/Main'
import LoginForm from './components/Authentication/LoginForm'
import RegistrationForm from './components/Authentication/RegistrationForm'

const DefaultRoutes = () => (
  <Routes>
    <Route path="/" element={<Main />} />
  </Routes>
)

export default DefaultRoutes
