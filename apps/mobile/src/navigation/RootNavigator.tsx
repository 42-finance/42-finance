import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useTheme } from 'react-native-paper'

import { useUserTokenContext } from '../contexts/user-token.context'
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen'
import LoginScreen from '../screens/LoginScreen'
import RegisterScreen from '../screens/RegisterScreen'
import { RootStackParamList } from '../types/root-stack-params'
import { HomeTabNavigator } from './HomeTabNavigator'

const Stack = createNativeStackNavigator<RootStackParamList>()

export const RootNavigator = () => {
  const { colors } = useTheme()
  const { token } = useUserTokenContext()

  return (
    <Stack.Navigator
      initialRouteName={token ? 'RootTabs' : 'Login'}
      screenOptions={{
        headerBackButtonMenuEnabled: false,
        headerBackTitleVisible: false,
        headerTintColor: colors.onSurface
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
          animationTypeForReplace: token === null ? 'pop' : 'push'
        }}
      />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Forgot Password' }} />
      <Stack.Screen name="RootTabs" component={HomeTabNavigator} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}
