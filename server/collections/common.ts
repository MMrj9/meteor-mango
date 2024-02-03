import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { check } from 'meteor/check'
import { validateUserPermissions } from '/imports/api/user'
import { logChanges } from '/imports/api/changelog'

Meteor.methods({
  setField(
    collectionName: string,
    documentId: string,
    fieldName: string,
    value: any,
  ) {
    check(collectionName, String)
    check(documentId, String)
    check(fieldName, String)

    validateUserPermissions()

    //@ts-ignore
    const collection = Mongo.Collection.get(collectionName)

    if (!collection) {
      throw new Meteor.Error('invalid-collection', 'Invalid collection name')
    }

    // Check if the collection has field
    const collectionSchema = collection.simpleSchema()
    if (
      !collectionSchema ||
      !collectionSchema._schema ||
      !collectionSchema._schema[fieldName]
    ) {
      throw new Meteor.Error(
        'no-disable-field',
        `The collection does not have a ${fieldName} field`,
      )
    }

    // Construct the update query
    const updateQuery = {
      $set: {
        [fieldName]: value,
      },
    }

    const existingDocument = collection.findOne({ _id: documentId })

    // Perform the update operation
    const result = collection.update({ _id: documentId }, updateQuery)

    if (result === 0) {
      throw new Meteor.Error('document-not-found', 'Document not found')
    }

    const updatedDocument = collection.findOne({ _id: documentId })

    logChanges(documentId, collectionName, 'update', existingDocument, updatedDocument)

    // You can return additional information if needed
    return { success: true }
  },
})
