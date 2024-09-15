import { Image, Linking, Platform } from 'react-native'
import { Button, Card, Text, useTheme } from 'react-native-paper'

export const NewAppWidget = () => {
  const { dark } = useTheme()

  const onPress = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('https://apps.apple.com/ca/app/42-finance/id6498875911')
    } else {
      Linking.openURL('https://play.google.com/store/apps/details?id=com.fortytwofinance.app')
    }
  }

  return (
    <Card mode="elevated" theme={{ roundness: 5 }} style={{ marginBottom: 15, marginHorizontal: 10 }}>
      <Card.Content style={{}}>
        <Image
          resizeMode="cover"
          style={{
            width: 125,
            height: 75,
            backgroundColor: 'transparent',
            alignSelf: 'center'
          }}
          source={dark ? require('../../assets/images/icon-white.png') : require('../../assets/images/icon.png')}
        />
        <Text variant="titleMedium" style={{ marginTop: 15 }}>
          As part of our rebranding to 42 Finance we have released a new app that can be downloaded at the link below.
          Please download the new app at your earliest convenience to continue receiving the most recent updates. You
          can login using the same credentials and all of your account details and connections are unchanged.
        </Text>
        <Button mode="contained" style={{ marginTop: 15 }} onPress={onPress}>
          Download
        </Button>
      </Card.Content>
    </Card>
  )
}
