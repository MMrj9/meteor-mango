import { Mongo } from 'meteor/mongo'
//@ts-ignore
import SimpleSchema from 'meteor/aldeed:simple-schema'
import Schema from '.'
import { getUserName } from './user'

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

Schema.Changelog = new SimpleSchema({
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
    optional: true,
  },
  'changes.$': {
    type: Object,
    label: 'Field Change',
  },
  'changes.$.field': {
    type: String,
    label: 'Field Name',
  },
  'changes.$.oldValue': {
    type: SimpleSchema.oneOf(String, Number, Boolean, Date), // Adjust types as needed
    label: 'Old Value',
    optional: true,
  },
  'changes.$.newValue': {
    type: SimpleSchema.oneOf(String, Number, Boolean, Date), // Adjust types as needed
    label: 'New Value',
  },
})

const Changelog = new Mongo.Collection<Changelog>('changelog')

//@ts-ignore
Changelog.attachSchema(Schema.Changelog)

const changelogIgnoreFields = [
    'created_on', 'updated_on', 'createdAt', 'services', 'emails'
]


function logChanges(
  objectId: string,
  collection: string,
  changeType: string,
  existingDocument: any,
  updatedDocument: any,
  parentField = '',
) {
  const user = getUserName();
  const changes: FieldChange[] = [];

  Object.keys(updatedDocument).forEach((field) => {
    const fullPath = parentField ? `${parentField}.${field}` : field;

    if (
      updatedDocument[field] !== existingDocument[field] &&
      !changelogIgnoreFields.includes(fullPath)
    ) {
      if (typeof updatedDocument[field] === 'object' && updatedDocument[field] !== null) {
        // If the field is an object, recursively log changes for each nested field
        const nestedChanges = logChanges(
          objectId,
          collection,
          changeType,
          existingDocument[field],
          updatedDocument[field],
          fullPath,
        );
        changes.push(...nestedChanges);
      } else {
        changes.push({
          field: fullPath,
          oldValue: existingDocument[field],
          newValue: updatedDocument[field],
        });
      }
    }
  });

  if (changes.length > 0) {
    Changelog.insert({
      objectId,
      collection,
      user,
      changeType,
      timestamp: new Date(),
      changes,
    });
  }

  return changes;
}

export { Changelog, FieldChange, logChanges }
