import { processValues } from '/imports/ui/components/generic/form/utils'
import { assert } from 'chai'

//@ts-ignore
describe('processValues function', () => {
  const UserFormFields = {
    username: {
      label: 'Username',
      disabled: true,
      minCharacters: 5,
      maxCharacters: 20,
    },
    'emails[0].address': {
      label: 'Email',
      disabled: true,
      minCharacters: 5,
      maxCharacters: 50,
    },
    roles: {
      label: 'roles',
      type: 'autocomplete',
      autocompleteOptions: [
        { value: 'admin', label: 'admin' },
        { value: 'manager', label: 'manager' },
        { value: 'basic', label: 'basic' },
      ],
    },
  }

  //@ts-ignore
  it('processValues should correctly handle autocomplete fields', () => {
    const inputValues = {
      _id: '2CZ77sxvPLDnBa3Ng',
      emails: [
        {
          address: 'miguelmorujao@gmail.com',
          verified: false,
        },
      ],
      profile: {},
      username: 'miguelmorujao',
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
          address: 'miguelmorujao@gmail.com',
          verified: false,
        },
      ],
      profile: {},
      username: 'miguelmorujao',
      roles: ['admin', 'manager'],
    }

    const processedValues = processValues(UserFormFields, inputValues)

    assert.deepEqual(processedValues, expectedOutput)
  })

  // Add more tests as needed
})
