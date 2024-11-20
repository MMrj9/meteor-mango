import React, { useState } from 'react'
import { Box, useToast } from '@chakra-ui/react'
import GenericTable from '../../../components/generic/table/Table'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
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
import { generateTableFields } from '/imports/ui/components/generic/table/tableFieldsGenerator'
import { Collections, Schemas } from '/imports/api'

interface FormProps {
  collectionName: string
}

const Filters: TableFilter<SelectedFilters>[] = [DisabledTableFilter]

const CompanyTable: React.FC<FormProps> = ({ collectionName }) => {
  const toast = useToast()
  const [selectedFilters, setSelectedFilters] = useState({})
  console.log(Schemas, collectionName)
  const schema = Schemas[collectionName]
  const collection = Collections[collectionName]
  const TableFields = generateTableFields(schema)

  const data = useTracker(() => {
    if (Meteor.isClient) {
      const handle = Meteor.subscribe(collectionName)
      if (handle.ready()) {
        const query = buildQueryFromSelectedFilters(Filters, selectedFilters)
        console.log(collectionName, collection, query)
        return collection.find(query).fetch()
      }
    }

    return []
  }, [selectedFilters])

  const handleDisableAction = async (id: string) => {
    try {
      await DisableActionEffect(collectionName, id)
      toast(ActionSuccessToastData)
    } catch (error) {
      toast(ActionFailedToastData)
    }
  }

  const handleEnableAction = async (id: string) => {
    try {
      await EnableActionEffect(collectionName, id)
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
        collectionName={collectionName}
        data={data}
        columns={TableFields}
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
