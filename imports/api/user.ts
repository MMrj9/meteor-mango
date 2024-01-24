//@ts-ignore
import { Roles } from 'meteor/alanning:roles'
import { Meteor } from 'meteor/meteor'

const AllRoles = ['admin', 'manager', 'basic']

const DefaultRoles = ['admin']

const AdminRoles = ['admin']

interface Profile {}

const UserFields = {
  email: {
    minCharacters: 6,
    maxCharacters: 320,
  },
  username: {
    minCharacters: 6,
    maxCharacters: 30,
  },
  password: {
    minCharacters: 6,
    maxCharacters: 320,
  },
}

const validateUserIsAdmin = (user: Meteor.User) => {
  return Roles.userIsInRole(user, AdminRoles)
}

const validateUserPermissions = (user: Meteor.User, roles: string[] = []) => {
  if (!validateUserIsAdmin(user) && !Roles.userIsInRole(user, roles))
    throw new Meteor.Error('invalid-permissions', 'Invalid Permissions')
}

export {
  AllRoles,
  DefaultRoles,
  UserFields,
  Profile,
  validateUserIsAdmin,
  validateUserPermissions,
}
