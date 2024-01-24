import _ from 'lodash'
import { Meteor } from 'meteor/meteor'

const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const validateString = (
  field: string,
  value: string,
  minLength: number,
  maxLength: number,
) => {
  if (
    !_.isString(value) ||
    !_.inRange(value.length, minLength, maxLength + 1)
  ) {
    throw new Meteor.Error(
      'invalid-argument',
      `${field} is required and must be between ${minLength} and ${maxLength} characters.`,
    )
  }
}

export { validateEmail, validateString }
