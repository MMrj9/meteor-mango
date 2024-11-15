import { expect } from 'chai';
import { FormFieldType } from '/imports/ui/components/generic/form/Form';
import { generateFormFields, getDisabledProperty, getTypeProperty } from '/imports/ui/components/generic/form/formFieldsGenerator';
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
    description: {
      type: String,
      // No label provided
    },
  };

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
    };

    const result = generateFormFields(mockSchema);

    expect(result).to.deep.equal(expectedFormFields);
  });

  it('should ignore fields without a label', () => {
    const result = generateFormFields(mockSchema);
    expect(result).to.not.have.property('description');
  });
});

describe('getDisabledProperty', () => {
  it('should return true when editable is false', () => {
    const fieldProperties = { type: String, editable: false };
    expect(getDisabledProperty(fieldProperties)).to.be.true;
  });

  it('should return false when editable is true', () => {
    const fieldProperties = { type: String, editable: true };
    expect(getDisabledProperty(fieldProperties)).to.be.false;
  });

  it('should return false when editable is not defined', () => {
    const fieldProperties = {type: String};
    expect(getDisabledProperty(fieldProperties)).to.be.false;
  });
});

describe('getTypeProperty', () => {
  it('should return FormFieldType.TEXT for String type', () => {
    const fieldProperties = { type: String };
    expect(getTypeProperty(fieldProperties)).to.equal(FormFieldType.TEXT);
  });

  it('should return FormFieldType.NUMBER for SimpleSchema.Integer type', () => {
    const fieldProperties = { type: SimpleSchema.Integer };
    expect(getTypeProperty(fieldProperties)).to.equal(FormFieldType.NUMBER);
  });

  it('should return FormFieldType.ARRAY for Array type', () => {
    const fieldProperties = { type: Array };
    expect(getTypeProperty(fieldProperties)).to.equal(FormFieldType.ARRAY);
  });

  it('should return FormFieldType.TEXT for unrecognized type', () => {
    const fieldProperties = { type: Boolean };
    expect(getTypeProperty(fieldProperties)).to.equal(FormFieldType.TEXT);
  });
});
