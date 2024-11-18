import { expect } from 'chai'
import { FormFieldType } from '../../../../../imports/ui/components/generic/form/GenericForm'
import {
  generateFormFields,
  generateDefaultValues,
  getDisabledProperty,
  getTypeProperty,
  getMinProperty,
  getMaxProperty,
  getFormatProperty,
  getAutocompleteOptions,
} from '/imports/ui/components/generic/form/formFieldsGenerator'
// @ts-ignore
import SimpleSchema from 'meteor/aldeed:simple-schema'

describe('generateFormFields', () => {
  const mockSchema = {
    name: {
      type: String,
      label: 'Name',
      editable: true,
    },
    age: {
      type: SimpleSchema.Integer,
      label: 'Age',
      editable: false,
    },
    tags: {
      type: Array,
      label: 'Tags',
    },
    createdAt: {
      type: Date,
      label: 'Created At',
    },
    description: {
      type: String,
    },
  }

  it('should generate form fields based on schema', () => {
    const expectedFormFields = {
      name: {
        label: 'Name',
        disabled: false,
        type: FormFieldType.TEXT,
      },
      age: {
        label: 'Age',
        disabled: true,
        type: FormFieldType.NUMBER,
      },
      tags: {
        label: 'Tags',
        disabled: false,
        type: FormFieldType.ARRAY,
      },
      createdAt: {
        label: 'Created At',
        disabled: false,
        type: FormFieldType.TEXT,
      },
    }

    const result = generateFormFields(mockSchema)

    expect(result).to.deep.equal(expectedFormFields)
  })

  it('should ignore fields without a label', () => {
    const result = generateFormFields(mockSchema)
    expect(result).to.not.have.property('description')
  })

  it('should not include undefined properties', () => {
    const result = generateFormFields(mockSchema)
    Object.values(result).forEach((field) => {
      expect(Object.values(field)).to.not.include(undefined)
    })
  })

  it('should handle an empty schema', () => {
    const result = generateFormFields({})
    expect(result).to.deep.equal({})
  })

  it('should handle schema with only unrecognized types', () => {
    const mockSchema = {
      randomField: { type: Function, label: 'Random Field' },
    }
    const result = generateFormFields(mockSchema)
    expect(result).to.deep.equal({
      randomField: {
        label: 'Random Field',
        disabled: false,
        type: FormFieldType.TEXT,
      },
    })
  })
})

describe('generateDefaultValues', () => {
  const mockSchema = {
    name: { type: String },
    age: { type: SimpleSchema.Integer },
    active: { type: Boolean },
    tags: { type: Array },
    createdAt: { type: Date },
    extraField: { type: Object, defaultValue: { nested: true } },
  }

  it('should generate default values for various field types', () => {
    const result = generateDefaultValues(mockSchema)

    expect(result).to.have.property('name', '')
    expect(result).to.have.property('age', 0)
    expect(result).to.have.property('active', false)
    expect(result).to.have.property('tags').that.is.an('array').that.is.empty
    expect(result).to.have.property('createdAt').that.is.instanceOf(Date)
    expect(result)
      .to.have.property('extraField')
      .that.deep.equals({ nested: true })
  })

  it('should handle empty schema gracefully', () => {
    const result = generateDefaultValues({})
    expect(result).to.deep.equal({})
  })

  it('should prioritize defaultValue if defined', () => {
    const customSchema = {
      customField: { type: String, defaultValue: 'Default' },
    }
    const result = generateDefaultValues(customSchema)
    expect(result).to.have.property('customField', 'Default')
  })
})

describe('getDisabledProperty', () => {
  it('should return true when editable is false', () => {
    const fieldProperties = { type: String, editable: false }
    expect(getDisabledProperty(fieldProperties)).to.be.true
  })

  it('should return false when editable is true', () => {
    const fieldProperties = { type: String, editable: true }
    expect(getDisabledProperty(fieldProperties)).to.be.false
  })

  it('should return false when editable is not defined', () => {
    const fieldProperties = { type: String }
    expect(getDisabledProperty(fieldProperties)).to.be.false
  })
})

describe('getTypeProperty', () => {
  it('should return FormFieldType.TEXT for String type', () => {
    const fieldProperties = { type: String }
    expect(getTypeProperty(fieldProperties)).to.equal(FormFieldType.TEXT)
  })

  it('should return FormFieldType.NUMBER for SimpleSchema.Integer type', () => {
    const fieldProperties = { type: SimpleSchema.Integer }
    expect(getTypeProperty(fieldProperties)).to.equal(FormFieldType.NUMBER)
  })

  it('should return FormFieldType.NUMBER for Number type', () => {
    const fieldProperties = { type: Number }
    expect(getTypeProperty(fieldProperties)).to.equal(FormFieldType.NUMBER)
  })

  it('should return FormFieldType.CHECKBOX for Boolean type', () => {
    const fieldProperties = { type: Boolean }
    expect(getTypeProperty(fieldProperties)).to.equal(FormFieldType.CHECKBOX)
  })

  it('should return FormFieldType.ARRAY for Array type', () => {
    const fieldProperties = { type: Array }
    expect(getTypeProperty(fieldProperties)).to.equal(FormFieldType.ARRAY)
  })

  it('should return FormFieldType.TEXT for unrecognized type', () => {
    const fieldProperties = { type: Object }
    expect(getTypeProperty(fieldProperties)).to.equal(FormFieldType.TEXT)
  })
})

describe('getMinProperty', () => {
  it('should return the min value if defined', () => {
    const fieldProperties = { type: Number, min: 5 }
    expect(getMinProperty(fieldProperties)).to.equal(5)
  })

  it('should return undefined if min is not defined', () => {
    const fieldProperties = { type: Number }
    expect(getMinProperty(fieldProperties)).to.be.undefined
  })
})

describe('getMaxProperty', () => {
  it('should return the max value if defined', () => {
    const fieldProperties = { type: Number, max: 10 }
    expect(getMaxProperty(fieldProperties)).to.equal(10)
  })

  it('should return undefined if max is not defined', () => {
    const fieldProperties = { type: Number }
    expect(getMaxProperty(fieldProperties)).to.be.undefined
  })
})

describe('getFormatProperty', () => {
  it('should return the format function if defined', () => {
    const formatFn = (value: any) => `formatted-${value}`
    const fieldProperties = { type: String, format: formatFn }
    expect(getFormatProperty(fieldProperties)).to.equal(formatFn)
  })

  it('should return undefined if format is not defined', () => {
    const fieldProperties = { type: String }
    expect(getFormatProperty(fieldProperties)).to.be.undefined
  })
})

describe('getAutocompleteOptions', () => {
  it('should return autocomplete options if defined', () => {
    const options = [{ value: '1', label: 'Option 1' }]
    const fieldProperties = { type: Array, autocompleteOptions: options }
    expect(getAutocompleteOptions(fieldProperties)).to.deep.equal(options)
  })

  it('should return undefined if autocompleteOptions is not defined', () => {
    const fieldProperties = { type: Array }
    expect(getAutocompleteOptions(fieldProperties)).to.be.undefined
  })
})
