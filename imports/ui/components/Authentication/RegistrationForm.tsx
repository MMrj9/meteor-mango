import React from 'react'
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  useToast,
} from '@chakra-ui/react'
import { Formik, Form, Field, FieldProps, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { Meteor } from 'meteor/meteor'
import { useNavigate } from 'react-router-dom'
import { error, info, success } from '../generic/utils'

interface RegistrationFormValues {
  email: string
  username: string
  password: string
  confirmPassword: string
}

const initialValues: RegistrationFormValues = {
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
}

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .min(6, 'Email must be at least 6 characters')
    .max(320, 'Email must be at most 320 characters')
    .required('Required'),

  username: Yup.string()
    .min(6, 'Username must be at least 6 characters')
    .max(30, 'Username must be at most 30 characters')
    .required('Required'),

  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(320, 'Password must be at most 320 characters')
    .required('Required'),

  confirmPassword: Yup.string()
    //@ts-ignore
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
})

const RegistrationForm: React.FC = () => {
  const navigate = useNavigate()
  const toast = useToast()

  if (Meteor.isClient && Meteor.userId()) {
    info(toast, `Already logged in`)
    navigate('/')
  }

  const handleSubmit = (
    values: RegistrationFormValues,
    { setSubmitting, resetForm }: FormikHelpers<RegistrationFormValues>,
  ) => {
    const user = {
      email: values.email,
      username: values.username,
      password: values.password,
    }
    Meteor.call('User.register', user, (err: Meteor.Error) => {
      if (err) {
        error(toast, `Failed to register user: ${err.message}`)
        setSubmitting(false)
      } else {
        resetForm()
        success(toast, 'User created')
        navigate('/login')
      }
    })
  }

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={10}
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="lg"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field name="email">
              {({ field, meta }: FieldProps<string>) => (
                <FormControl
                  mb={4}
                  isInvalid={(meta.touched && meta.error) as boolean}
                >
                  <FormLabel>Email</FormLabel>
                  <Input {...field} type="email" />
                  {meta.touched && meta.error && (
                    <Text color="red">{meta.error}</Text>
                  )}
                </FormControl>
              )}
            </Field>

            <Field name="username">
              {({ field, meta }: FieldProps<string>) => (
                <FormControl
                  mb={4}
                  isInvalid={(meta.touched && meta.error) as boolean}
                >
                  <FormLabel>Username</FormLabel>
                  <Input {...field} type="text" />
                  {meta.touched && meta.error && (
                    <Text color="red">{meta.error}</Text>
                  )}
                </FormControl>
              )}
            </Field>

            <Field name="password">
              {({ field, meta }: FieldProps<string>) => (
                <FormControl
                  mb={4}
                  isInvalid={(meta.touched && meta.error) as boolean}
                >
                  <FormLabel>Password</FormLabel>
                  <Input {...field} type="password" />
                  {meta.touched && meta.error && (
                    <Text color="red">{meta.error}</Text>
                  )}
                </FormControl>
              )}
            </Field>

            <Field name="confirmPassword">
              {({ field, meta }: FieldProps<string>) => (
                <FormControl
                  mb={4}
                  isInvalid={(meta.touched && meta.error) as boolean}
                >
                  <FormLabel>Confirm Password</FormLabel>
                  <Input {...field} type="password" />
                  {meta.touched && meta.error && (
                    <Text color="red">{meta.error}</Text>
                  )}
                </FormControl>
              )}
            </Field>

            <Button
              type="submit"
              colorScheme="teal"
              width="full"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  )
}

export default RegistrationForm
