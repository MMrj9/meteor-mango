import React from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  useToast,
  Link,
} from '@chakra-ui/react'
import { Formik, Form, Field, FieldProps, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { Meteor } from 'meteor/meteor'
import { error, info } from '../generic/utils'

interface LoginFormValues {
  usernameOrEmail: string
  password: string
}

const initialValues: LoginFormValues = {
  usernameOrEmail: '',
  password: '',
}

const validationSchema = Yup.object().shape({
  usernameOrEmail: Yup.string().required('Username or email is required'),
  password: Yup.string().required('Password is required'),
})

const LoginForm: React.FC = () => {
  const navigate = useNavigate()
  const toast = useToast()

  if (Meteor.isClient && Meteor.userId()) {
    info(toast, `Already logged in`)
    navigate('/')
  }

  const handleSubmit = (
    values: LoginFormValues,
    { setSubmitting }: FormikHelpers<LoginFormValues>,
  ) => {
    const { usernameOrEmail, password } = values

    Meteor.loginWithPassword(usernameOrEmail, password, (err: any) => {
      if (err) {
        error(toast, `Failed to log in: ${err.message}`)
      }
      setSubmitting(false)
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
            <Field name="usernameOrEmail">
              {({ field, meta }: FieldProps<string>) => (
                <FormControl
                  mb={4}
                  isInvalid={(meta.touched && meta.error) as boolean}
                >
                  <FormLabel>Username or Email</FormLabel>
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

            <Button
              type="submit"
              colorScheme="teal"
              width="full"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Log In
            </Button>

            <Text mt={4}>
              Don't have an account?{' '}
              <Link as={RouterLink} to="/register" color="teal.500">
                Register here
              </Link>
            </Text>
          </Form>
        )}
      </Formik>
    </Box>
  )
}

export default LoginForm
