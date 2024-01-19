import React from 'react';
import { ChakraProvider, CSSReset, Box } from '@chakra-ui/react';
import GenericTable from '../generic/table/Table';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data'; // Import useTracker
import { Company } from '/imports/api/company';



const columns = [
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' },
  { key: 'employees', label: 'Number of Employees' },
];


const CompanyTable: React.FC = () => {
  const data = useTracker(() => {
    if (Meteor.isClient) {
      const handle = Meteor.subscribe('company');

      if (handle.ready()) {
        return Company.find({}).fetch();
      }
    }

    return [];
  }, []);

  return (
      <Box p={4}>
        <GenericTable data={data} columns={columns} />
      </Box>
  );
};

export default CompanyTable;