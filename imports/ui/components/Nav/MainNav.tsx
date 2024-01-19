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
  useToast,
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
    path: '/company',
  },
  {
    label: 'User',
    path: '/user',
  },
]

interface MainNavProps {
  isSidebarOpen: boolean
  setSidebarOpen: (isOpen: boolean) => void
}

const MainNav = ({ isSidebarOpen, setSidebarOpen }: MainNavProps) => {
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
            {menuItems.map((menuItem) => (
              <Flex key={menuItem.label} align="center" mb={2}>
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
            ))}
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

export default MainNav
