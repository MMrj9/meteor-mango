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
  UserFields,
  validateUserPermissions,
} from '/imports/api/user'

function validateUser(user: any) {
  validateObject(user)

  const { username, email, password } = user

  validateString(
    'Username',
    username,
    UserFields.username.minCharacters,
    UserFields.username.maxCharacters,
  )
  validateString(
    'Email',
    email,
    UserFields.email.minCharacters,
    UserFields.email.maxCharacters,
  )
  validateString(
    'Password',
    password,
    UserFields.password.minCharacters,
    UserFields.password.minCharacters,
  )

  if (!validateEmail(email)) {
    throw new Meteor.Error(
      'invalid-argument',
      'Valid email address is required.',
    )
  }

  if (Meteor.users.findOne({ username })) {
    throw new Meteor.Error('username-taken', 'Username is already taken.')
  }

  if (Meteor.users.findOne({ 'emails.address': email })) {
    throw new Meteor.Error('email-taken', 'Email address is already taken.')
  }
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
  'user.update': (data, user: Meteor.User) => {
    validateUserPermissions(user, [])

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
