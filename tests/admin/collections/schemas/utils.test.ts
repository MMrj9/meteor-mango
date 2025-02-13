import { expect } from 'chai'
import { CustomSchemaTypes, FieldProperties } from '/imports/api'
import { formatSimpleSchema } from '/imports/api/utils/simpleSchema'
import { FormFieldType } from '../../../../imports/ui/components/generic/form/GenericForm'
//@ts-ignore
import SimpleSchema from 'meteor/aldeed:simple-schema'

describe('formatSimpleSchema', () => {
  it('should strip unsupported metadata from a flat schema', () => {
    const schema: Record<string, FieldProperties> = {
      name: {
        type: String,
        label: 'Name',
        editable: true,
        min: 1,
      },
      age: {
        type: Number,
        label: 'Age',
        defaultValue: 18,
        formFieldType: FormFieldType.NUMBER,
      },
    }

    const result = formatSimpleSchema(schema)
    expect(result).to.deep.equal({
      name: {
        type: String,
        label: 'Name',
        min: 1,
      },
      age: {
        type: Number,
        label: 'Age',
        defaultValue: 18,
      },
    })
  })

  it('should strip unsupported metadata from a nested schema', () => {
    const schema: Record<string, FieldProperties> = {
      user: {
        type: Object,
        label: 'User',
        editable: false,
      },
      'user.name': {
        type: String,
        label: 'User Name',
        max: 50,
        editable: true,
      },
      'user.age': {
        type: Number,
        label: 'User Age',
        min: 0,
        max: 100,
      },
    }

    const result = formatSimpleSchema(schema)
    expect(result).to.deep.equal({
      user: {
        type: Object,
        label: 'User',
      },
      'user.name': {
        type: String,
        label: 'User Name',
        max: 50,
      },
      'user.age': {
        type: Number,
        label: 'User Age',
        min: 0,
        max: 100,
      },
    })
  })

  it('should format array fields with schema correctly', () => {
    const schema: Record<string, FieldProperties> = {
      tags: {
        type: Array,
        label: 'Tags',
      },
      'tags.$': {
        type: String,
        label: 'Tag',
      },
    }

    const result = formatSimpleSchema(schema)
    expect(result).to.deep.equal({
      tags: {
        type: Array,
        label: 'Tags',
      },
      'tags.$': {
        type: String,
        label: 'Tag',
      },
    })
  })

  it('should handle a schema with CustomSchemaTypes.ANY correctly', () => {
    const schema: Record<string, FieldProperties> = {
      dynamicField: {
        type: CustomSchemaTypes.ANY,
        label: 'Dynamic Field',
      },
    }

    const result = formatSimpleSchema(schema)
    expect(result).to.deep.equal({
      dynamicField: {
        type: SimpleSchema.oneOf(String, Number, Boolean, Date),
        label: 'Dynamic Field',
      },
    })
  })

  it('should return an empty object for unsupported fields', () => {
    const schema: Record<string, FieldProperties> = {
      fieldName: {
        unsupportedProp: 'value',
      } as any,
    }

    const result = formatSimpleSchema(schema)
    expect(result).to.deep.equal({ fieldName: {} })
  })

  it('should handle an empty schema gracefully', () => {
    const schema: Record<string, FieldProperties> = {}

    const result = formatSimpleSchema(schema)
    expect(result).to.deep.equal({})
  })

  it('should handle a schema with no removable metadata', () => {
    const schema: Record<string, FieldProperties> = {
      username: {
        type: String,
        label: 'Username',
        optional: true,
      },
    }

    const result = formatSimpleSchema(schema)
    expect(result).to.deep.equal({
      username: {
        type: String,
        label: 'Username',
        optional: true,
      },
    })
  })

  it('should handle nested object schemas with array fields correctly', () => {
    const schema: Record<string, FieldProperties> = {
      users: {
        type: Array,
        label: 'Users',
      },
      'users.$': {
        type: Object,
        label: 'User',
      },
      'users.$.name': {
        type: String,
        label: 'Name',
      },
      'users.$.age': {
        type: Number,
        label: 'Age',
      },
    }

    const result = formatSimpleSchema(schema)
    expect(result).to.deep.equal({
      users: {
        type: Array,
        label: 'Users',
      },
      'users.$': {
        type: Object,
        label: 'User',
      },
      'users.$.name': {
        type: String,
        label: 'Name',
      },
      'users.$.age': {
        type: Number,
        label: 'Age',
      },
    })
  })
})
