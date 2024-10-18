import { darkColors, lightColors } from 'frontend-utils'
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper'

const customProps = {
  roundness: 1
}

export const LightTheme = {
  ...MD3LightTheme,
  ...customProps,
  colors: {
    ...MD3LightTheme.colors,
    ...lightColors
  }
}

export const DarkTheme = {
  ...MD3DarkTheme,
  ...customProps,
  colors: {
    ...MD3DarkTheme.colors,
    ...darkColors
  }
}

export const incomeColor = '#19d2a5'

export const expenseColor = '#f0648c'
