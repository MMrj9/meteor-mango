import 'meteor/aldeed:collection2/dynamic'

//@ts-ignore
Collection2.load()

const Schema: any = {
  Company: null,
  User: null,
}

const TimestampedSchemaBase = {
  createdOn: {
    type: String,
    label: 'Created On',
  },
  updatedOn: {
    type: Date,
    label: 'Updated On',
    optional: true,
  },
}

const DisabledSchemaBase = {
  disabeld: {
    type: Boolean,
    optional: true,
  },
}

export { TimestampedSchemaBase, DisabledSchemaBase }
export default Schema
