import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Main from './components/Main'
import ProfileForm from './pages/default/Profile/ProfileForm'

const DefaultRoutes = () => (
  <Routes>
    <Route path="/" element={<Main />} />
    <Route path="/me" element={<ProfileForm />} />
  </Routes>
)

export default DefaultRoutes
