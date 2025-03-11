import React, { useEffect, useState } from 'react'
//@ts-ignore
import { Roles } from 'meteor/alanning:roles'
import { Meteor } from 'meteor/meteor'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { Tracker } from 'meteor/tracker'
import { AllRoles } from '/imports/api/user'
import { error, success } from '/imports/ui/components/generic/utils'
import {
  mapValuesToOptions,
  processFormFieldsValues,
} from '../../../../components/generic/form/utils/utils'
import { Collections, Schemas } from '/imports/api'
import { generateDefaultValues } from '/imports/ui/components/generic/form/utils/formFieldsGenerator'
import {
  FormField,
  FormFieldType,
} from '/imports/ui/components/generic/form/utils/types'
import GenericForm from '/imports/ui/components/generic/form/GenericForm'

interface FormProps {
  collectionName: string
}

const UserFormFields: Record<string, FormField> = {
  username: {
    label: 'Username',
    disabled: true,
  },
  'emails[0].address': {
    label: 'Email',
    disabled: true,
  },
  roles: {
    label: 'roles',
    type: FormFieldType.AUTOCOMPLETE,
    options: [],
    optionsInitialValues: [],
  },
}

const UserForm: React.FC<FormProps> = ({ collectionName }) => {
  const navigate = useNavigate()
  const toast = useToast()
  const { objectId } = useParams()
  const [object, setObject] = useState<object | null>(null)

  const schema = Schemas[collectionName]
  const collection = Collections[collectionName]

  if (!schema || !collection) {
    throw new Error(`Invalid collection name: ${collectionName}`)
  }

  const formFields: Record<string, FormField> = UserFormFields
  const initialValues = generateDefaultValues(schema)
  const collectionNameLower = collectionName.toLowerCase()

  useEffect(() => {
    let objectSubscription: Meteor.SubscriptionHandle | null = null
    let roleSubscription: Meteor.SubscriptionHandle | null = null
    let trackerHandler: Tracker.Computation | null = null

    const fetchUserData = () => {
      if (Meteor.isClient && objectId) {
        objectSubscription = Meteor.subscribe(collectionName, objectId)
        roleSubscription = Meteor.subscribe('role', objectId)

        trackerHandler = Tracker.autorun(() => {
          const user = collection.findOne({ _id: objectId })
          const roles = Roles.getRolesForUser(user)
          const _object = {
            ...user,
            roles,
          }
          setObject(_object as object)
        })
      }
    }

    fetchUserData()

    return () => {
      if (objectSubscription) {
        objectSubscription.stop()
        roleSubscription?.stop
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

  if (!object) return

  mapValuesToOptions(
    Roles.getRolesForUser(object),
    'roles.optionsInitialValues',
    formFields,
  )
  mapValuesToOptions(AllRoles, 'roles.options', formFields)

  return (
    <GenericForm
      collectionName={collectionNameLower}
      //@ts-ignore
      initialValues={object || (initialValues as any)}
      onSubmit={handleSubmit}
      formFields={formFields}
    />
  )
}

export default UserForm
