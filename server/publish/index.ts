import { Meteor } from 'meteor/meteor'
import { BrandCollectionName } from '../../imports/api/brand'
import { BrandCategoryCollectionName } from '../../imports/api/brandCategory'
import { Changelog } from '/imports/api/changelog'
import { AdminComment } from '/imports/api/adminComment'
import { Ticket } from '/imports/api/ticket'
import { Notification } from '/imports/api/notification'
import { Collections } from '/imports/api'

Meteor.publish(BrandCollectionName, function (_id) {
  if (_id) {
    return Collections[BrandCollectionName].find({ _id })
  } else {
    return Collections[BrandCollectionName].find({})
  }
})

Meteor.publish(BrandCategoryCollectionName, function (_id) {
  if (_id) {
    return Collections[BrandCategoryCollectionName].find({ _id })
  } else {
    return Collections[BrandCategoryCollectionName].find({})
  }
})

Meteor.publish('User', function () {
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

Meteor.publish('Role', function (user_id: string) {
  //@ts-ignore
  return Meteor.roleAssignment.find({ 'user._id': user_id })
})

Meteor.publish('Changelog', function (collection, objectId) {
  return Changelog.find({ collection, objectId }, { sort: { timestamp: -1 } })
})

Meteor.publish('AdminComment', function (collection, objectId) {
  return AdminComment.find(
    { collection, objectId },
    { sort: { createdOn: -1 } },
  )
})

Meteor.publish('Ticket', function (ticketId) {
  if (ticketId) {
    return Ticket.find({ _id: ticketId })
  } else {
    return Ticket.find({})
  }
})

Meteor.publish('Notification', function () {
  const user = Meteor.user()
  if (user) {
    return Notification.find(
      { user: user.username },
      { sort: { createdOn: -1 } },
    )
  }
})
