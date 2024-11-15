import { pick } from 'lodash';
import { FieldProperties, SimpleSchemaField } from '..'; // Adjust to your project structure

interface SimpleSchemaCompatible {
  [key: string]: SimpleSchemaField | SimpleSchemaCompatible;
}

const SUPPORTED_SIMPLESCHEMA_FIELDS = [
  'type',
  'label',
  'optional',
  'min',
  'max',
  'defaultValue',
  'allowedValues',
  'autoValue',
  'custom',
  'blackbox',
  'decimal',
  'exclusiveMin',
  'exclusiveMax',
  'regEx',
];

// Utility function to strip metadata for SimpleSchema
const stripMetadata = (schema: Record<string, FieldProperties>): SimpleSchemaCompatible => {
  const simpleSchemaCompatible: SimpleSchemaCompatible = {};

  for (const key in schema) {
    const field = schema[key];

    if (field && typeof field === 'object' && field.type && typeof field.type === 'object') {
      // Recursively handle nested fields
      // @ts-ignore
      simpleSchemaCompatible[key] = stripMetadata(field as Record<string, FieldProperties>);
    } else {
      simpleSchemaCompatible[key] = pick(field, SUPPORTED_SIMPLESCHEMA_FIELDS) as SimpleSchemaField;
    }
  }

  return simpleSchemaCompatible;
};

export { SimpleSchemaField, stripMetadata };
