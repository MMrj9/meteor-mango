import { expect } from 'chai'
import { FieldProperties } from '/imports/api'
import { formatSimpleSchema } from '/imports/api/utils/simpleSchema'
import { FormFieldType } from '../../../imports/ui/components/generic/form/GenericForm'

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
        editable: false, // Metadata to strip
      },
      'user.name': {
        type: String,
        label: 'User Name',
        max: 50,
        editable: true, // Metadata to strip
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
})
