import { Accounts } from 'meteor/accounts-base'
import { Meteor } from 'meteor/meteor'
//@ts-ignore
import { Roles } from 'meteor/alanning:roles'
import { validateEmail } from '/imports/utils/string'

const defaultRoles = ['admin']

interface Profile {}

Meteor.methods({
  'user.register': async (user) => {
    if (!user || typeof user !== 'object') {
      throw new Meteor.Error('invalid-argument', 'Company data is required.')
    }

    const { username, email, password } = user

    if (!username || typeof username !== 'string') {
      throw new Meteor.Error(
        'invalid-argument',
        'Username is required and must be a string.',
      )
    }

    if (!email || typeof email !== 'string' || !validateEmail(email)) {
      throw new Meteor.Error(
        'invalid-argument',
        'Valid email address is required.',
      )
    }

    if (!password || typeof password !== 'string') {
      throw new Meteor.Error(
        'invalid-argument',
        'Password is required and must be a string.',
      )
    }

    if (Meteor.users.findOne({ username })) {
      throw new Meteor.Error('username-taken', 'Username is already taken.')
    }

    if (Meteor.users.findOne({ 'emails.address': email })) {
      throw new Meteor.Error('email-taken', 'Email address is already taken.')
    }

    const profile: Profile = {}
    user['profile'] = profile

    const id = await Accounts.createUser(user)

    Roles.addUsersToRoles(id, defaultRoles)

    return id
  },
})

Meteor.startup(() => {
  const roles = ['admin']

  roles.forEach(function (role) {
    Roles.createRole(role, { unlessExists: true })
  })
})
