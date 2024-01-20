import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Main from './ui/components/Main'
import CompanyForm from './ui/components/Company/CompanyForm'
import CompanyTable from './ui/components/Company/CompanyTable'
import RegistrationForm from './ui/components/Authentication/RegistrationForm'
import LoginForm from './ui/components/Authentication/LoginForm'
import UserTable from './ui/components/User/UserTable'
import UserForm from './ui/components/User/UserForm'

const routes = () => (
  <Routes>
    <Route path="/" element={<Main />} />
    <Route path="/login" element={<LoginForm />} />
    <Route path="/register" element={<RegistrationForm />} />
    <Route path="company/*" element={<CompanyRoutes />} />
    <Route path="user/*" element={<UserRoutes />} />
  </Routes>
)

const CompanyRoutes = () => (
  <Routes>
    <Route path="add" element={<CompanyForm />} />
    <Route path="edit/:companyId" element={<CompanyForm />} />
    <Route path="" element={<CompanyTable />} />
  </Routes>
)

const UserRoutes = () => (
  <Routes>
    <Route path="edit/:userId" element={<UserForm />} />
    <Route path="" element={<UserTable />} />
  </Routes>
)

export default routes
