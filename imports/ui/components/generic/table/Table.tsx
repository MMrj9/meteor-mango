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

interface GenericTableProps<T> {
  data: T[]
  columns: { key: keyof T; label: string }[]
  collectionName: string
  add?: boolean
}

const GenericTable = <T extends Record<string, any>>({
  data,
  columns,
  collectionName,
  add = true,
}: GenericTableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T
    direction: 'asc' | 'desc' | null
  }>({
    key: 'created_on',
    direction: 'desc',
  })

  const handleSort = (key: keyof T) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }

    setSortConfig({ key, direction })
  }

  const sortedData = () => {
    if (sortConfig.key) {
      //@ts-ignore
      return _.orderBy(data, [sortConfig.key], [sortConfig.direction])
    }
    return data
  }

  const getSortIcon = (key: keyof T) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? (
        <ChevronUpIcon />
      ) : (
        <ChevronDownIcon />
      )
    }
    return null
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

      <Flex justify="space-between" mb={4} align="center">
        <Flex align="center" maxWidth={'400'}>
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
            </Tr>
          </Thead>
          <Tbody>
            {filteredData.map((item: T, index: number) => (
              <Tr key={index}>
                {columns.map((column, columnIndex) => (
                  <Td key={column.key as string}>
                    {columnIndex === 0 ? (
                      // Assuming the first column is the model ID
                      <Link
                        as={RouterLink}
                        to={`edit/${item._id}`}
                        color="teal.500"
                      >
                        {_.get(item, column.key)}
                      </Link>
                    ) : (
                      // Render other columns normally
                      formatTableData(_.get(item, column.key))
                    )}
                  </Td>
                ))}
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
