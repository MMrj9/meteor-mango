import React, { useState } from 'react'
import { Box, useToast } from '@chakra-ui/react'
import GenericTable from '../../../components/generic/table/Table'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data' // Import useTracker
import {
  DisabledTableFilter,
  SelectedFilters,
  TableFilter,
  buildQueryFromSelectedFilters,
} from '../../../components/generic/filters/Filters'
import {
  ActionFailedToastData,
  ActionSuccessToastData,
  BaseDisableAction,
  BaseEnableAction,
  DisableActionEffect,
  EnableActionEffect,
} from '../../../components/generic/actions/Actions'
import { Ticket } from '/imports/api/ticket'

const CollectionName = 'Ticket'

const Columns = [
  { key: 'type', label: 'Type' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'subject', label: 'Subject' },
] as { key: keyof Ticket; label: string }[]

const Filters: TableFilter<SelectedFilters>[] = [DisabledTableFilter]

const TicketTable: React.FC = () => {
  const toast = useToast()
  const [selectedFilters, setSelectedFilters] = useState({})

  const data = useTracker(() => {
    if (Meteor.isClient) {
      const handle = Meteor.subscribe(CollectionName)
      if (handle.ready()) {
        const query = buildQueryFromSelectedFilters(Filters, selectedFilters)
        return Ticket.find(query).fetch()
      }
    }

    return []
  }, [selectedFilters])

  const handleDisableAction = async (id: string) => {
    try {
      await DisableActionEffect(CollectionName, id)
      toast(ActionSuccessToastData)
    } catch (error) {
      toast(ActionFailedToastData)
    }
  }

  const handleEnableAction = async (id: string) => {
    try {
      await EnableActionEffect(CollectionName, id)
      toast(ActionSuccessToastData)
    } catch (error) {
      toast(ActionFailedToastData)
    }
  }

  const Actions = [
    {
      ...BaseDisableAction,
      effect: handleDisableAction,
    },
    {
      ...BaseEnableAction,
      effect: handleEnableAction,
    },
  ]

  return (
    <Box p={4}>
      <GenericTable
        collectionName={CollectionName}
        data={data}
        columns={Columns}
        filters={Filters}
        //@ts-ignore
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
        actions={Actions}
        add={false}
      />
    </Box>
  )
}

export default TicketTable
