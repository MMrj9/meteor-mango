import React from 'react'
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import ChangelogTable from './ChangeLog'
import AdminComments from './AdminComments'

interface ObjectTabs {
  collectionName: string
  objectId: string
}

const ObjectTabs = ({ collectionName, objectId }: ObjectTabs) => {

  return (
    <Box flex={1} paddingLeft={4}>
      <Tabs>
        <TabList>
          <Tab>Comments</Tab>
          <Tab>Changelog</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <AdminComments collection={collectionName} objectId={objectId} />
          </TabPanel>
          <TabPanel>
            <ChangelogTable collection={collectionName} objectId={objectId} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default ObjectTabs
