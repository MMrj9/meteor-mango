import React from 'react'
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
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import _ from 'lodash'
import { AddIcon } from '@chakra-ui/icons'

interface GenericTableProps<T> {
  data: any[]
  columns: { key: keyof T; label: string }[]
  collectionName: string
}

const GenericTable = <T extends Record<string, any>>({
  data,
  columns,
  collectionName,
}: GenericTableProps<T>) => {
  return (
    <Box>
      <Heading variant="" textTransform="uppercase">
        {collectionName}
      </Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            {columns.map((column) => (
              <Th key={column.key as string}>{column.label}</Th>
            ))}
            <Th>
              <Button as={RouterLink} to={`add`} colorScheme="teal" size="sm">
                <Flex align="center">
                  <Icon as={AddIcon} mr={2} />
                  <Text>Add</Text>
                </Flex>
              </Button>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item: any, index: number) => (
            <Tr key={index}>
              {columns.map((column, columnIndex) => (
                <Td key={column.key as string}>
                  {columnIndex === 0 ? (
                    // Assuming the first column is the model ID
                    <Link as={RouterLink} to={`edit/${item._id}`}>
                      {_.get(item, column.key)}
                    </Link>
                  ) : (
                    // Render other columns normally
                    _.get(item, column.key)
                  )}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}

export default GenericTable
