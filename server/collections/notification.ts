import { Meteor } from 'meteor/meteor'
//@ts-ignore
import { Roles } from 'meteor/alanning:roles'
import { Notification } from '/imports/api/notification'

export const sendNotificationToGroups = (
  roles: string[],
  content: string,
  path?: string,
) => {
  const users = Roles.getUsersInRole(roles).fetch()
  const baseNotification = { content, path, createdOn: new Date() }
  users.forEach((user: Meteor.User) => {
    const notification = { ...baseNotification, user: user.username }
    Notification.insert(notification as Notification)
  })
}

export const sendNotificationToUsers = (
  usernames: string[],
  content: string,
  path?: string,
) => {
  const baseNotification = { content, path, createdOn: new Date() }
  usernames.forEach((username: string) => {
    const notification = { ...baseNotification, user: username }
    Notification.insert(notification)
  })
}

Meteor.methods({})
