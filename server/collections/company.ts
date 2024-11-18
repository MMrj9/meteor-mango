import { Meteor } from 'meteor/meteor'
import { Company } from '/imports/api/company'
import { validateObject } from '/imports/utils/object'
import { validateUserPermissions } from '/imports/api/user'
import { insertOrUpdate } from './common'

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
  'Company.insertOrUpdate'(company: Company) {
    validateUserPermissions()
    validateCompany(company)
    insertOrUpdate('Company', company)
  },
})
