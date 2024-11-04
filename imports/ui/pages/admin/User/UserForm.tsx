import React, { useEffect, useState } from 'react'
//@ts-ignore
import { Roles } from 'meteor/alanning:roles'
import GenericForm, { FormField, FormFieldType } from '../../../components/generic/form/Form'
import { Meteor } from 'meteor/meteor'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { Tracker } from 'meteor/tracker'
import { AllRoles } from '/imports/api/user'
import {
  mapValuesToAutocompleteOptions,
  processFormFieldsValues,
} from '../../../components/generic/form/utils'
import { error, success } from '/imports/ui/components/generic/utils'

interface UserFormProps {}

const UserFormFields: Record<string, FormField> = {
  username: {
    label: 'Username',
    disabled: true,
  },
  'emails[0].address': {
    label: 'Email',
    disabled: true,
  },
  roles: {
    label: 'roles',
    type: FormFieldType.AUTOCOMPLETE,
    autocompleteOptions: [],
    autocompleteInitialValues: [],
  },
}

const UserForm: React.FC<UserFormProps> = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const { userId } = useParams()
  const [user, setUser] = useState<Meteor.User | null>(null)

  useEffect(() => {
    let userSubscription: Meteor.SubscriptionHandle | null = null
    let roleSubscription: Meteor.SubscriptionHandle | null = null
    let trackerHandler: Tracker.Computation | null = null

    const fetchUserData = () => {
      if (Meteor.isClient && userId) {
        userSubscription = Meteor.subscribe('user', userId)
        roleSubscription = Meteor.subscribe('role', userId)

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
        roleSubscription?.stop
      }
      if (trackerHandler) {
        trackerHandler.stop()
      }
    }
  }, [userId])

  const handleSubmit = (values: Meteor.User) => {
    processFormFieldsValues(UserFormFields, values)
    Meteor.call('user.update', values, Meteor.user(), (err: Meteor.Error) => {
      if (err) {
        error(toast, `Failed to save user: ${err.reason}`)
      } else {
        success(toast, 'User saved successfully')
        navigate('/admin/user')
      }
    })
  }

  if (!user) return

  mapValuesToAutocompleteOptions(
    Roles.getRolesForUser(user),
    'roles.autocompleteInitialValues',
    UserFormFields,
  )
  mapValuesToAutocompleteOptions(
    AllRoles,
    'roles.autocompleteOptions',
    UserFormFields,
  )

  return (
    <GenericForm
      collectionName="user"
      initialValues={user}
      onSubmit={handleSubmit}
      formFields={UserFormFields}
    />
  )
}

export { UserFormFields }
export default UserForm
