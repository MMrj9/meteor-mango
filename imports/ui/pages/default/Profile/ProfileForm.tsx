import React, { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  SimpleGrid,
  useToast,
} from '@chakra-ui/react'
import { Meteor } from 'meteor/meteor'
import { error, success } from '/imports/ui/components/generic/utils'
import { Profile } from '/imports/api/user'

const ProfileForm: React.FC = () => {
  const user = Meteor.user()
  if (!user) return null
  const [profile, setProfile] = useState<Profile>({
    ...user.profile,
  })

  const [isEditing, setIsEditing] = useState<boolean>(false)
  const toast = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile({
      ...profile,
      [name]: name === 'birthday' ? new Date(value) : value,
    })
  }

  const toggleEdit = () => {
    if (isEditing) {
      Meteor.call(
        'User.profile.update',
        Meteor.userId(),
        profile,
        (err: Meteor.Error | null) => {
          if (err) {
            error(toast, 'Error updating profile')
          } else {
            success(toast, 'Profile updated')
          }
        },
      )
    }
    setIsEditing(!isEditing)
  }

  return (
    <Box p={4} maxW="lg" mx="auto">
      <VStack spacing={4}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} width="full">
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Text>{user.emails && user.emails[0].address}</Text>
          </FormControl>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Text>{user.username}</Text>
          </FormControl>
          <FormControl>
            <FormLabel>First Name</FormLabel>
            {isEditing && !user.profile.firstName ? (
              <Input
                name="firstName"
                value={profile.firstName || ''}
                onChange={handleChange}
                placeholder="First Name"
              />
            ) : (
              <Text>{profile.firstName || '-'}</Text>
            )}
          </FormControl>
          <FormControl>
            <FormLabel>Last Name</FormLabel>
            {isEditing && !user.profile.lastName ? (
              <Input
                name="lastName"
                value={profile.lastName || ''}
                onChange={handleChange}
                placeholder="Last Name"
              />
            ) : (
              <Text>{profile.lastName || '-'}</Text>
            )}
          </FormControl>
          <FormControl>
            <FormLabel>Birthday</FormLabel>
            {isEditing && !user.profile.birthday ? (
              <Input
                type="date"
                name="birthday"
                value={
                  profile.birthday
                    ? profile.birthday.toISOString().split('T')[0]
                    : ''
                }
                onChange={handleChange}
              />
            ) : (
              <Text>
                {profile.birthday ? profile.birthday.toDateString() : '-'}
              </Text>
            )}
          </FormControl>
        </SimpleGrid>
        <Button onClick={toggleEdit}>{isEditing ? 'Save' : 'Edit'}</Button>
      </VStack>
    </Box>
  )
}

export default ProfileForm
