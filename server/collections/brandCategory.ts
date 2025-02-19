import { Meteor } from 'meteor/meteor'
import {
  BrandCategoryInterface,
  BrandCategory,
} from '../../imports/api/brandCategory'
import { validateObject } from '/imports/utils/object'
import { validateUserPermissions } from '/imports/api/user'
import { insertOrUpdate } from './common'

function validateBrandCategory(brandCategory: BrandCategoryInterface) {
  validateObject(brandCategory)

  const { name } = brandCategory

  if (!brandCategory._id && BrandCategory.findOne({ name })) {
    throw new Meteor.Error('not-unique', 'Brand with that name already exists.')
  }
}

Meteor.methods({
  'BrandCategory.insertOrUpdate'(brandCategory: BrandCategoryInterface) {
    validateUserPermissions()
    validateBrandCategory(brandCategory)
    insertOrUpdate('BrandCategory', brandCategory)
  },
})
