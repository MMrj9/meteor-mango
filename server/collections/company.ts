import { Meteor } from 'meteor/meteor'
import { Company } from '/imports/api/company'
import { validateObject } from '/imports/utils/object'
import { validateUserPermissions } from '/imports/api/user'

function validateCompany(company: Company) {
  validateObject(company)

  const { name } = company

  if (!company._id && Company.findOne({ name })) {
    throw new Meteor.Error(
      'not-unique',
      'Company with that name already exists.',
    )
  }
}

Meteor.methods({
  'company.insertOrUpdate'(company: Company) {
    validateUserPermissions()
    validateCompany(company)

    if (company._id) {
      company.updated_on = new Date()
      Company.update(company._id, { $set: company })
    } else {
      company.createdOn = new Date()
      Company.insert(company)
    }
  },
})
