import _ from 'lodash'
import { Meteor } from 'meteor/meteor'

function validateObject(value: object) {
  if (!_.isObject(value)) {
    throw new Meteor.Error('invalid-argument', `Invalid data`)
  }
}

export { validateObject }
