import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { ForgotPasswordRequest, forgotPassword } from 'frontend-api'
import { setMessage } from 'frontend-utils'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { Keyboard, KeyboardAvoidingView, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { Button } from 'react-native-paper'
import * as Yup from 'yup'

import { FlexLogo } from '../components/common/FlexLogo'
import { TextInput } from '../components/common/TextInput'
import { View } from '../components/common/View'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

type ForgotPasswordFormFields = {
  email: string
}

export const ForgotPasswordScreen: React.FC<RootStackScreenProps<'ForgotPassword'>> = ({ navigation }) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    input: {
      marginBottom: 5,
      marginHorizontal: 5
    }
  })

  const schema = Yup.object().shape({
    email: Yup.string().required('Email is required')
  })

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm<ForgotPasswordFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: ''
    }
  })

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: ForgotPasswordRequest) => {
      Keyboard.dismiss()
      const res = await forgotPassword(request)
      if (res.ok) {
        setMessage('Password reset email sent. Please check your inbox.')
        navigation.replace('Login')
      }
    }
  })

  const onSubmit = (values: ForgotPasswordFormFields) => {
    mutate({
      email: values.email
    })
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <FlexLogo />
        <View>
          <TextInput
            label="Email"
            name="email"
            control={control}
            style={styles.input}
            error={errors.email}
            keyboardType="email-address"
          />
          <Button
            mode="contained"
            style={{ marginHorizontal: 5, alignSelf: 'stretch' }}
            disabled={submitting}
            onPress={handleSubmit(onSubmit)}
            loading={submitting}
          >
            Reset Password
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
