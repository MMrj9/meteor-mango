import { FormFieldType } from '/imports/ui/components/generic/form/Form'
import { processFormFieldsValues } from '/imports/ui/components/generic/form/utils'
import { assert } from 'chai'
import { UserFormFields } from '/imports/ui/pages/admin/User/UserForm'

//@ts-ignore
describe('generateFormFields function', () => {

  it('generateFormFields Company', () => {
    const inputValues = {
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

    const processedValues = processFormFieldsValues(UserFormFields, inputValues)

    assert.deepEqual(processedValues, expectedOutput)
  })

  // Add more tests as needed
})
