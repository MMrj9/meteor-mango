import React, { useState } from 'react'
import {
  Box,
  Badge,
  IconButton,
  Stack,
  Collapse,
  Text,
  Flex,
  useToast,
} from '@chakra-ui/react'
import { BellIcon, CheckIcon } from '@chakra-ui/icons'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import { Notification } from '/imports/api/notification'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { truncate } from '/imports/utils/string'
import { DisableActionEffect } from '../actions/Actions'
import { error } from '../utils'
import { NonDisabledFilter } from '../filters/Filters'

const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  const toggleNotifications = () => {
    setIsOpen(!isOpen)
  }

  const notifications: Notification[] | undefined = useTracker(() => {
    if (Meteor.isClient) {
      const subscription = Meteor.subscribe('Notification')

      if (subscription.ready()) {
        return Notification.find(NonDisabledFilter, {
          sort: { createdOn: -1 },
        }).fetch()
      }
    }
  })

  if (notifications == undefined) return null // Return null instead of undefined

  const handleNotificationClick = (path: string) => {
    navigate(path) // Navigate to the specified path
  }

  const markAsRead = async (id: string) => {
    try {
      await DisableActionEffect('notification', id)
    } catch (err) {
      error(toast, `Error while marking notification as read`)
    }
  }

  return (
    <Box position="relative">
      <IconButton
        aria-label="Notifications"
        icon={<BellIcon />}
        onClick={toggleNotifications}
        variant="ghost"
      />
      <Badge
        position="absolute"
        top="0"
        right="0"
        colorScheme="red"
        borderRadius="full"
        variant="solid"
        visibility={notifications.length > 0 ? 'visible' : 'hidden'}
      >
        {notifications.length}
      </Badge>
      <Collapse in={isOpen} animateOpacity>
        <Box
          position="absolute"
          top="100%"
          right="0"
          zIndex={10}
          width="400px"
          p={4}
          bg="white"
          boxShadow="lg"
          borderRadius="md"
        >
          <Stack spacing={2}>
            {notifications.length > 0 ? (
              notifications.map((notification: Notification) => (
                <Box
                  key={notification._id}
                  borderWidth="1px"
                  p={2}
                  borderRadius="md"
                  cursor="pointer" // Add cursor pointer
                  _hover={{ bg: 'gray.100' }} // Change background color on hover
                  onClick={() =>
                    notification.path &&
                    handleNotificationClick(notification.path)
                  } // Handle notification click
                >
                  <Text fontSize="sm" color="gray.500">
                    {moment(notification.createdOn).format('YYYY-MM-DD HH:mm')}
                  </Text>
                  <Flex>
                    <Box flex={1}>
                      <Text>{truncate(notification.content, 100)}</Text>
                    </Box>
                    <IconButton
                      size="xs"
                      variant="outline"
                      colorScheme="teal"
                      aria-label="Mark as Read"
                      icon={<CheckIcon />}
                      onClick={(e) => {
                        e.stopPropagation() // Stop event propagation
                        markAsRead(notification._id)
                      }}
                    />
                  </Flex>
                </Box>
              ))
            ) : (
              <Box>No notifications</Box>
            )}
            {/* "View All" link */}
            <Box
              textAlign="center"
              py={2}
              borderTopWidth="1px"
              borderTopColor="gray.200"
            >
              <Text
                color="teal.500"
                cursor="pointer"
                onClick={() => navigate('/admin/notification')}
              >
                View All
              </Text>
            </Box>
          </Stack>
        </Box>
      </Collapse>
    </Box>
  )
}

export default Notifications
