import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Main from './components/Main'
import UserTable from './pages/admin/User/UserTable'
import Form from './pages/admin/Form/Form'
import UserForm from './pages/admin/Form/custom/UserForm'
import Table from './pages/admin/Table/Table'
import { AdminRoutes as adminRoutes } from '../api'

const AdminRoutes = () => (
  <Routes>
    <Route path="/" element={<Main />} />
    <Route path="user/*" element={<UserRoutes />} />
    <Route path="notification/*" element={<NotificationRoutes />} />
    {Object.keys(adminRoutes).map((collectionName: string) => (
      <Route
        path={collectionName + '/*'}
        element={renderAdminRoutes(collectionName)}
      />
    ))}
  </Routes>
)

const renderAdminRoutes = (collectionName: string) => (
  <Routes>
    <Route path="add" element={<Form collectionName={collectionName} />} />
    <Route
      path="edit/:objectId"
      element={<Form collectionName={collectionName} />}
    />
    <Route path="" element={<Table collectionName={collectionName} />} />
  </Routes>
)

const UserRoutes = () => (
  <Routes>
    <Route path="edit/:objectId" element={<UserForm collectionName="User" />} />
    <Route path="" element={<UserTable />} />
  </Routes>
)

const NotificationRoutes = () => (
  <Routes>
    <Route path="" element={<Table collectionName="Notification" />} />
  </Routes>
)

export default AdminRoutes
