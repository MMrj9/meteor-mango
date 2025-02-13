import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Main from './components/Main'
import UserTable from './pages/admin/User/UserTable'
import Form from './pages/admin/Form/Form'
import UserForm from './pages/admin/Form/custom/UserForm'
import Table from './pages/admin/Table/Table'

const AdminRoutes = () => (
  <Routes>
    <Route path="/" element={<Main />} />
    <Route path="brand/*" element={<BrandRoutes />} />
    <Route path="user/*" element={<UserRoutes />} />
    <Route path="ticket/*" element={<TicketRoutes />} />
    <Route path="notification/*" element={<NotificationRoutes />} />
  </Routes>
)

const BrandRoutes = () => (
  <Routes>
    <Route path="add" element={<Form collectionName="Brand" />} />
    <Route path="edit/:objectId" element={<Form collectionName="Brand" />} />
    <Route path="" element={<Table collectionName="Brand" />} />
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
    <Route path="" element={<Table collectionName="Ticket" />} />
  </Routes>
)

const NotificationRoutes = () => (
  <Routes>
    <Route path="" element={<Table collectionName="Notification" />} />
  </Routes>
)

export default AdminRoutes
