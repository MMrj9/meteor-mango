import React, { useState, useEffect } from 'react'
import {
  Box,
  Table,
  Text,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
  Button,
  Icon,
  Flex,
  Heading,
  Input,
  Select,
  Checkbox,
  CreateToastFnReturn,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import {
  AddIcon,
  SearchIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons'
import _ from 'lodash'
import { formatTableData } from './utils'
import { TableFilter, TableFilterOption } from '../filters/Filters'
import { Action } from '../actions/Actions'

interface GenericTableProps {
  data: Record<string, any>[]
  columns: { key: string; label: string }[]
  collectionName: string
  add?: boolean
  filters?: TableFilter[]
  selectedFilters?: { [key: string]: any }
  setSelectedFilters?: (prevFilters: { [key: string]: any }) => void
  actions?: Action[]
  bulkActions?: Action[]
  toast: CreateToastFnReturn
  basicView?: boolean
  allowCreate?: boolean
}

const GenericTable = ({
  data,
  columns,
  collectionName,
  filters = [],
  selectedFilters,
  setSelectedFilters,
  actions,
  bulkActions = [],
  toast,
  allowCreate = true,
  basicView = false,
}: GenericTableProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: 'asc' | 'desc' | null
  }>({
    key: 'createdOn',
    direction: 'desc',
  })
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [selectedBulkAction, setSelectedBulkAction] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 50

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }

    setSortConfig({ key, direction })
  }

  const handleFilterChange = (key: string, value: any) => {
    setSelectedFilters?.((prevFilters: any) => {
      return { ...prevFilters, [key]: value }
    })
  }

  const getSortIcon = (key: string) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? (
        <ChevronUpIcon />
      ) : (
        <ChevronDownIcon />
      )
    }
    return null
  }

  const sortedData = () => {
    if (sortConfig.key) {
      //@ts-ignore
      return _.orderBy(data, [sortConfig.key], [sortConfig.direction])
    }
    return data
  }

  const filteredData = sortedData().filter((item) => {
    return columns.some((column) => {
      const cellValue = _.get(item, column.key)
      return (
        cellValue &&
        cellValue.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
  })

  const handleRowSelect = (id: string) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id],
    )
  }

  const handleBulkAction = () => {
    const selectedAction = bulkActions.find(
      (action) => action.label === selectedBulkAction,
    )
    if (selectedAction) {
      const selectedItems = data.filter((item) =>
        selectedRows.includes(item._id),
      )
      selectedAction.effect(collectionName, selectedItems, toast)
      setSelectedRows([])
      setSelectedBulkAction('')
    }
  }

  const handleSelectAllPages = () => {
    setSelectedRows(filteredData.map((item) => item._id))
  }

  // Clear selected rows when filteredData changes
  useEffect(() => {
    setSelectedRows([])
    setCurrentPage(1) // Reset to first page on data change
  }, [filteredData.length])

  const totalPages = Math.ceil(filteredData.length / rowsPerPage)
  const currentTableData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  )

  const allItemsOnPageSelected = selectedRows.length === currentTableData.length

  return (
    <Box p={!basicView ? 4 : 0}>
      {!basicView && (
        <Heading variant="" textTransform="uppercase" mb={4}>
          {collectionName}
        </Heading>
      )}

      <Flex justify="space-between" mb={!basicView ? 4 : 0} align="flex-end">
        <Flex align="flex-end" maxWidth={'400'} mr={4}>
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="sm"
            mr={2}
          />
          <Button
            colorScheme="teal"
            size="sm"
            onClick={() => setSearchTerm('')}
          >
            <Icon as={SearchIcon} boxSize={4} />
          </Button>
        </Flex>

        {filters && filters.length > 0 && (
          <Flex flex={1}>
            {filters.map((filter) => (
              <Box key={filter.key as string} ml={4}>
                <Text fontWeight="bold">{filter.label}</Text>
                {filter.type === 'dropdown' && (
                  <Select
                    value={selectedFilters?.[filter.key] || ''}
                    onChange={(e) =>
                      handleFilterChange(filter.key, e.target.value)
                    }
                    height={8}
                  >
                    {filter.options?.map((option: TableFilterOption) => (
                      <option key={option.label} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                )}
              </Box>
            ))}
          </Flex>
        )}

        {bulkActions.length > 0 && (
          <Flex align="center" mr={8}>
            <Select
              value={selectedBulkAction}
              onChange={(e) => setSelectedBulkAction(e.target.value)}
              placeholder="Select Bulk Action"
              mr={2}
              height={8}
            >
              {bulkActions.map((action) => (
                <option key={action.label} value={action.label}>
                  {action.label}
                </option>
              ))}
            </Select>
            <Button
              colorScheme="teal"
              size="sm"
              onClick={handleBulkAction}
              disabled={!selectedBulkAction || selectedRows.length === 0}
            >
              Apply
            </Button>
          </Flex>
        )}

        {allowCreate &&
          (!basicView && (
            <Button as={RouterLink} to={`add`} colorScheme="teal" size="sm">
              <Flex align="center">
                <Icon as={AddIcon} boxSize={4} mr={2} />
                <Text>Add</Text>
              </Flex>
            </Button>
          ))}
      </Flex>

      <Text mb={4}>
        {selectedRows.length > 0
          ? `Selected ${selectedRows.length} of ${filteredData.length} items`
          : `${filteredData.length} items`}
        {allItemsOnPageSelected && filteredData.length > 0 && (
          <>
            {' '}
            -{' '}
            <Link onClick={handleSelectAllPages} color="teal.500">
              Select All Pages
            </Link>
          </>
        )}
      </Text>

      {currentTableData.length > 0 ? (
        <>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>
                  <Checkbox
                    isChecked={selectedRows.length === currentTableData.length}
                    isIndeterminate={
                      selectedRows.length > 0 &&
                      selectedRows.length < currentTableData.length
                    }
                    onChange={(e) =>
                      setSelectedRows(
                        e.target.checked
                          ? currentTableData.map((item) => item._id)
                          : [],
                      )
                    }
                  />
                </Th>
                {columns.map((column) => (
                  <Th
                    key={column.key as string}
                    onClick={() => handleSort(column.key)}
                    _hover={{ cursor: 'pointer' }}
                  >
                    {column.label}{' '}
                    {column.key === sortConfig.key && getSortIcon(column.key)}
                  </Th>
                ))}
                {actions && actions.length > 0 && <Th>Actions</Th>}
              </Tr>
            </Thead>
            <Tbody>
              {currentTableData.map(
                (item: Record<string, any>, index: number) => (
                  <Tr
                    key={index}
                    backgroundColor={item.disabled ? 'gray.50' : ''}
                  >
                    <Td>
                      <Checkbox
                        isChecked={selectedRows.includes(item._id)}
                        onChange={() => handleRowSelect(item._id)}
                      />
                    </Td>
                    {columns.map((column, columnIndex) => (
                      <Td key={column.key as string}>
                        {columnIndex === 0 ? (
                          <Link
                            as={RouterLink}
                            to={`edit/${item._id}`}
                            color="teal.500"
                          >
                            {_.get(item, column.key).toString()}
                          </Link>
                        ) : (
                          formatTableData(_.get(item, column.key))
                        )}
                      </Td>
                    ))}
                    {actions && actions.length > 0 && (
                      <Td>
                        {actions.map((action, actionIndex) => {
                          const isApplicable = action.isApplicable
                            ? action.isApplicable(item)
                            : true

                          return (
                            isApplicable && (
                              <Button
                                key={actionIndex}
                                size="sm"
                                onClick={() =>
                                  action.effect(collectionName, item, toast)
                                }
                                bgColor={action.bgColor}
                              >
                                {action.label}
                              </Button>
                            )
                          )
                        })}
                      </Td>
                    )}
                  </Tr>
                ),
              )}
            </Tbody>
          </Table>

          {/* Pagination Controls */}
          <Flex justify="space-between" mt={4}>
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              size="sm"
            >
              <Icon as={ChevronLeftIcon} boxSize={4} />
              Previous
            </Button>
            <Text>
              Page {currentPage} of {totalPages}
            </Text>
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              size="sm"
            >
              Next
              <Icon as={ChevronRightIcon} boxSize={4} />
            </Button>
          </Flex>
        </>
      ) : (
        <Text>No results</Text>
      )}
    </Box>
  )
}

export default GenericTable
