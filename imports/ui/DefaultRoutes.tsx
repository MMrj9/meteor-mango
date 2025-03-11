import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Main from './components/Main'
import ProfileForm from './pages/default/Profile/ProfileForm'
import LoginForm from './components/Authentication/LoginForm'
import RegistrationForm from './components/Authentication/RegistrationForm'
import { Meteor } from 'meteor/meteor'

const DefaultRoutes = () => {
  const user = Meteor.user()
  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" /> : <LoginForm />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/admin" /> : <RegistrationForm />}
      />
      <Route path="/" element={<Main />} />
      <Route path="/me" element={<ProfileForm />} />
    </Routes>
  )
}

export default DefaultRoutes
