import { Meteor } from 'meteor/meteor'
import { BrandInterface, Brand } from '../../imports/api/brand'
import { validateObject } from '/imports/utils/object'
import { validateUserPermissions } from '/imports/api/user'
import { insertOrUpdate } from './common'

function validateBrand(brand: BrandInterface) {
  validateObject(brand)

  const { name } = brand

  if (!brand._id && Brand.findOne({ name })) {
    throw new Meteor.Error('not-unique', 'Brand with that name already exists.')
  }
}

Meteor.methods({
  'Brand.insertOrUpdate'(brand: BrandInterface) {
    validateUserPermissions()
    validateBrand(brand)
    insertOrUpdate('Brand', brand)
  },
})
