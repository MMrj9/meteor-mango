import 'meteor/aldeed:collection2/dynamic'

//@ts-ignore
Collection2.load()

const Schema: any = {
  Company: null,
  User: null,
}

const TimestampedSchemaBase = {
  createdOn: {
    type: Date, // Change type to Date for consistency
    label: 'Created On',
  },
  updatedOn: {
    type: Date,
    label: 'Updated On',
    optional: true,
  },
}

const DisabledSchemaBase = {
  disabled: {
    type: Boolean,
    optional: true,
  },
}

export { TimestampedSchemaBase, DisabledSchemaBase }
export default Schema
