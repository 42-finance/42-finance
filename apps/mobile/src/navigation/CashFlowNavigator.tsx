import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useMemo } from 'react'
import { useTheme } from 'react-native-paper'

import { RootStackParamList } from '../types/root-stack-params'
import { getStackScreens } from './getStackScreens'

const Stack = createNativeStackNavigator<RootStackParamList>()

export const CashFlowNavigator = () => {
  const { colors } = useTheme()

  const screens = useMemo(() => getStackScreens(Stack), [])

  return (
    <Stack.Navigator
      initialRouteName="CashFlow"
      screenOptions={{
        headerBackButtonMenuEnabled: false,
        headerBackButtonDisplayMode: 'minimal',
        headerTintColor: colors.onSurface
      }}
    >
      {screens}
    </Stack.Navigator>
  )
}
