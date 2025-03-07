import React, { useEffect, useState } from 'react'
import { SearchIcon, CloseIcon } from '@chakra-ui/icons'
import { Link as RouterLink } from 'react-router-dom'
import {
  Input,
  Box,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  InputGroup,
  InputLeftElement,
  Button,
  Flex,
  Text,
  IconButton,
  Divider, // Added Divider
} from '@chakra-ui/react'
import { AdminRoutes } from '/imports/api'

interface MenuItem {
  label: string
  path: string
}

let baseMenuItems: MenuItem[] = [
  {
    label: 'Main',
    path: '/',
  },
  {
    label: 'User',
    path: '/admin/user',
  },
]


interface AdminNavProps {
  isSidebarOpen: boolean
  setSidebarOpen: (isOpen: boolean) => void
}

const AdminNav = ({ isSidebarOpen, setSidebarOpen }: AdminNavProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [menuItems, setMenuItems] = useState(baseMenuItems)

  const getAdminMenuItems = () => {
    const additonalMenuItems: MenuItem[] = Object.keys(AdminRoutes).map(
      (menuItemKey: string) => {
        return {
          label: AdminRoutes[menuItemKey] as string,
          path: `/admin/${menuItemKey}`,
        }
      },
    )
    return  [...baseMenuItems, ...additonalMenuItems]
  }

  useEffect(() => { 
    setMenuItems(getAdminMenuItems())
  }, [])

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (!searchTerm) {
        setMenuItems(getAdminMenuItems())
      } else {
        const filteredMenuItems = menuItems.filter((item) =>
          item.label.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        setMenuItems(filteredMenuItems)
      }
    }, 300)

    return () => clearTimeout(delaySearch)
  }, [searchTerm])

  useEffect(() => {
    if (!isSidebarOpen) {
      setSearchTerm('')
    }
    setMenuItems(getAdminMenuItems())
  }, [isSidebarOpen])

  const handleClearSearch = () => {
    setSearchTerm('')
  }

  return (
    <Drawer
      isOpen={isSidebarOpen}
      placement="left"
      onClose={() => setSidebarOpen(false)}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          <InputGroup mt="8">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              pr="40px"
            />
            {searchTerm && (
              <IconButton
                aria-label="Clear search"
                icon={<CloseIcon />}
                size="sm"
                onClick={handleClearSearch}
                ml={2}
              />
            )}
          </InputGroup>
        </DrawerHeader>
        <DrawerBody>
          <Box p={4}>
            {menuItems.map((menuItem, index) => (
              <React.Fragment key={menuItem.label}>
                <Flex align="center" mb={2}>
                  <Button
                    as={RouterLink}
                    to={menuItem.path}
                    variant="link"
                    size="sm"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Text fontSize="md">{menuItem.label}</Text>
                  </Button>
                </Flex>
                {index < menuItems.length - 1 && <Divider mt={2} mb={2} />}{' '}
                {/* Add Divider */}
              </React.Fragment>
            ))}
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

export default AdminNav
