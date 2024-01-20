import React, { useEffect, useState } from 'react'
import { Company } from '/imports/api/company'
import GenericForm from '../generic/form/Form'
import { Meteor } from 'meteor/meteor'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { Tracker } from 'meteor/tracker'

interface CompanyFormProps {}

const formFields = {
  name: { label: 'Name', disabled: false, maxCharacters: 50 },
  description: { label: 'Description', disabled: false, maxCharacters: 200 },
  employees: {
    label: 'Number of Employees',
    type: 'number',
    disabled: false,
    maxCharacters: 3,
  },
  created_on: { label: 'Created On', disabled: true, hideOnCreate: true },
  updated_on: { label: 'Updated On', disabled: true, hideOnCreate: true },
}

const initialValues = { name: '', description: '', employees: 0 }

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
    Meteor.call('company.insertOrUpdate', values, (error: Meteor.Error) => {
      if (error) {
        toast({
          title: 'Error',
          description: `Failed to save company: ${error.reason}`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      } else {
        toast({
          title: 'Success',
          description: 'Company saved successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })

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
