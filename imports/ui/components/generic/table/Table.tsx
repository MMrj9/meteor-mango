import React, { useState } from 'react'
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
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import {
  AddIcon,
  SearchIcon,
  ChevronDownIcon,
  ChevronUpIcon,
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
  filters?: TableFilter<Record<string, any>>[]
  selectedFilters?: { [key: string]: any }
  setSelectedFilters?: (prevFilters: { [key: string]: any }) => void
  actions?: Action[]
}

const GenericTable = ({
  data,
  columns,
  collectionName,
  add = true,
  filters = [],
  selectedFilters,
  setSelectedFilters,
  actions,
}: GenericTableProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: 'asc' | 'desc' | null
  }>({
    key: 'createdOn',
    direction: 'desc',
  })

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

  return (
    <Box p={4}>
      <Heading variant="" textTransform="uppercase" mb={4}>
        {collectionName}
      </Heading>

      <Flex justify="space-between" mb={4} align="flex-end">
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

        {add && (
          <Button as={RouterLink} to={`add`} colorScheme="teal" size="sm">
            <Flex align="center">
              <Icon as={AddIcon} boxSize={4} mr={2} />
              <Text>Add</Text>
            </Flex>
          </Button>
        )}
      </Flex>

      {filteredData.length > 0 ? (
        <Table variant="simple">
          <Thead>
            <Tr>
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
            {filteredData.map((item: Record<string, any>, index: number) => (
              <Tr key={index} backgroundColor={item.disabled ? 'gray.50' : ''}>
                {columns.map((column, columnIndex) => (
                  <Td key={column.key as string}>
                    {columnIndex === 0 ? (
                      <Link
                        as={RouterLink}
                        to={`edit/${item._id}`}
                        color="teal.500"
                      >
                        {_.get(item, column.key)}
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
                            onClick={() => action.effect(item._id)}
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
            ))}
          </Tbody>
        </Table>
      ) : (
        <Text>No results</Text>
      )}
    </Box>
  )
}

export default GenericTable
