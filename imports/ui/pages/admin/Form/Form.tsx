import React, { useEffect, useState } from 'react'
import { Meteor } from 'meteor/meteor'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { Tracker } from 'meteor/tracker'
import { error, success } from '/imports/ui/components/generic/utils'
import GenericForm from '../../../components/generic/form/GenericForm'
import { Collections, RelatedCollections, Schemas } from '/imports/api'
import { processFormFieldsValues } from '../../../components/generic/form/utils/utils'
import _ from 'lodash'
import {
  generateDefaultValues,
  generateFormFields,
} from '/imports/ui/components/generic/form/utils/formFieldsGenerator'
import { FormField } from '/imports/ui/components/generic/form/utils/types'

interface FormProps {
  collectionName: string
}

const Form: React.FC<FormProps> = ({ collectionName }) => {
  const navigate = useNavigate()
  const toast = useToast()
  const { objectId } = useParams()
  const collection = Collections[collectionName]
  const schema = Schemas[collectionName]
  if (!schema || !collection) {
    throw new Error(`Invalid collection name: ${collectionName}`)
  }
  const [object, setObject] = useState<object | null>(null)
  const [formFields, setFormFields] = useState<Record<string, FormField>>(
    generateFormFields(_.cloneDeep(schema)),
  )

  const initialValues = generateDefaultValues(schema)
  const collectionNameLower = collectionName.toLowerCase()

  useEffect(() => {
    let objectSubscription: Meteor.SubscriptionHandle | null = null
    let trackerHandler: Tracker.Computation | null = null
    let relatedSubscriptions: Meteor.SubscriptionHandle[] = []

    const fetchData = () => {
      if (Meteor.isClient) {
        if (RelatedCollections[collectionName]) {
          RelatedCollections[collectionName].forEach((relatedCollection) => {
            const subscription = Meteor.subscribe(
              relatedCollection.collectionName,
            )
            relatedSubscriptions.push(subscription)
          })
        }
        const areRelatedSubscriptionsReady = () => {
          return relatedSubscriptions.every((sub) => sub.ready())
        }

        trackerHandler = Tracker.autorun(() => {
          if (areRelatedSubscriptionsReady() && objectId) {
            setFormFields(generateFormFields(_.cloneDeep(schema)))
            objectSubscription = Meteor.subscribe(collectionName, objectId)
            if (objectSubscription.ready()) {
              const _object = collection.findOne({ _id: objectId }) as object
              setObject(_object)
            }
          }
        })
      }
    }

    fetchData()

    return () => {
      if (objectSubscription) {
        objectSubscription.stop()
      }
      if (trackerHandler) {
        trackerHandler.stop()
      }
      relatedSubscriptions.forEach((sub) => sub.stop())
    }
  }, [objectId, collectionName])

  const handleSubmit = (values: object, shouldNavigate: boolean = true) => {
    processFormFieldsValues(formFields, values)
    Meteor.call(
      `${collectionName}.insertOrUpdate`,
      values,
      (err: Meteor.Error) => {
        if (err) {
          error(toast, `Failed to save ${collectionName}: ${err.reason}`)
        } else {
          success(toast, `${collectionName} saved successfully`)
          if (shouldNavigate) {
            navigate(`/admin/${collectionNameLower}`)
          }
        }
      },
    )
  }

  return (
    <GenericForm
      collectionName={collectionName}
      initialValues={object || (initialValues as any)}
      onSubmit={handleSubmit}
      formFields={formFields}
    />
  )
}

export default Form
