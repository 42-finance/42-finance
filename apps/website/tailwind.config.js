export default {
  content: [
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx}',
    '../../libs/shared-components/src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'midnight-blue': '#0C1C2A',
        'lighter-green': 'rgb(0, 95, 175)',
        'dark-greyish-blue': '#798996',
        'cool-grey': '#DDE5ED',
        'capstone-purple': '#37055b',
        'capstone-light-purple': '#5e089c',
        'capstone-pink': '#d600bf',
        'capstone-orange': '#FBA300',
        'capstone-dark-blue': '#1F0CAA',
        'capstone-blue': '#21409A',
        'capstone-yellow': '#efc700',
        expense: '#f0648c',
        income: '#19d2a5',
        primary: 'rgb(0, 95, 175)',
        onPrimary: 'rgb(255, 255, 255)',
        primaryContainer: 'rgb(212, 227, 255)',
        onPrimaryContainer: 'rgb(0, 28, 58)',
        secondary: 'rgb(84, 95, 113)',
        onSecondary: 'rgb(255, 255, 255)',
        secondaryContainer: 'rgb(216, 227, 248)',
        onSecondaryContainer: 'rgb(17, 28, 43)',
        tertiary: 'rgb(0, 104, 116)',
        onTertiary: 'rgb(255, 255, 255)',
        tertiaryContainer: 'rgb(151, 240, 255)',
        onTertiaryContainer: 'rgb(0, 31, 36)',
        error: 'rgb(186, 26, 26)',
        onError: 'rgb(255, 255, 255)',
        errorContainer: 'rgb(255, 218, 214)',
        onErrorContainer: 'rgb(65, 0, 2)',
        background: 'rgb(253, 252, 255)',
        onBackground: 'rgb(26, 28, 30)',
        surface: 'rgb(253, 252, 255)',
        onSurface: 'rgb(26, 28, 30)',
        surfaceVariant: 'rgb(224, 226, 236)',
        onSurfaceVariant: 'rgb(67, 71, 78)',
        outline: 'rgb(116, 119, 127)',
        outlineVariant: 'rgb(195, 198, 207)',
        shadow: 'rgb(0, 0, 0)',
        scrim: 'rgb(0, 0, 0)',
        inverseSurface: 'rgb(47, 48, 51)',
        inverseOnSurface: 'rgb(241, 240, 244)',
        inversePrimary: 'rgb(165, 200, 255)',
        elevationLevel0: 'transparent',
        elevationLevel1: 'rgb(240, 244, 251)',
        elevationLevel2: 'rgb(233, 239, 249)',
        elevationLevel3: 'rgb(225, 235, 246)',
        elevationLevel4: 'rgb(223, 233, 245)',
        elevationLevel5: 'rgb(218, 230, 244)',
        surfaceDisabled: 'rgba(26, 28, 30, 0.12)',
        onSurfaceDisabled: 'rgba(26, 28, 30, 0.38)',
        backdrop: 'rgba(45, 49, 56, 0.4)'
      }
    }
  }
}
