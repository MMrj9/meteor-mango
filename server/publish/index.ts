import { Meteor } from 'meteor/meteor'
import { Company } from '/imports/api/company'

Meteor.publish('company', function (companyId) {
  // Check if companyId is provided and is a valid string
  if (companyId) {
    // If companyId is provided, publish the specific company with the given ID
    return Company.find({ _id: companyId })
  } else {
    // If companyId is not provided or not a valid string, publish all companies
    return Company.find({})
  }
})

Meteor.publish('user', function () {
  console.log('here', this.userId)
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
