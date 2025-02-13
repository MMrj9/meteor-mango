import React, { useEffect, useState } from 'react'
import { Meteor } from 'meteor/meteor'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { Tracker } from 'meteor/tracker'
import { error, success } from '/imports/ui/components/generic/utils'
import GenericForm, {
  FormField,
} from '../../../components/generic/form/GenericForm'
import { Collections, Schemas } from '/imports/api'
import { processFormFieldsValues } from '../../../components/generic/form/utils/utils'
import _ from 'lodash'
import {
  generateDefaultValues,
  generateFormFields,
} from '/imports/ui/components/generic/form/utils/formFieldsGenerator'

interface FormProps {
  collectionName: string
}

const Form: React.FC<FormProps> = ({ collectionName }) => {
  const navigate = useNavigate()
  const toast = useToast()
  const { objectId } = useParams()
  const [object, setObject] = useState<object | null>(null)

  const schema = _.cloneDeep(Schemas[collectionName])
  const collection = Collections[collectionName]

  if (!schema || !collection) {
    throw new Error(`Invalid collection name: ${collectionName}`)
  }

  const formFields: Record<string, FormField> = generateFormFields(schema)
  const initialValues = generateDefaultValues(schema)
  const collectionNameLower = collectionName.toLowerCase()

  useEffect(() => {
    let objectSubscription: Meteor.SubscriptionHandle | null = null
    let trackerHandler: Tracker.Computation | null = null

    const fetchData = () => {
      if (Meteor.isClient && objectId) {
        objectSubscription = Meteor.subscribe(collectionName, objectId)

        trackerHandler = Tracker.autorun(() => {
          const _object = collection.findOne({ _id: objectId }) as object
          setObject(_object)
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
    }
  }, [objectId])

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
