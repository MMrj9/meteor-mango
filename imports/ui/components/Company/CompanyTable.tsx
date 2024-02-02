import React, { useState } from 'react'
import { Box, useToast } from '@chakra-ui/react'
import GenericTable from '../generic/table/Table'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data' // Import useTracker
import { Company } from '/imports/api/company'
import {
  DisabledTableFilter,
  SelectedFilters,
  TableFilter,
  buildQueryFromSelectedFilters,
} from '../generic/filters/Filters'
import {
  ActionFailedToastData,
  ActionSuccessToastData,
  BaseDisableAction,
  BaseEnableAction,
  DisableActionEffect,
  EnableActionEffect,
} from '../generic/actions/Actions'

const CollectionName = 'company'

const Columns = [
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' },
  { key: 'numberOfEmployees', label: 'Number of Employees' },
  { key: 'createdOn', label: 'Created On' },
] as { key: keyof Company; label: string }[]

const Filters: TableFilter<SelectedFilters>[] = [DisabledTableFilter]

const CompanyTable: React.FC = () => {
  const toast = useToast()
  const [selectedFilters, setSelectedFilters] = useState({})

  const data = useTracker(() => {
    if (Meteor.isClient) {
      const handle = Meteor.subscribe(CollectionName)
      if (handle.ready()) {
        const query = buildQueryFromSelectedFilters(Filters, selectedFilters)
        return Company.find(query).fetch()
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
      />
    </Box>
  )
}

export default CompanyTable
