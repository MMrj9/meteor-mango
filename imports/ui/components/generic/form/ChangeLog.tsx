import React, { useState, useEffect } from 'react'
import { Table, Thead, Tbody, Tr, Th, Td, Spinner } from '@chakra-ui/react'
import { useTracker } from 'meteor/react-meteor-data'
import { Changelog, FieldChange } from '/imports/api/changelog'
import { formatTableData } from '../table/utils'
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { Meteor } from 'meteor/meteor'

interface ChangelogTableProps {
  collection: string
  objectId: string
}

const MainTable = ({ changelogs }: { changelogs: Changelog[] }) => {
  const [expandedChangelogs, setExpandedChangelogs] = useState<string[]>([])

  const onExpandCollapse = (changelogId: string) => {
    let updatedExpandedChangeLogs = [...expandedChangelogs]
    if (!expandedChangelogs.includes(changelogId)) {
      updatedExpandedChangeLogs.push(changelogId)
    } else {
      updatedExpandedChangeLogs = updatedExpandedChangeLogs.filter(
        (id) => id !== changelogId,
      )
    }
    setExpandedChangelogs(updatedExpandedChangeLogs)
  }

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Event Type</Th>
          <Th>User</Th>
          <Th>Timestamp</Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {changelogs.map((entry: Changelog) => (
          <React.Fragment key={entry._id}>
            <Tr>
              <Td>{entry.changeType}</Td>
              <Td>{entry.user}</Td>
              <Td>{new Date(entry.timestamp).toLocaleString()}</Td>
              <Td>
                <button onClick={() => onExpandCollapse(entry._id as string)}>
                  {expandedChangelogs.includes(entry._id as string) ? (
                    <ChevronUpIcon boxSize={4} />
                  ) : (
                    <ChevronDownIcon boxSize={4} />
                  )}
                </button>
              </Td>
            </Tr>
            {expandedChangelogs.includes(entry._id as string) && (
              <Tr>
                <Td colSpan={3}>
                  <NestedTable changes={entry.changes} />
                </Td>
              </Tr>
            )}
          </React.Fragment>
        ))}
      </Tbody>
    </Table>
  )
}

const NestedTable = ({ changes }: { changes: FieldChange[] }) => {
  return (
    <div>
      <Table>
        <Thead>
          <Tr>
            <Th>Field</Th>
            <Th>Old Value</Th>
            <Th>New Value</Th>
          </Tr>
        </Thead>
        <Tbody>
          {changes.map((change: FieldChange) => (
            <Tr key={change.field}>
              <Td>{change.field}</Td>
              <Td>{formatTableData(change.oldValue)}</Td>
              <Td>{formatTableData(change.newValue)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  )
}

const ChangelogTable = ({ collection, objectId }: ChangelogTableProps) => {
  const changelogs = useTracker(() => {
    if (Meteor.isClient) {
      Meteor.subscribe('Changelog', collection, objectId)
      return Changelog.find({ collection, objectId }).fetch()
    }
  })

  const loading = !changelogs

  if (loading) {
    return <Spinner size="lg" />
  }

  return <MainTable changelogs={changelogs} />
}

export default ChangelogTable
