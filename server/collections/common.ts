import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { check } from 'meteor/check'
import { validateUserPermissions } from '/imports/api/user'
import { logChanges } from '/imports/api/changelog'
import { Collections } from '/imports/api'
import _ from 'lodash'

export const GET = 'GET'
export const POST = 'POST'
export const PUT = 'PUT'
export const DELETE = 'DELETE'

export const insertOrUpdate = (
  collectionName: string,
  object: any,
): [string, boolean] => {
  try {
    const collection = Collections[collectionName]

    if (!collection) {
      throw new Error(`Collection ${collectionName} does not exist.`)
    }

    if (object._id) {
      const existingObject = collection.findOne(object._id)
      if (!existingObject) {
        throw new Error(
          `Object with _id ${object._id} not found in ${collectionName}.`,
        )
      }
      logChanges(
        object._id,
        collectionName,
        'update',
        existingObject,
        _.cloneDeep(object),
      )
      object.updatedOn = new Date()
      collection.update(object._id, { $set: object })
      return [object._id, false] // Update operation
    } else {
      object.createdOn = new Date()
      const _id = collection.insert(object)
      logChanges(_id, collectionName, 'create', {}, object)
      return [_id, true] // Insert operation
    }
  } catch (error) {
    console.error(`Error in insertOrUpdate for ${collectionName}:`, error)
    throw error
  }
}

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

    const existingDocument = collection.findOne({ _id: documentId })

    const updateQuery = {
      $set: {
        [fieldName]: value,
      },
    }
    const result = collection.update({ _id: documentId }, updateQuery)

    if (result === 0) {
      throw new Meteor.Error('document-not-found', 'Document not found')
    }

    const updatedDocument = collection.findOne({ _id: documentId })

    logChanges(
      documentId,
      collectionName,
      'update',
      existingDocument,
      updatedDocument,
    )

    return { success: true }
  },
})
