import React from 'react'
import { Formik, Form, Field } from 'formik'
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Select,
} from '@chakra-ui/react'
import { Ticket, TicketType } from '/imports/api/ticket'
import { Meteor } from 'meteor/meteor'

const TicketUserForm = () => {
  const initialValues: Ticket = {
    name: '',
    email: '',
    subject: '',
    content: '',
    type: TicketType.Issue,
  } as Ticket

  const handleSubmit = async (values: Ticket) => {
    try {
      await Meteor.call('ticket.insertOrUpdate', values)
      // Optionally, you can redirect the user or show a success message
      console.log('Ticket submitted successfully!')
    } catch (error) {
      console.error('Error submitting ticket:', error)
      // Handle error
    }
  }

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <Form>
        <FormControl id="name" isRequired>
          <FormLabel>Name</FormLabel>
          <Field name="name" as={Input} type="text" />
        </FormControl>
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Field name="email" as={Input} type="email" />
        </FormControl>
        <FormControl id="subject" isRequired>
          <FormLabel>Subject</FormLabel>
          <Field name="subject" as={Input} type="text" />
        </FormControl>
        <FormControl id="content" isRequired>
          <FormLabel>Content</FormLabel>
          <Field name="content" as={Textarea} />
        </FormControl>
        <FormControl id="type" isRequired>
          <FormLabel>Type</FormLabel>
          <Field name="type" as={Select}>
            {Object.values(TicketType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Field>
        </FormControl>
        <Button type="submit" colorScheme="blue" mt={4}>
          Submit
        </Button>
      </Form>
    </Formik>
  )
}

export default TicketUserForm
