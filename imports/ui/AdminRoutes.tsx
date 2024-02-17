import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Main from './components/Main'
import CompanyForm from './pages/admin/Company/CompanyForm'
import CompanyTable from './pages/admin/Company/CompanyTable'
import UserTable from './pages/admin/User/UserTable'
import UserForm from './pages/admin/User/UserForm'
import TicketForm from './pages/admin/Ticket/TicketForm'
import TicketTable from './pages/admin/Ticket/TicketTable'
import NotificationTable from './pages/admin/Notification/NotificationTable'

const AdminRoutes = () => (
  <Routes>
    <Route path="/" element={<Main />} />
    <Route path="company/*" element={<CompanyRoutes />} />
    <Route path="user/*" element={<UserRoutes />} />
    <Route path="ticket/*" element={<TicketRoutes />} />
    <Route path="notification/*" element={<NotificationRoutes />} />
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

const TicketRoutes = () => (
  <Routes>
    <Route path="add" element={<TicketForm />} />
    <Route path="edit/:ticketId" element={<TicketForm />} />
    <Route path="" element={<TicketTable />} />
  </Routes>
)

const NotificationRoutes = () => (
  <Routes>
    <Route path="" element={<NotificationTable />} />
  </Routes>
)

export default AdminRoutes
