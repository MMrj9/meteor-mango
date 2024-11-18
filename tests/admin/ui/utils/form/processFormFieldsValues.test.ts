import { FormFieldType } from '../../../../../imports/ui/components/generic/form/GenericForm'
import { processFormFieldsValues } from '/imports/ui/components/generic/form/utils'
import { assert } from 'chai'

//@ts-ignore
describe('processFormFieldsValues function', () => {
  const UserFormFields = {
    username: {
      label: 'Username',
      disabled: true,
      min: 5,
      max: 20,
    },
    'emails[0].address': {
      label: 'Email',
      disabled: true,
      min: 5,
      max: 50,
    },
    roles: {
      label: 'roles',
      type: FormFieldType.AUTOCOMPLETE,
      autocompleteOptions: [
        { value: 'admin', label: 'admin' },
        { value: 'manager', label: 'manager' },
        { value: 'basic', label: 'basic' },
      ],
    },
  }

  //@ts-ignore
  it('processFormFieldsValues should correctly handle autocomplete fields', () => {
    const input = {
      _id: '2CZ77sxvPLDnBa3Ng',
      emails: [
        {
          address: 'joaobaiao@gmail.com',
          verified: false,
        },
      ],
      profile: {},
      username: 'joaobaiao',
      roles: [
        {
          value: 'admin',
          label: 'admin',
        },
        {
          value: 'manager',
          label: 'manager',
        },
      ],
    }

    const expectedOutput = {
      _id: '2CZ77sxvPLDnBa3Ng',
      emails: [
        {
          address: 'joaobaiao@gmail.com',
          verified: false,
        },
      ],
      profile: {},
      username: 'joaobaiao',
      roles: ['admin', 'manager'],
    }

    const processedValues = processFormFieldsValues(UserFormFields, input)

    assert.deepEqual(processedValues, expectedOutput)
  })
})
