import { Meteor } from 'meteor/meteor'
import {
  SelectedFilters,
  TableFilter,
  buildQueryFromSelectedFilters,
} from '../../../components/generic/filters/Filters'
import { Collections } from '/imports/api'
import { Tracker } from 'meteor/tracker'
import { useEffect, useState } from 'react'

export const useReactiveCollectionData = (
  collectionName: string,
  availableFilters: TableFilter[],
  selectedFilters: SelectedFilters,
  defaultQuery: Record<string, any> = {},
) => {
  const [data, setData] = useState([])
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!Meteor.isClient) return

    const handle = Meteor.subscribe(collectionName, {
      onReady: () => setIsReady(true),
    })

    const computation = Tracker.autorun(() => {
      const collection = Collections[collectionName]
      if (collection && isReady) {
        const query = buildQueryFromSelectedFilters(
          availableFilters,
          selectedFilters,
        )
        setData(collection.find({ ...query, ...defaultQuery }).fetch())
      }
    })

    // Cleanup on unmount
    return () => {
      handle.stop()
      computation.stop()
    }
  }, [collectionName, selectedFilters, isReady])

  return data
}
