import React, { useEffect, useState } from 'react'
import GenericForm from '../generic/form/Form'
import { Meteor } from 'meteor/meteor'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { Tracker } from 'meteor/tracker'

interface UserFormProps {}

const formFields = {
  username: { label: 'Username', disabled: true, maxCharacters: 25 },
  'emails[0].address': { label: 'Email', disabled: true, maxCharacters: 50 },
}

const UserForm: React.FC<UserFormProps> = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const { userId } = useParams()
  const [user, setUser] = useState<Meteor.User | null>(null)

  useEffect(() => {
    let userSubscription: Meteor.SubscriptionHandle | null = null
    let trackerHandler: Tracker.Computation | null = null

    const fetchUserData = () => {
      if (Meteor.isClient && userId) {
        userSubscription = Meteor.subscribe('user', userId)

        trackerHandler = Tracker.autorun(() => {
          const _user = Meteor.users.findOne({ _id: userId })
          setUser(_user as Meteor.User)
        })
      }
    }

    fetchUserData()

    return () => {
      if (userSubscription) {
        userSubscription.stop()
      }
      if (trackerHandler) {
        trackerHandler.stop()
      }
    }
  }, [userId])

  const handleSubmit = (values: Meteor.User) => {
    Meteor.call('user.update', values, (error: Meteor.Error) => {
      if (error) {
        toast({
          title: 'Error',
          description: `Failed to save user: ${error.reason}`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      } else {
        toast({
          title: 'Success',
          description: 'User saved successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })

        navigate('/user')
      }
    })
  }

  if (!user) return

  console.log('user', user)

  return (
    <GenericForm
      collectionName="user"
      initialValues={user}
      onSubmit={handleSubmit}
      formFields={formFields}
    />
  )
}

export default UserForm
