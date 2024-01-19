import React from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

interface GenericTableProps<T> {
  data: any[];
  columns: { key: keyof T; label: string }[];
}

const GenericTable = <T extends Record<string, any>>({ data, columns }: GenericTableProps<T>) => {
  console.log(data)
  return (
    <Box>
      <Table variant="simple">
        <Thead>
          <Tr>
            {columns.map((column) => (
              <Th key={column.key as string}>{column.label}</Th>
            ))}
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
                      {item[column.key]}
                    </Link>
                  ) : (
                    // Render other columns normally
                    item[column.key]
                  )}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default GenericTable;