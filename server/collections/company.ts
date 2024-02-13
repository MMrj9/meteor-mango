import { Meteor } from 'meteor/meteor'
import { Company } from '/imports/api/company'
import { validateObject } from '/imports/utils/object'
import { validateUserPermissions } from '/imports/api/user'
import { logChanges } from '/imports/api/changelog'

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
      const existingCompany = Company.findOne(company._id)

      logChanges(company._id, 'company', 'update', existingCompany, company)

      company.updatedOn = new Date()
      Company.update(company._id, { $set: company })
    } else {
      company.createdOn = new Date()
      const _id = Company.insert(company)

      logChanges(_id, 'company', 'create', {}, company)
    }
  },
})
