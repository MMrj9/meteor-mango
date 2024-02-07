import React, { useEffect, useState } from 'react'
import GenericForm, { FormField } from '../generic/form/Form'
import { Meteor } from 'meteor/meteor'
import { useParams } from 'react-router-dom'
import { Tracker } from 'meteor/tracker'
import { formatDate } from '/imports/utils/date'
import { Ticket } from '/imports/api/ticket'

interface TicketFormProps {}

const formFields: Record<string, FormField> = {
  type: {
    label: 'Type',
    disabled: true,
  },
  name: {
    label: 'Name',
    disabled: true,
  },
  user: {
    label: 'User',
    disabled: true,
  },
  subject: {
    label: 'Subject',
    disabled: true,
  },
  content: {
    label: 'Contetnt',
    disabled: true,
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

const initialValues = {}

const TicketForm: React.FC<TicketFormProps> = () => {
  const { ticketId } = useParams()
  const [ticket, setTicket] = useState<Ticket | null>(null)

  useEffect(() => {
    let ticketSubscription: Meteor.SubscriptionHandle | null = null
    let trackerHandler: Tracker.Computation | null = null

    const fetchCompanyData = () => {
      if (Meteor.isClient && ticketId) {
        ticketSubscription = Meteor.subscribe('ticket', ticketId)

        trackerHandler = Tracker.autorun(() => {
          const _ticket = Ticket.findOne({ _id: ticketId })
          setTicket(_ticket as Ticket)
        })
      }
    }

    fetchCompanyData()

    return () => {
      if (ticketSubscription) {
        ticketSubscription.stop()
      }
      if (trackerHandler) {
        trackerHandler.stop()
      }
    }
  }, [ticketId])

  return (
    <GenericForm
      collectionName="ticket"
      initialValues={ticket || initialValues}
      onSubmit={() => null}
      formFields={formFields}
      hideSave={true}
    />
  )
}

export default TicketForm
