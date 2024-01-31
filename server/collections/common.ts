import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { check } from 'meteor/check'
import { validateUserPermissions } from '/imports/api/user'

Meteor.methods({
  disable(collectionName: string, documentId: string) {
    check(collectionName, String)
    check(documentId, String)

    console.log('here')

    validateUserPermissions()

    //@ts-ignore
    const collection = Mongo.Collection.get(collectionName)

    if (!collection) {
      throw new Meteor.Error('invalid-collection', 'Invalid collection name')
    }

    // Check if the collection has a 'disable' field
    // TODO Implement collections2
    const collectionSchema = collection.simpleSchema()
    if (
      !collectionSchema ||
      !collectionSchema._schema ||
      !collectionSchema._schema.disable
    ) {
      throw new Meteor.Error(
        'no-disable-field',
        'The collection does not have a "disable" field',
      )
    }

    // Construct the update query
    const updateQuery = {
      $set: {
        disable: true,
      },
    }

    // Perform the update operation
    const result = collection.update({ _id: documentId }, updateQuery)

    if (result === 0) {
      throw new Meteor.Error('document-not-found', 'Document not found')
    }

    // You can return additional information if needed
    return { success: true }
  },
})
