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

interface MenuItem {
  label: string
  path: string
}

const DefaultMenuItems: MenuItem[] = [
  {
    label: 'Main',
    path: '/',
  },
  {
    label: 'Company',
    path: '/admin/company',
  },
  {
    label: 'User',
    path: '/admin/user',
  },
  {
    label: 'Ticket',
    path: '/admin/ticket',
  },
]

interface AdminNavProps {
  isSidebarOpen: boolean
  setSidebarOpen: (isOpen: boolean) => void
}

const AdminNav = ({ isSidebarOpen, setSidebarOpen }: AdminNavProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [menuItems, setMenuItems] = useState(DefaultMenuItems)

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (!searchTerm) {
        setMenuItems(DefaultMenuItems)
      } else {
        const filteredMenuItems = DefaultMenuItems.filter((item) =>
          item.label.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        setMenuItems(filteredMenuItems)
      }
    }, 300)

    return () => clearTimeout(delaySearch)
  }, [searchTerm])

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
