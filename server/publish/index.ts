import { Meteor } from 'meteor/meteor'
import { Company } from '/imports/api/company'
import { Changelog } from '/imports/api/changelog'
import { AdminComment } from '/imports/api/adminComment'
import { Ticket } from '/imports/api/ticket'
import { Notification } from '/imports/api/notifications'

Meteor.publish('company', function (companyId) {
  if (companyId) {
    return Company.find({ _id: companyId })
  } else {
    return Company.find({})
  }
})

Meteor.publish('user', function () {
  if (this.userId) {
    // Only publish data for the logged-in user
    return Meteor.users.find(
      {},
      {
        fields: {
          username: 1,
          emails: 1,
          profile: 1, // You can specify other fields you want to publish
        },
      },
    )
  } else {
    // User is not logged in, don't publish any data
    this.ready()
  }
})

Meteor.publish(null, function () {
  if (this.userId) {
    //@ts-ignore
    return Meteor.roleAssignment.find({ 'user._id': this.userId })
  } else {
    this.ready()
  }
})

Meteor.publish('role', function (user_id: string) {
  //@ts-ignore
  return Meteor.roleAssignment.find({ 'user._id': user_id })
})

Meteor.publish('changelog', function (collection, objectId) {
  return Changelog.find({ collection, objectId }, { sort: { timestamp: -1 } })
})

Meteor.publish('admincomment', function (collection, objectId) {
  return AdminComment.find(
    { collection, objectId },
    { sort: { createdOn: -1 } },
  )
})

Meteor.publish('ticket', function (ticketId) {
  if (ticketId) {
    return Ticket.find({ _id: ticketId })
  } else {
    return Ticket.find({})
  }
})

Meteor.publish('notification', function () {
  const user = Meteor.user()
  if (user) return Notification.find({ user: user.username })
})
