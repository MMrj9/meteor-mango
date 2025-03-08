import { Meteor } from 'meteor/meteor'
import { WebApp } from 'meteor/webapp'
import { BrandInterface, Brand } from '../../imports/api/brand'
import { validateObject } from '/imports/utils/object'
import { validateUserPermissions } from '/imports/api/user'
import { insertOrUpdate } from './common'
import { WebApp } from 'meteor/webapp'

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
  'Brand.getActive'() {
    const activeBrands = Brand.find({ disabled: false }).fetch()
    return activeBrands
  },
})

WebApp.connectHandlers.use('/api/brands', (req, res, next) => {
  const activeBrands = Meteor.call('Brand.getActive')
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(activeBrands))
})
