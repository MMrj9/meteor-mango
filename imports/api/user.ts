//@ts-ignore
import { Roles } from 'meteor/alanning:roles'
import { Meteor } from 'meteor/meteor'
//@ts-ignore
import SimpleSchema from 'meteor/aldeed:simple-schema'
import { Collections, FieldProperties, Schemas } from '.'
import { formatSimpleSchema } from './utils/simpleSchema'

interface Profile {
  firstName?: string
  lastName?: string
  birthday?: Date
}

const UserProfile: Record<string, FieldProperties> = {
  firstName: {
    type: String,
    optional: true,
  },
  lastName: {
    type: String,
    optional: true,
  },
  birthday: {
    type: Date,
    optional: true,
  },
}

const UserSchema: Record<string, FieldProperties> = {
  username: {
    type: String,
    optional: true,
    min: 6,
    max: 30,
  },
  emails: {
    type: Array,
    optional: true,
  },
  'emails.$': {
    type: Object,
  },
  'emails.$.address': {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    min: 6,
    max: 320,
  },
  'emails.$.verified': {
    type: Boolean,
  },
  registered_emails: {
    type: Array,
    optional: true,
  },
  'registered_emails.$': {
    type: Object,
    blackbox: true,
  },
  createdAt: {
    type: Date,
  },
  profile: {
    type: new SimpleSchema(formatSimpleSchema(UserProfile)),
    optional: true,
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true,
  },
  roles: {
    type: Array,
    optional: true,
  },
  'roles.$': {
    type: String,
  },
  heartbeat: {
    type: Date,
    optional: true,
  },
}

Schemas.UserProfile = UserProfile
Schemas.User = UserSchema
Collections.User = Meteor.users

const simpleSchema: SimpleSchema = new SimpleSchema(
  formatSimpleSchema(UserSchema),
)
//@ts-ignore
Meteor.users.attachSchema(simpleSchema)

export const AllRoles = ['admin', 'manager', 'basic']

export const DefaultRoles = ['admin']

export const AdminRoles = ['admin']

const validateUserIsAdmin = (user: Meteor.User) => {
  return Roles.userIsInRole(user, AdminRoles)
}

const validateUserPermissions = (roles: string[] = []) => {
  const user = Meteor.user()
  if (!user || (!validateUserIsAdmin(user) && !Roles.userIsInRole(user, roles)))
    throw new Meteor.Error('invalid-permissions', 'Invalid Permissions')
}

const getUserName = () => {
  const user = Meteor.user()
  if (!user)
    throw new Meteor.Error('invalid-permissions', 'Invalid Permissions')
  return user?.username
}

export { Profile, validateUserIsAdmin, validateUserPermissions, getUserName }
