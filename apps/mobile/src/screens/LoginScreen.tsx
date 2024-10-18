import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import * as SecureStore from 'expo-secure-store'
import { AppleLoginRequest, LoginRequest, addNotificationToken, login, loginWithApple } from 'frontend-api'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native'
import { ActivityIndicator, Button, Modal, Portal } from 'react-native-paper'
import Purchases from 'react-native-purchases'
import { CurrencyCode } from 'shared-types'
import * as Yup from 'yup'

import { AppleSignIn } from '../components/common/AppleSignIn'
import { FlexLogo } from '../components/common/FlexLogo'
import { TextInput } from '../components/common/TextInput'
import { View } from '../components/common/View'
import { useUserTokenContext } from '../contexts/user-token.context'
import { RootStackScreenProps } from '../types/root-stack-screen-props'
import { mixpanel } from '../utils/mixpanel.utils'
import { registerForPushNotifications } from '../utils/notification.utils'

type LoginFormFields = {
  email: string
  password: string
}

export default ({ navigation }: RootStackScreenProps<'Login'>) => {
  const { setToken, setCurrencyCode } = useUserTokenContext()

  const passwordInput = React.useRef<any>()

  const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    input: {
      marginBottom: 5,
      marginHorizontal: 5
    }
  })

  const onLogin = async (userId: number, token: string, currencyCode: CurrencyCode) => {
    await SecureStore.setItemAsync('token', token)
    setToken(token)
    setCurrencyCode(currencyCode)
    if (Platform.OS === 'ios') {
      await Purchases.logIn(userId.toString())
    }
    await mixpanel.identify(`user-${userId}`)
    navigation.replace('RootTabs')
    const pushToken = await registerForPushNotifications()
    if (pushToken) {
      addNotificationToken({ token: pushToken })
    }
  }

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: LoginRequest) => {
      Keyboard.dismiss()
      const res = await login(request)
      if (res.ok && res.parsedBody?.payload) {
        const { user, token, currencyCode } = res.parsedBody.payload
        onLogin(user.id, token, currencyCode)
      }
    }
  })

  const { mutate: appleMutation, isPending: submittingApple } = useMutation({
    mutationFn: async (request: AppleLoginRequest) => {
      Keyboard.dismiss()
      const res = await loginWithApple(request)
      if (res.ok && res.parsedBody?.payload) {
        const { user, token, currencyCode } = res.parsedBody.payload
        onLogin(user.id, token, currencyCode)
      }
    }
  })

  const schema = Yup.object().shape({
    email: Yup.string().email().required('Email is required'),
    password: Yup.string().required('Password is required')
  })

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm<LoginFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = (values: LoginFormFields) => {
    mutate({
      email: values.email,
      password: values.password
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <Portal>
        <Modal visible={submittingApple}>
          <ActivityIndicator />
        </Modal>
      </Portal>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView style={styles.container}>
          <FlexLogo />
          <View>
            <TextInput
              label="Email"
              name="email"
              control={control}
              returnKeyType="next"
              onSubmitEditing={() => {
                passwordInput?.current?.focus()
              }}
              style={styles.input}
              keyboardType="email-address"
              error={errors.email}
            />
            <TextInput
              label="Password"
              name="password"
              control={control}
              secureTextEntry
              forwardRef={passwordInput}
              style={styles.input}
              error={errors.password}
            />
            <Button
              mode="text"
              style={{
                margin: 5,
                alignSelf: 'center',
                borderColor: 'transparent'
              }}
              onPress={() => {
                navigation.navigate('ForgotPassword')
              }}
            >
              Forgot Password?
            </Button>
            <Button
              mode="contained"
              style={{ marginHorizontal: 5, alignSelf: 'stretch' }}
              disabled={submitting}
              onPress={handleSubmit(onSubmit)}
              loading={submitting}
            >
              Login
            </Button>
            <AppleSignIn
              onSuccess={(identityToken, name) => {
                appleMutation({ identityToken, name })
              }}
            />
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
          >
            <Button
              onPress={() => {
                navigation.navigate('Register')
              }}
              mode="contained"
              style={{
                marginBottom: 5,
                marginHorizontal: 5
              }}
            >
              Register With Email
            </Button>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}
