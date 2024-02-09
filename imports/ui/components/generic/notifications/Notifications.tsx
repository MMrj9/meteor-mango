import React, { useState } from 'react'
import { Box, Badge, IconButton, Stack, Collapse, Text } from '@chakra-ui/react'
import { BellIcon } from '@chakra-ui/icons'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import { Notification } from '/imports/api/notifications'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { truncate } from '/imports/utils/string'

const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const toggleNotifications = () => {
    setIsOpen(!isOpen)
  }

  const notifications: Notification[] | undefined = useTracker(() => {
    if (Meteor.isClient) {
      Meteor.subscribe('notification', Notification.find().fetch())
      return Notification.find({}).fetch()
    }
  })

  if (notifications == undefined) return null // Return null instead of undefined

  const handleNotificationClick = (path: string) => {
    navigate(path) // Navigate to the specified path
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
                  <Text>{truncate(notification.content, 100)}</Text>
                </Box>
              ))
            ) : (
              <Box>No notifications</Box>
            )}
          </Stack>
        </Box>
      </Collapse>
    </Box>
  )
}

export default Notifications
