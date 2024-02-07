import React from 'react'
import { useFormik } from 'formik'
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Flex,
} from '@chakra-ui/react'
import { Meteor } from 'meteor/meteor'

const TicketForm = () => {
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      subject: '',
      content: '',
    },
    onSubmit: async (values) => {
      try {
        await Meteor.call('ticket.insertOrUpdate', values)
        alert('Ticket created successfully!')
        // Reset form after successful submission
        formik.resetForm()
      } catch (error) {
        console.error('Error creating ticket:', error)
        alert('Failed to create ticket. Please try again.')
      }
    },
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormControl id="name" mb={4}>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
        />
      </FormControl>
      <FormControl id="email" mb={4}>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
        />
      </FormControl>
      <FormControl id="subject" mb={4}>
        <FormLabel>Subject</FormLabel>
        <Input
          type="text"
          name="subject"
          value={formik.values.subject}
          onChange={formik.handleChange}
        />
      </FormControl>
      <FormControl id="content" mb={4}>
        <FormLabel>Content</FormLabel>
        <Textarea
          name="content"
          value={formik.values.content}
          onChange={formik.handleChange}
        />
      </FormControl>
      <Flex justify="flex-end">
        <Button type="submit" colorScheme="teal">
          Submit
        </Button>
      </Flex>
    </form>
  )
}

export default TicketForm
