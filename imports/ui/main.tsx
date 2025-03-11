//@ts-ignore
import { renderWithSSR } from 'meteor/communitypackages:react-router-ssr'
import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { useTracker } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import AdminRoutes from './AdminRoutes'
import LoginForm from './components/Authentication/LoginForm'
import RegistrationForm from './components/Authentication/RegistrationForm'
import DefaultRoutes from './DefaultRoutes'
import thunk from 'redux-thunk'
import { ChakraProvider, ColorModeScript, theme } from '@chakra-ui/react'
import appReducer from '../redux/reducers'
import AdminLayout from './AdminLayout'
import DefaultLayout from './DefaultLayout'

const App = () => {
  const { user } = useTracker(() => ({
    user: Meteor.user(),
  }))

  return (
    <Routes>
      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          user ? (
            <AdminLayout>
              <AdminRoutes />
            </AdminLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Default Routes */}
      <Route
        path="/*"
        element={
          <DefaultLayout>
            <DefaultRoutes />
          </DefaultLayout>
        }
      />
    </Routes>
  )
}

renderWithSSR(
  <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </>,
  {
    renderTarget: 'react-target',
    storeOptions: {
      rootReducer: appReducer,
      initialState: {},
      middlewares: [thunk],
    },
  },
)
