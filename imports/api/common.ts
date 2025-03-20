export interface Timestamped {
  createdOn?: Date
  updatedOn?: Date
}

export interface Disabled {
  disabled?: boolean
}

export const commonStringArray = {
  type: Array,
  optional: true,
}

export const commonStringArrayItem = {
  type: String,
}
