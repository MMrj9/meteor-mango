import { Meteor } from 'meteor/meteor'
import { validateObject } from '/imports/utils/object'
import { validateUserPermissions } from '/imports/api/user'
import { AdminComment } from '/imports/api/adminComment'
import { sendNotificationToUsers } from './notification'

function validateAdminComment(adminComment: AdminComment) {
  validateObject(adminComment)
}

Meteor.methods({
  'AdminComment.insertOrUpdate'(
    adminComment: AdminComment,
    taggedUsers: string[],
  ) {
    validateUserPermissions()
    validateAdminComment(adminComment)

    //@ts-ignore
    adminComment.user = Meteor.user().username

    if (adminComment._id) {
      adminComment.updatedOn = new Date()
      AdminComment.update(adminComment._id, { $set: adminComment })
    } else {
      adminComment.createdOn = new Date()
      AdminComment.insert(adminComment)
      sendNotificationToUsers(
        taggedUsers,
        `[Tagged In Comment] ${adminComment.text}`,
        `/admin/${adminComment.collection}/edit/${adminComment.objectId}`,
      )
    }
  },
})
