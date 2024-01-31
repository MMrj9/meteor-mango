//@ts-ignore
import { Roles } from 'meteor/alanning:roles'
import { Meteor } from 'meteor/meteor'
//@ts-ignore
import SimpleSchema from 'meteor/aldeed:simple-schema'
import Schema from '.'

interface Profile {
  firstName?: string
  lastName?: string
  birthday?: Date
}

Schema.UserProfile = new SimpleSchema({
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
})

Schema.User = new SimpleSchema({
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
    type: Schema.UserProfile,
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
})

//@ts-ignore
Meteor.users.attachSchema(Schema.User)

const AllRoles = ['admin', 'manager', 'basic']

const DefaultRoles = ['admin']

const AdminRoles = ['admin']

const validateUserIsAdmin = (user: Meteor.User) => {
  return Roles.userIsInRole(user, AdminRoles)
}

const validateUserPermissions = (roles: string[] = []) => {
  const user = Meteor.user()
  if (!user || (!validateUserIsAdmin(user) && !Roles.userIsInRole(user, roles)))
    throw new Meteor.Error('invalid-permissions', 'Invalid Permissions')
}

export {
  AllRoles,
  DefaultRoles,
  Profile,
  validateUserIsAdmin,
  validateUserPermissions,
}
