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
import { UserFields } from '/imports/api/user'

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
    .min(UserFields.email.minCharacters, 'Email must be at least 6 characters')
    .max(UserFields.email.maxCharacters, 'Email must be at most 320 characters')
    .required('Required'),

  username: Yup.string()
    .min(
      UserFields.username.minCharacters,
      'Username must be at least 6 characters',
    )
    .max(
      UserFields.username.maxCharacters,
      'Username must be at most 30 characters',
    )
    .required('Required'),

  password: Yup.string()
    .min(
      UserFields.password.minCharacters,
      'Password must be at least 8 characters',
    )
    .max(
      UserFields.password.maxCharacters,
      'Password must be at most 320 characters',
    )
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
    toast({
      title: '',
      description: `Already logged in`,
      status: 'info',
      isClosable: true,
    })
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
    Meteor.call('user.register', user, (error: Meteor.Error) => {
      if (error) {
        toast({
          title: 'Error',
          description: `Failed to register user: ${error.message}`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
        setSubmitting(false)
      } else {
        resetForm()
        toast({
          title: 'Success',
          description: 'User created',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
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
