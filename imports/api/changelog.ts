import { Mongo } from 'meteor/mongo';
//@ts-ignore
import SimpleSchema from 'meteor/aldeed:simple-schema';
import Schema, { FieldProperties } from '.';
import { getUserName } from './user';
import { stripMetadata } from './utils/simpleSchema';

interface FieldChange {
  field: string;
  oldValue: any;
  newValue: any;
}

interface Changelog {
  _id?: string;
  objectId: string;
  collection: string;
  user: string;
  changeType: string;
  timestamp: Date;
  changes: FieldChange[];
}

const FieldChangeSchema = new SimpleSchema({
  field: {
    type: String,
    label: 'Field Name',
  },
  oldValue: {
    type: SimpleSchema.oneOf(String, Number, Boolean, Date),
    label: 'Old Value',
    optional: true,
  },
  newValue: {
    type: SimpleSchema.oneOf(String, Number, Boolean, Date),
    label: 'New Value',
  },
});


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
    optional: true,
  },
  'changes.$': {
    type: FieldChangeSchema,
    label: 'Field Change',
  },
};


Schema.Changelog = new SimpleSchema(stripMetadata(ChangelogSchema));

const Changelog = new Mongo.Collection<Changelog>('changelog');

//@ts-ignore
Changelog.attachSchema(Schema.Changelog);

const changelogIgnoreFields = new Set([
  'created_on',
  'updatedOn',
  'createdAt',
  'services',
  'emails',
]);

function compareAndLogChanges(
  objectId: string,
  collection: string,
  changeType: string,
  existingDocument: Record<string, any> | null,
  updatedDocument: Record<string, any>,
  parentField = '',
): FieldChange[] {
  const changes: FieldChange[] = [];
  for (const key in updatedDocument) {
    const fullPath = parentField ? `${parentField}.${key}` : key;

    if (changelogIgnoreFields.has(fullPath)) continue;

    const oldValue = existingDocument ? existingDocument[key] : undefined;
    const newValue = updatedDocument[key];

    if (typeof newValue === 'object' && newValue !== null && !Array.isArray(newValue)) {
      changes.push(
        ...compareAndLogChanges(
          objectId,
          collection,
          changeType,
          oldValue as Record<string, any>,
          newValue,
          fullPath,
        ),
      );
    } else if (oldValue !== newValue) {
      changes.push({ field: fullPath, oldValue, newValue });
    }
  }
  return changes;
}

function logChanges(
  objectId: string,
  collection: string,
  changeType: string,
  existingDocument: Record<string, any> | null,
  updatedDocument: Record<string, any>,
  parentField = '',
): FieldChange[] {
  const user = getUserName();
  const changes = compareAndLogChanges(objectId, collection, changeType, existingDocument, updatedDocument, parentField);

  if (changes.length > 0 && user) {
    try {
      Changelog.insert({
        objectId,
        collection,
        user,
        changeType,
        timestamp: new Date(),
        changes,
      });
    } catch (error) {
      console.error('Failed to insert changelog:', error);
    }
  }

  return changes;
}

export { Changelog, FieldChange, logChanges };
