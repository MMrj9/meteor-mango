import React, { useState } from 'react'
import { Box, Badge, IconButton, Stack, Collapse } from '@chakra-ui/react'
import { BellIcon } from '@chakra-ui/icons'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import { Notification } from '/imports/api/notifications'

const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleNotifications = () => {
    setIsOpen(!isOpen)
  }

  const notifications = useTracker(() => {
    if (Meteor.isClient) {
      console.log('here')
      Meteor.subscribe('notification', Notification.find().fetch())
      return Notification.find({}).fetch()
    }
  })

  if (notifications == undefined) return

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
          width="200px"
          p={4}
          bg="white"
          boxShadow="lg"
          borderRadius="md"
        >
          <Stack spacing={2}>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <Box
                  key={notification._id}
                  borderWidth="1px"
                  p={2}
                  borderRadius="md"
                >
                  {notification.content}
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
