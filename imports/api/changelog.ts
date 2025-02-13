import { Mongo } from 'meteor/mongo'
//@ts-ignore
import SimpleSchema from 'meteor/aldeed:simple-schema'
import { Collections, CustomSchemaTypes, FieldProperties, Schemas } from '.'
import { getUserName } from './user'
import { formatSimpleSchema } from './utils/simpleSchema'
import _ from 'lodash'

interface FieldChange {
  field: string
  oldValue: any
  newValue: any
}

interface Changelog {
  _id?: string
  objectId: string
  collection: string
  user: string
  changeType: string
  timestamp: Date
  changes: FieldChange[]
}

const FieldChangeSchema = {
  field: {
    type: String,
    label: 'Field Name',
  },
  oldValue: {
    type: SimpleSchema.oneOf(String, Number, Boolean, Object, Array),
    label: 'Old Value',
    optional: true,
  },
  'oldValue.$': {
    type: SimpleSchema.oneOf(String, Number, Boolean, Object),
    optional: true,
  },
  newValue: {
    type: SimpleSchema.oneOf(String, Number, Boolean, Object, Array),
    label: 'New Value',
  },
  'newValue.$': {
    type: SimpleSchema.oneOf(String, Number, Boolean, Object),
    optional: true,
  },
}

const ChangelogSchema: Record<string, FieldProperties> = {
  _id: {
    type: String,
    optional: true,
  },
  objectId: {
    type: String,
    label: 'Object ID',
  },
  collection: {
    type: String,
    label: 'Collection',
  },
  user: {
    type: String,
    label: 'User Username',
  },
  changeType: {
    type: String,
    label: 'Change Type',
  },
  timestamp: {
    type: Date,
    label: 'Timestamp',
  },
  changes: {
    type: Array,
    label: 'Changes',
    schema: FieldChangeSchema,
  },
}

const collectionName = 'Changelog'
const Changelog = new Mongo.Collection<Changelog>(collectionName)

Schemas[collectionName] = ChangelogSchema
Collections[collectionName] = Changelog

const simpleSchema: SimpleSchema = new SimpleSchema(
  formatSimpleSchema(ChangelogSchema),
)
//@ts-ignore
Changelog.attachSchema(simpleSchema)

const changelogIgnoreFields = new Set([
  'created_on',
  'updatedOn',
  'createdAt',
  'services',
  'emails',
])

function compareAndLogChanges(
  objectId: string,
  collection: string,
  changeType: string,
  existingDocument: Record<string, any> | undefined,
  updatedDocument: Record<string, any> | null,
  parentField = '',
): FieldChange[] {
  const changes: FieldChange[] = []

  if (!existingDocument && !updatedDocument) {
    return changes // Both documents are invalid, no changes to log
  }

  if (!updatedDocument) {
    // Updated document is completely invalid or null
    return changes // Log no changes for invalid input
  }

  const allKeys = new Set([
    ...Object.keys(existingDocument || {}),
    ...Object.keys(updatedDocument || {}),
  ])

  allKeys.forEach((key) => {
    const fullPath = parentField ? `${parentField}.${key}` : key

    if (changelogIgnoreFields.has(fullPath)) return

    const oldValue = existingDocument ? existingDocument[key] : undefined
    const newValue = updatedDocument ? updatedDocument[key] : undefined

    if (Array.isArray(oldValue) && Array.isArray(newValue)) {
      if (oldValue.length === 0 && newValue.length === 0) return

      if (!_.isEqual(_.sortBy(oldValue), _.sortBy(newValue))) {
        changes.push({ field: fullPath, oldValue, newValue })
      }
    } else if (
      typeof oldValue === 'object' &&
      oldValue !== null &&
      typeof newValue === 'object' &&
      newValue !== null &&
      !Array.isArray(oldValue)
    ) {
      changes.push(
        ...compareAndLogChanges(
          objectId,
          collection,
          changeType,
          oldValue as Record<string, any>,
          newValue as Record<string, any>,
          fullPath,
        ),
      )
    } else if (oldValue !== newValue) {
      changes.push({ field: fullPath, oldValue, newValue })
    }
  })

  return changes
}

function logChanges(
  objectId: string,
  collection: string,
  changeType: string,
  existingDocument: Record<string, any> | undefined,
  updatedDocument: Record<string, any> | null,
  parentField = '',
): FieldChange[] {
  const user = getUserName()
  const changes = compareAndLogChanges(
    objectId,
    collection,
    changeType,
    existingDocument,
    updatedDocument,
    parentField,
  )
  if (changes.length > 0 && user) {
    try {
      const changelogEntry = {
        objectId,
        collection,
        user,
        changeType,
        timestamp: new Date(),
        changes,
      }
      Changelog.insert(changelogEntry)
    } catch (error) {
      console.error(`Failed to insert changelog for ${collection}:`, error)
    }
  } else {
    console.info(`No changes detected for ${objectId} in ${collection}.`)
  }

  return changes
}

export { Changelog, FieldChange, logChanges }
