import { Linking } from 'react-native'
import { Card, Divider, Text } from 'react-native-paper'

import { CommunityItem } from './CommunityItem'

export const CommunityWidget = () => {
  return (
    <Card mode="elevated" theme={{ roundness: 5 }} style={{ marginBottom: 15, marginHorizontal: 10 }}>
      <Card.Content style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}>
        <Text variant="titleLarge" style={{ marginHorizontal: 15, marginTop: 5 }}>
          Join our communities to stay updated, share feedback, and ask questions!
        </Text>
        <Divider style={{ marginTop: 15 }} />
        <CommunityItem
          title="Reddit"
          iconSource={require('../../assets/images/reddit.png')}
          onPress={() => Linking.openURL('https://www.reddit.com/r/42finance')}
        />
        <Divider />
        <CommunityItem
          title="Discord"
          iconSource={require('../../assets/images/discord.png')}
          onPress={() => Linking.openURL('https://discord.gg/5v2qNeSyyx')}
        />
      </Card.Content>
    </Card>
  )
}
