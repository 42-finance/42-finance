import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import * as React from 'react'
import { useTheme } from 'react-native-paper'

import { RootNavigator } from './RootNavigator'

export const Navigation = () => {
  const { colors, dark } = useTheme()

  const navTheme: ReactNavigation.Theme = {
    dark,
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.elevation.level2,
      text: colors.onSurface,
      border: colors.outline,
      notification: colors.error
    },
    fonts: DefaultTheme.fonts
  }

  return (
    <NavigationContainer theme={navTheme}>
      <RootNavigator />
    </NavigationContainer>
  )
}
