import React, { useEffect, useState } from 'react'
import { Company } from '/imports/api/company'
import GenericForm, { FormField } from '../../../components/generic/form/Form'
import { Meteor } from 'meteor/meteor'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { Tracker } from 'meteor/tracker'
import { formatDate } from '/imports/utils/date'
import { error, success } from '/imports/ui/components/generic/utils'

interface CompanyFormProps {}

const formFields: Record<string, FormField> = {
  name: {
    label: 'Name',
    disabled: false,
  },
  description: {
    label: 'Description',
    disabled: false,
  },
  numberOfEmployees: {
    label: 'Number of Employees',
    type: 'number',
    disabled: false,
  },
  createdOn: {
    label: 'Created On',
    disabled: true,
    hideOnCreate: true,
    format: formatDate,
  },
  updated_on: {
    label: 'Updated On',
    disabled: true,
    hideOnCreate: true,
    format: formatDate,
  },
}

const initialValues = { name: '', description: '', numberOfEmployees: 0 }

const CompanyForm: React.FC<CompanyFormProps> = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const { companyId } = useParams()
  const [company, setCompany] = useState<Company | null>(null)

  useEffect(() => {
    let companySubscription: Meteor.SubscriptionHandle | null = null
    let trackerHandler: Tracker.Computation | null = null

    const fetchCompanyData = () => {
      if (Meteor.isClient && companyId) {
        // Subscribe to the 'company' publication
        companySubscription = Meteor.subscribe('company', companyId)

        // Use Tracker.autorun to re-run when the subscription changes
        trackerHandler = Tracker.autorun(() => {
          // Get the company data from the local minimongo cache
          const _company = Company.findOne({ _id: companyId })
          setCompany(_company as Company)
        })
      }
    }

    fetchCompanyData()

    // Cleanup function
    return () => {
      if (companySubscription) {
        companySubscription.stop()
      }
      if (trackerHandler) {
        trackerHandler.stop()
      }
    }
  }, [companyId])

  const handleSubmit = (values: Company) => {
    Meteor.call('company.insertOrUpdate', values, (err: Meteor.Error) => {
      if (err) {
        error(toast, `Failed to save company: ${err.reason}`)
      } else {
        success(toast, 'Company saved successfully')
        navigate('/company')
      }
    })
  }

  return (
    <GenericForm
      collectionName="company"
      initialValues={company || initialValues}
      onSubmit={handleSubmit}
      formFields={formFields}
    />
  )
}

export default CompanyForm
