import { Meteor } from 'meteor/meteor'
import {
  BrandCategoryInterface,
  BrandCategory,
} from '../../imports/api/brandCategory'
import { validateObject } from '/imports/utils/object'
import { validateUserPermissions } from '/imports/api/user'
import { insertOrUpdate } from './common'
import { WebApp } from 'meteor/webapp'

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
  'BrandCategory.getActive'() {
    const activeBrandCategories = BrandCategory.find({
      disabled: false,
    }).fetch()
    return activeBrandCategories
  },
})

WebApp.connectHandlers.use('/api/brand-categories', (req, res, next) => {
  const activeBrandCategories = Meteor.call('BrandCategory.getActive')
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(activeBrandCategories))
})
