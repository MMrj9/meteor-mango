import { Meteor } from 'meteor/meteor'
import { Changelog } from '/imports/api/changelog'
import { validateUserPermissions } from '/imports/api/user'

Meteor.methods({
  'changelog.list'(collection, objectId) {
    validateUserPermissions()

    const changelogEntries = Changelog.find(
      {
        collection,
        objectId,
      },
      { sort: { timestamp: -1 } },
    ).fetch()

    return changelogEntries
  },
})
