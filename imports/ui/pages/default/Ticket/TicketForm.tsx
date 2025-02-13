import React from 'react'
import { Formik, Form, Field, FormikHelpers } from 'formik'
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Select,
  Box,
  Flex,
  useToast,
  Heading,
} from '@chakra-ui/react'
import { Ticket, TicketType } from '/imports/api/ticket'
import { Meteor } from 'meteor/meteor'
import { error, success } from '/imports/ui/components/generic/utils'

const TicketForm = () => {
  const toast = useToast()
  const initialValues = {
    name: '',
    email: '',
    subject: '',
    content: '',
    type: TicketType.Issue,
  }

  const handleSubmit = async (
    values: Ticket,
    { resetForm }: FormikHelpers<Ticket>,
  ) => {
    const user = Meteor.user()
    if (user) values.user = user.username

    Meteor.call('Ticket.insertOrUpdate', values, (err: Meteor.Error) => {
      if (err) error(toast, `Error submitting ticket: ${err.message}`)
      else {
        success(toast, 'Ticket submitted successfully!')
        resetForm()
      }
    })
  }

  return (
    <Flex flexDirection={'column'} alignItems={'center'}>
      <Heading>Submit Ticket</Heading>
      <Box
        width={{ base: '90%', sm: '80%', md: '60%', lg: '40%' }}
        p={4}
        boxShadow="md"
        borderRadius="md"
        margin="0 auto"
      >
        <Formik initialValues={initialValues as Ticket} onSubmit={handleSubmit}>
          <Form>
            <Flex direction={{ base: 'column', md: 'row' }}>
              <FormControl id="name" isRequired mb={{ base: 4, md: 0 }}>
                <FormLabel>Name</FormLabel>
                <Field name="name" as={Input} type="text" />
              </FormControl>
              <FormControl
                id="email"
                isRequired
                mb={{ base: 4, md: 0 }}
                ml={{ base: 0, md: 4 }}
              >
                <FormLabel>Email</FormLabel>
                <Field name="email" as={Input} type="email" />
              </FormControl>
            </Flex>
            <Flex direction={{ base: 'column', md: 'row' }}>
              <FormControl id="subject" isRequired mb={{ base: 4, md: 0 }}>
                <FormLabel>Subject</FormLabel>
                <Field name="subject" as={Input} type="text" />
              </FormControl>
              <FormControl
                id="type"
                isRequired
                mb={{ base: 4, md: 0 }}
                ml={{ base: 0, md: 4 }}
              >
                <FormLabel>Type</FormLabel>
                <Field name="type" as={Select}>
                  {Object.values(TicketType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Field>
              </FormControl>
            </Flex>
            <FormControl id="content" isRequired>
              <FormLabel>Content</FormLabel>
              <Field name="content" as={Textarea} />
            </FormControl>
            <Flex justifyContent="flex-end">
              <Button type="submit" colorScheme="blue" mt={4}>
                Submit
              </Button>
            </Flex>
          </Form>
        </Formik>
      </Box>
    </Flex>
  )
}

export default TicketForm
