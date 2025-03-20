import React, { useEffect } from 'react'
import { Grid, GridItem, Button, Flex, Spacer } from '@chakra-ui/react'
import { Meteor } from 'meteor/meteor'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import UserProfileLink from './components/generic/nav/UserProfileLink'
import '../api/forceImport'
// @ts-ignore
import { Roles } from 'meteor/alanning:roles'

const NON_AUTHENTICATED_ROUTES = ['/login', '/register']

const DefaultLayout: React.FC = (props: any) => {
  const isLoggedIn = !!Meteor.userId()
  const navigate = useNavigate()

  useEffect(() => {
    if (
      !isLoggedIn &&
      !NON_AUTHENTICATED_ROUTES.includes(window.location.pathname)
    ) {
      navigate('/login')
    }
  }, [isLoggedIn, navigate])

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
      {/* <GridItem p="2" area={'button'} textAlign="left">
        {!isSidebarOpen && (
          <Button onClick={() => setSidebarOpen(true)} variant="link">
            <HamburgerIcon boxSize={6} />
          </Button>
        )}
      </GridItem> */}

      {/* Header Section */}
      <GridItem pl="2" area={'header'} p={2}>
        <Flex align="center" justify="flex-end">
          <Flex></Flex>
          <Spacer />
          <Flex alignItems={'center'}>
            {isLoggedIn ? (
              <>
                <UserProfileLink />
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
    </Grid>
  )
}

export default DefaultLayout
