import React, { useState } from 'react'
import { Box, useToast } from '@chakra-ui/react'
import GenericTable from '../../../components/generic/table/Table'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data' // Import useTracker
import { Notification } from '/imports/api/notification'
import {
  DisabledTableFilter,
  NonDisabledFilter,
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

const CollectionName = 'Notification'

const Columns = [
  { key: 'content', label: 'Content' },
  { key: 'createdOn', label: 'Created On' },
] as { key: keyof Notification; label: string }[]

const AlreadyReadTableFilter: TableFilter<SelectedFilters> = {
  key: 'active',
  label: 'Read/Unread',
  type: 'dropdown',
  options: [
    { label: 'All', value: null },
    {
      label: 'Unread',
      value: NonDisabledFilter,
    },
    { label: 'Read', value: { disabled: true } },
  ],
}

const Filters: TableFilter<SelectedFilters>[] = [AlreadyReadTableFilter]

const NotificationTable: React.FC = () => {
  const toast = useToast()
  const [selectedFilters, setSelectedFilters] = useState({})

  const data = useTracker(() => {
    if (Meteor.isClient) {
      const handle = Meteor.subscribe(CollectionName)
      if (handle.ready()) {
        const query = buildQueryFromSelectedFilters(Filters, selectedFilters)
        return Notification.find(query).fetch()
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
      label: 'Mark as read',
      effect: handleDisableAction,
    },
    {
      ...BaseEnableAction,
      label: 'Mark as unread',
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

export default NotificationTable
