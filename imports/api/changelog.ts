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
    type: CustomSchemaTypes.ANY,
    label: 'Old Value',
    optional: true,
  },
  newValue: {
    type: CustomSchemaTypes.ANY,
    label: 'New Value',
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

const Changelog = new Mongo.Collection<Changelog>('changelog')

Schemas.Changelog = ChangelogSchema
Collections.Changelog = Changelog

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
  updatedDocument: Record<string, any>,
  parentField = '',
): FieldChange[] {
  const changes: FieldChange[] = []

  for (const key in updatedDocument) {
    const fullPath = parentField ? `${parentField}.${key}` : key

    if (changelogIgnoreFields.has(fullPath)) continue

    const oldValue = existingDocument ? existingDocument[key] : undefined
    const newValue = updatedDocument[key]

    if (Array.isArray(oldValue) && Array.isArray(newValue)) {
      // Treat empty arrays as equivalent
      if (oldValue.length === 0 && newValue.length === 0) {
        continue
      }

      // Compare sorted arrays to account for order-independent equality
      if (!_.isEqual(_.sortBy(oldValue), _.sortBy(newValue))) {
        changes.push({ field: fullPath, oldValue, newValue })
      }
    } else if (
      typeof newValue === 'object' &&
      newValue !== null &&
      !Array.isArray(newValue)
    ) {
      // Recursively compare nested objects
      changes.push(
        ...compareAndLogChanges(
          objectId,
          collection,
          changeType,
          oldValue as Record<string, any>,
          newValue,
          fullPath,
        ),
      )
    } else if (oldValue !== newValue) {
      changes.push({ field: fullPath, oldValue, newValue })
    }
  }

  return changes
}

function logChanges(
  objectId: string,
  collection: string,
  changeType: string,
  existingDocument: Record<string, any> | undefined,
  updatedDocument: Record<string, any>,
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
