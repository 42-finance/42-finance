import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import { FontAwesome } from '@expo/vector-icons'
import { useMaterial3Theme } from '@pchmn/expo-material3-theme'
import * as Sentry from '@sentry/react-native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { registerRootComponent } from 'expo'
import * as Application from 'expo-application'
import { useFonts } from 'expo-font'
import * as Notifications from 'expo-notifications'
import * as SecureStore from 'expo-secure-store'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { getUser, initializeApi } from 'frontend-api'
import { setMessage } from 'frontend-utils'
import React, { useEffect, useState } from 'react'
import { LogBox, Platform, useColorScheme } from 'react-native'
import { MD3DarkTheme, MD3LightTheme, Provider as PaperProvider, configureFonts } from 'react-native-paper'
import Purchases, { LOG_LEVEL } from 'react-native-purchases'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import 'react-native-url-polyfill/auto'
import { CurrencyCode } from 'shared-types'

import { config } from './common/config'
import { Message } from './components/common/Message'
import { TransactionsFilterProvider } from './contexts/transactions-filter.context'
import { UserTokenProvider } from './contexts/user-token.context'
import { Navigation } from './navigation/Navigation'

const App: React.FC = () => {
  const colorScheme = useColorScheme()
  const { theme } = useMaterial3Theme({ sourceColor: '#2196F3' })

  const [userLoaded, setUserLoaded] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>(CurrencyCode.USD)

  initializeApi({
    apiUrl: process.env.EXPO_PUBLIC_API_URL as string,
    googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    getToken: async () => SecureStore.getItemAsync('token'),
    onMessage: (message) => setMessage(message),
    getAppVersion: () => Application.nativeApplicationVersion
  })

  LogBox.ignoreLogs(['new NativeEventEmitter'])

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false
    })
  })

  if (Platform.OS === 'ios') {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE)
    Purchases.configure({ apiKey: process.env.EXPO_PUBLIC_REVENUE_CAT_API_KEY as string })
  }

  Sentry.init({
    dsn: config.sentryDsn
  })

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false
      }
    }
  })

  useEffect(() => {
    const loadUser = async () => {
      await SplashScreen.preventAutoHideAsync()
      const cachedToken = await SecureStore.getItemAsync('token')
      if (cachedToken === null) {
        setUserLoaded(true)
        return
      }
      setToken(cachedToken)
      const res = await getUser()
      if (res.ok && res.parsedBody?.payload) {
        const { id, email, currencyCode } = res.parsedBody.payload
        setCurrencyCode(currencyCode)
        if (Platform.OS === 'ios') {
          await Purchases.logIn(id.toString())
          await Purchases.setEmail(email)
        }
      } else {
        setToken(null)
        await SecureStore.deleteItemAsync('token')
      }
      setUserLoaded(true)
    }
    loadUser()
  }, [])

  const [fontsLoaded] = useFonts({
    ...FontAwesome.font,
    'Barlow-Bold': require('./assets/fonts/Barlow-Bold.ttf'),
    'Barlow-Italic': require('./assets/fonts/Barlow-Italic.ttf'),
    'Barlow-BoldItalic': require('./assets/fonts/Barlow-BoldItalic.ttf'),
    'Barlow-Regular': require('./assets/fonts/Barlow-Medium.ttf')
  })

  const baseFont = {
    fontFamily: 'Barlow-Regular'
  }

  const baseVariants = configureFonts({ config: baseFont })

  const customVariants = {
    headlineMediumBold: {
      ...baseVariants.headlineMedium,
      fontFamily: 'Barlow-Bold'
    },
    titleLargeBold: {
      ...baseVariants.titleLarge,
      fontFamily: 'Barlow-Bold'
    },
    titleMediumBold: {
      ...baseVariants.titleMedium,
      fontFamily: 'Barlow-Bold'
    }
  }

  const fonts = configureFonts({
    config: {
      ...baseVariants,
      ...customVariants
    }
  })

  const paperTheme =
    colorScheme === 'dark'
      ? {
          ...MD3DarkTheme,
          roundness: 1,
          colors: theme.dark
        }
      : {
          ...MD3LightTheme,
          roundness: 1,
          colors: theme.light
        }

  useEffect(() => {
    const hideSplashScreen = async () => {
      if (userLoaded && fontsLoaded) {
        await SplashScreen.hideAsync()
      }
    }
    hideSplashScreen()
  }, [userLoaded, fontsLoaded])

  if (!userLoaded || !fontsLoaded) return null

  return (
    <TransactionsFilterProvider>
      <UserTokenProvider token={token} currencyCode={currencyCode}>
        <QueryClientProvider client={queryClient}>
          <PaperProvider theme={{ ...paperTheme, fonts }}>
            <ActionSheetProvider>
              <SafeAreaProvider>
                <Navigation />
                <StatusBar />
                <Message />
              </SafeAreaProvider>
            </ActionSheetProvider>
          </PaperProvider>
        </QueryClientProvider>
      </UserTokenProvider>
    </TransactionsFilterProvider>
  )
}

export default registerRootComponent(Sentry.wrap(App))
