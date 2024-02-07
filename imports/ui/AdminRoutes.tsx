import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Main from './components/Main'
import CompanyForm from './components/Company/CompanyForm'
import CompanyTable from './components/Company/CompanyTable'
import RegistrationForm from './components/Authentication/RegistrationForm'
import LoginForm from './components/Authentication/LoginForm'
import UserTable from './components/User/UserTable'
import UserForm from './components/User/UserForm'
import TicketForm from './components/Ticket/TicketForm'
import TicketTable from './components/Ticket/TicketTable'
import AdminLayout from './AdminLayout'

const adminRoutes = () => (
  <Routes>
    <Route path="/" element={<AdminLayout />}>
      <Route index element={<Main />} />
      <Route path="login" element={<LoginForm />} />
      <Route path="register" element={<RegistrationForm />} />
      <Route path="company" element={<CompanyRoutes />} />
      <Route path="user" element={<UserRoutes />} />
      <Route path="ticket" element={<TicketRoutes />} />
    </Route>
  </Routes>
)

const CompanyRoutes = () => (
  <>
    <Route path="add" element={<CompanyForm />} />
    <Route path="edit/:companyId" element={<CompanyForm />} />
    <Route index element={<CompanyTable />} />
  </>
)

const UserRoutes = () => (
  <>
    <Route path="edit/:userId" element={<UserForm />} />
    <Route index element={<UserTable />} />
  </>
)

const TicketRoutes = () => (
  <>
    <Route path="add" element={<TicketForm />} />
    <Route path="edit/:ticketId" element={<TicketForm />} />
    <Route index element={<TicketTable />} />
  </>
)

export default adminRoutes
