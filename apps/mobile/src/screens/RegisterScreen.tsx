import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { RegisterRequest, register } from 'frontend-api'
import { setMessage } from 'frontend-utils'
import * as React from 'react'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Keyboard, KeyboardAvoidingView, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { Button } from 'react-native-paper'
import * as Yup from 'yup'

import { FlexLogo } from '../components/common/FlexLogo'
import { TextInput } from '../components/common/TextInput'
import { View } from '../components/common/View'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

type RegisterFormFields = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export default function RegisterScreen({ navigation }: RootStackScreenProps<'Register'>) {
  const passwordInput = useRef<any>()
  const confirmPasswordInput = useRef<any>()
  const emailInput = useRef<any>()

  const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    input: {
      marginBottom: 6,
      marginHorizontal: 5
    }
  })

  const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Email must be a valid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password')], 'Passwords must match')
  })

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm<RegisterFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: RegisterRequest) => {
      Keyboard.dismiss()
      const res = await register(request)
      if (res.ok) {
        setMessage(
          'Thank you for registering. You will receive a confirmation email shortly. Follow the link in the email to complete your registration.'
        )
        navigation.replace('Login')
      }
    }
  })

  const onSubmit = (values: RegisterFormFields) => {
    mutate({
      name: values.name,
      email: values.email,
      password: values.password
    })
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <FlexLogo />

        <View>
          <TextInput
            label="Name"
            name="name"
            control={control}
            returnKeyType="next"
            onSubmitEditing={() => {
              emailInput?.current?.focus()
            }}
            style={styles.input}
            error={errors.name}
            textContentType="name"
          />
          <TextInput
            label="Email"
            name="email"
            control={control}
            forwardRef={emailInput}
            returnKeyType="next"
            onSubmitEditing={() => {
              passwordInput?.current?.focus()
            }}
            style={styles.input}
            error={errors.email}
            keyboardType="email-address"
            textContentType="emailAddress"
          />
          <TextInput
            label="Password"
            name="password"
            control={control}
            secureTextEntry
            forwardRef={passwordInput}
            returnKeyType="next"
            onSubmitEditing={() => {
              confirmPasswordInput?.current?.focus()
            }}
            style={styles.input}
            error={errors.password}
            textContentType="newPassword"
          />
          <TextInput
            label="Confirm Password"
            name="confirmPassword"
            control={control}
            secureTextEntry
            forwardRef={confirmPasswordInput}
            style={styles.input}
            error={errors.confirmPassword}
            textContentType="newPassword"
          />
          <Button
            mode="contained"
            style={{ marginHorizontal: 5, alignSelf: 'stretch' }}
            disabled={submitting}
            onPress={handleSubmit(onSubmit)}
            loading={submitting}
          >
            Register
          </Button>
        </View>
        <View
          style={{
            flex: 1,
            flexBasis: 'auto',
            flexGrow: 1,
            flexShrink: 0,
            justifyContent: 'flex-end',
            alignItems: 'stretch'
          }}
        />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}
