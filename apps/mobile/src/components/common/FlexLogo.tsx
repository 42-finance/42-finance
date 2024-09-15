import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { useTheme } from 'react-native-paper'

export const FlexLogo: React.FC = () => {
  const { dark } = useTheme()

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexBasis: 'auto',
      flexGrow: 1,
      flexShrink: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent'
    },
    logo: {
      width: 125,
      height: 125,
      backgroundColor: 'transparent'
    }
  })

  return (
    <View style={styles.container}>
      <Image
        resizeMode="cover"
        style={styles.logo}
        source={dark ? require('../../assets/images/icon-white.png') : require('../../assets/images/icon.png')}
      />
    </View>
  )
}
