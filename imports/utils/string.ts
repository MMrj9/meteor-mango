import _ from 'lodash'
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'

const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const validateString = (
  field: string,
  value: string,
  minLength: number,
  maxLength: number,
) => {
  check(value, String)
  if (!_.inRange(value.length, minLength, maxLength + 1)) {
    throw new Meteor.Error(
      'invalid-argument',
      `${field} is required and must be between ${minLength} and ${maxLength} characters.`,
    )
  }
}

const truncate = (text: string, max: number) => {
  return text.length > max ? text.slice(0, max) + '...' : text
}

export { validateEmail, validateString, truncate }
