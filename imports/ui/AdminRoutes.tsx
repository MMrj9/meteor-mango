import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Main from './components/Main'
import CompanyTable from './pages/admin/Company/CompanyTable'
import UserTable from './pages/admin/User/UserTable'
import TicketTable from './pages/admin/Ticket/TicketTable'
import NotificationTable from './pages/admin/Notification/NotificationTable'
import Form from './pages/admin/Form/Form'
import UserForm from './pages/admin/Form/custom/UserForm'

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
    <Route path="add" element={<Form collectionName="Company" />} />
    <Route path="edit/:objectId" element={<Form collectionName="Company" />} />
    <Route path="" element={<CompanyTable collectionName='Company'/>} />
  </Routes>
)

const UserRoutes = () => (
  <Routes>
    <Route path="edit/:objectId" element={<UserForm collectionName="User" />} />
    <Route path="" element={<UserTable />} />
  </Routes>
)

const TicketRoutes = () => (
  <Routes>
    <Route path="add" element={<Form collectionName="Ticket" />} />
    <Route path="edit/:objectId" element={<Form collectionName="Ticket" />} />
    <Route path="" element={<TicketTable />} />
  </Routes>
)

const NotificationRoutes = () => (
  <Routes>
    <Route path="" element={<NotificationTable />} />
  </Routes>
)

export default AdminRoutes
