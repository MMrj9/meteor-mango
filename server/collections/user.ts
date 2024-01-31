import { Accounts } from 'meteor/accounts-base'
import { Meteor } from 'meteor/meteor'
//@ts-ignore
import { Roles } from 'meteor/alanning:roles'
import { validateEmail, validateString } from '/imports/utils/string'
import { validateObject } from '/imports/utils/object'
import {
  AllRoles,
  DefaultRoles,
  Profile,
  validateUserPermissions,
} from '/imports/api/user'

function validateUser(user: any) {
  validateObject(user)

  const { username, email } = user

  if (!validateEmail(email)) {
    throw new Meteor.Error(
      'invalid-argument',
      'Valid email address is required.',
    )
  }

  if (!user._id && Meteor.users.findOne({ username })) {
    throw new Meteor.Error('username-taken', 'Username is already taken.')
  }

  if (!user._id && Meteor.users.findOne({ 'emails.address': email })) {
    throw new Meteor.Error('email-taken', 'Email address is already taken.')
  }
}

const getUserById = (_id: string) => {
  const user = Meteor.users.findOne({ _id })
  if (!user) throw new Meteor.Error('not-fount', 'User not found.')
  return user
}

Meteor.methods({
  'user.register': async (data) => {
    validateUser(data)

    const profile: Profile = {}
    data['profile'] = profile

    const id = await Accounts.createUser(data)

    Roles.addUsersToRoles(id, DefaultRoles)

    return id
  },
  'user.update': (data: any) => {
    validateUserPermissions()

    const user = getUserById(data._id)
    const newRoles = data['roles']
    const existingRoles = Roles.getRolesForUser(user)

    newRoles.forEach((newRole: string) => {
      if (!AllRoles.includes(newRole))
        throw new Meteor.Error('invalid-role', 'Invalid Role')
      if (!existingRoles.includes(newRole))
        Roles.addUsersToRoles(user._id, [newRole])
    })
    existingRoles.forEach((existingRole: string) => {
      if (!newRoles.includes(existingRole))
        Roles.removeUsersFromRoles(user._id, [existingRole])
    })
  },
})

Meteor.startup(() => {
  AllRoles.forEach(function (role) {
    Roles.createRole(role, { unlessExists: true })
  })
})
