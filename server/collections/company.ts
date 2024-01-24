import { Meteor } from 'meteor/meteor'
import { Company, CompanyFields } from '/imports/api/company'
import { validateObject } from '/imports/utils/object'
import { validateString } from '/imports/utils/string'

function validateCompany(company: Company) {
  validateObject(company)

  const { name, description } = company

  validateString(
    'Name',
    name,
    CompanyFields.name.minCharacters,
    CompanyFields.name.maxCharacters,
  )
  validateString(
    'Description',
    description,
    CompanyFields.description.minCharacters,
    CompanyFields.description.maxCharacters,
  )

  if (Company.findOne({ name })) {
    throw new Meteor.Error('username-taken', 'Username is already taken.')
  }
}

Meteor.methods({
  'company.insertOrUpdate'(company: Company) {
    validateCompany(company)

    if (company._id) {
      company.updated_on = new Date()
      Company.update(company._id, { $set: company })
    } else {
      company.created_on = new Date()
      Company.insert(company)
    }
  },
})

export { CompanyFields }
