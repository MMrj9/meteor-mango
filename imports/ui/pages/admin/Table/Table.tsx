import React, { useEffect, useState } from 'react'
import { Box, useToast } from '@chakra-ui/react'
import GenericTable from '../../../components/generic/table/Table'
import { SelectedFilters } from '../../../components/generic/filters/Filters'
import { generateTableFields } from '/imports/ui/components/generic/table/tableFieldsGenerator'
import { Actions, Filters, Schemas } from '/imports/api'
import { useReactiveCollectionData } from '/imports/ui/components/generic/table/data'

interface TableProps {
  collectionName: string
  basicView?: boolean
  defaultQuery?: Record<string, any>
}

const Table: React.FC<TableProps> = ({
  collectionName,
  basicView,
  defaultQuery,
}) => {
  const toast = useToast()
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({})
  const [tableFields, setTableFields] = useState([])
  const schema = Schemas[collectionName]
  const actions = Actions[collectionName]
  const filters = Filters[collectionName]

  const data = useReactiveCollectionData(
    collectionName,
    filters,
    selectedFilters,
    defaultQuery,
  )

  useEffect(() => {
    if (schema) {
      setTableFields(generateTableFields(schema) as any)
    }
  }, [schema])

  return (
    <Box p={4}>
      <GenericTable
        collectionName={collectionName}
        data={data}
        columns={tableFields}
        filters={filters}
        //@ts-ignore
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
        actions={actions}
        toast={toast}
        basicView={basicView}
      />
    </Box>
  )
}

export default Table
