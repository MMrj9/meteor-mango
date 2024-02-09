import React, { useState } from 'react'
import { Grid, GridItem, Button, Flex, Spacer, Text } from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import { Meteor } from 'meteor/meteor'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import AdminNav from './components/Nav/AdminNav'
import Notifications from './components/generic/notifications/Notifications'

const AdminLayout: React.FC = (props: any) => {
  const isLoggedIn = !!Meteor.userId()
  const username = Meteor.user()?.username
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    Meteor.logout()
  }

  return (
    <Grid
      templateColumns="auto 1fr"
      templateRows="50px 1fr 30px"
      templateAreas={`"button header"
                      "main main"
                      "footer footer"`}
      h="100vh"
      gap="1"
      fontWeight="bold"
      bg={'white'}
    >
      {/* Button Section */}
      <GridItem p="2" area={'button'} textAlign="left">
        {!isSidebarOpen && (
          <Button onClick={() => setSidebarOpen(true)} variant="link">
            <HamburgerIcon boxSize={6} />
          </Button>
        )}
      </GridItem>

      {/* Header Section */}
      <GridItem pl="2" area={'header'} p={2}>
        <Flex align="center" justify="flex-end">
          <Flex></Flex>
          <Spacer />
          <Flex alignItems={'center'}>
            {/* ... (rest of the header content) */}
            {isLoggedIn ? (
              <>
                <Notifications />
                <Text ml="2">Welcome, {username}</Text>
                <Button
                  onClick={handleLogout}
                  colorScheme="teal"
                  variant="outline"
                  ml="2"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  as={RouterLink}
                  to="/login"
                  colorScheme="teal"
                  variant="outline"
                  mr="1"
                >
                  Login
                </Button>
                <Button
                  as={RouterLink}
                  to="/register"
                  colorScheme="teal"
                  ml="1"
                >
                  Register
                </Button>
              </>
            )}
          </Flex>
        </Flex>
      </GridItem>

      {/* Main Content Section */}
      <GridItem p="20" area={'main'}>
        {/* ... (main content) */}
        {props.children}
      </GridItem>

      {/* Footer Section */}
      <GridItem pl="2" area={'footer'}>
        {/* ... (footer content) */}
      </GridItem>

      {/* Sidebar */}
      <AdminNav isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
    </Grid>
  )
}

export default AdminLayout
