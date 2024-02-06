import { Meteor } from 'meteor/meteor'
import { validateObject } from '/imports/utils/object'
import { validateUserPermissions } from '/imports/api/user'
import { AdminComment } from '/imports/api/adminComment'

function validateAdminComment(adminComment: AdminComment) {
  validateObject(adminComment)
}

Meteor.methods({
  'admincomment.insertOrUpdate'(adminComment) {
    validateUserPermissions()
    validateAdminComment(adminComment)

    //@ts-ignore
    adminComment.user = Meteor.user().username

    if (adminComment._id) {
      adminComment.updatedOn = new Date()
      AdminComment.update(adminComment._id, { $set: adminComment })
    } else {
      console.log(adminComment)
      adminComment.createdOn = new Date()
      AdminComment.insert(adminComment)
    }
  },
})
