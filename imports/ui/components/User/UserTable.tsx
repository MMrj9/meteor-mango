import React from 'react'
import { Box } from '@chakra-ui/react'
import GenericTable from '../generic/table/Table'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'

const columns = [
  { key: 'username', label: 'Name' },
  { key: 'emails[0].address', label: 'email' },
  //   { key: '', label: 'Number of Employees' },
] as { key: keyof Meteor.User; label: string }[]

const UserTable: React.FC = () => {
  const data = useTracker(() => {
    if (Meteor.isClient) {
      const handle = Meteor.subscribe('user')
      if (handle.ready()) {
        return Meteor.users.find({}).fetch()
      }
    }

    return []
  }, [])

  return (
    <Box p={4}>
      <GenericTable
        collectionName="user"
        data={data}
        columns={columns}
        add={false}
      />
    </Box>
  )
}

export default UserTable
