import React from 'react'
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import ChangelogTable from './ChangeLog'
import AdminComments from './AdminComments'
import { RelatedCollectionConfig, RelatedCollections } from '/imports/api'
import Table from '/imports/ui/pages/admin/Table/Table'

interface ObjectTabs {
  collectionName: string
  objectId: string
  object: any
}

const ObjectTabs = ({ collectionName, objectId, object }: ObjectTabs) => {
  const relatedCollections = RelatedCollections[collectionName] || []

  return (
    <Box flex={1} paddingLeft={4}>
      <Tabs>
        <TabList>
          <Tab>Comments</Tab>
          <Tab>Changelog</Tab>
          {relatedCollections.map(
            (relatedCollection: RelatedCollectionConfig) => (
              <Tab key={relatedCollection.collectionName}>
                {relatedCollection.collectionName}
              </Tab>
            ),
          )}
        </TabList>
        <TabPanels>
          <TabPanel>
            <AdminComments collection={collectionName} objectId={objectId} />
          </TabPanel>
          <TabPanel>
            <ChangelogTable collection={collectionName} objectId={objectId} />
          </TabPanel>
          {relatedCollections.map((relatedCollection) => {
            const defaultQuery: any = {}
            if (
              relatedCollection.relatedCollectionField &&
              relatedCollection.relateField
            ) {
              const relatedCollectionField =
                relatedCollection.relatedCollectionField
              const relateField = relatedCollection.relateField
              if (relatedCollection.relateFieldQuery) {
                defaultQuery[relatedCollectionField] = {
                  [relatedCollection.relateFieldQuery]: object[relateField],
                }
              } else {
                defaultQuery[relatedCollectionField] = object[relateField]
              }
            }

            return (
              <TabPanel>
                <Table
                  collectionName={relatedCollection.collectionName}
                  basicView={true}
                  defaultQuery={defaultQuery}
                />
              </TabPanel>
            )
          })}
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default ObjectTabs
