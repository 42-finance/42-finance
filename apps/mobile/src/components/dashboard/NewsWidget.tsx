import { Linking } from 'react-native'
import { Card, Divider, Text } from 'react-native-paper'

import { CommunityItem } from './CommunityItem'

export const NewsWidget = () => {
  return (
    <Card mode="elevated" theme={{ roundness: 5 }} style={{ marginBottom: 15, marginHorizontal: 10 }}>
      <Card.Content style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}>
        <Text variant="bodyLarge" style={{ marginHorizontal: 15, marginTop: 5 }}>
          We have decided to open source our project to allow a more transparent look into personal finance apps. You
          can view our repository with the button below. We will continue to host our servers and app on the app stores.
          However we will no longer be able to provide our users with a free unlimited connections subscription. If you
          have not already purchased a subscription you have until September 30, 2024 to upgrade otherwise your
          connections will no longer sync with Plaid. All of your data will remain and you can continue using our free
          tier with unlimited manual data if you do not wish to subscribe. Thank you to everyone who has supported us
          since launch and I hope we can continue our contribution to the personal finance community through our new
          open source effort.
        </Text>
        <Divider style={{ marginTop: 15 }} />
        <CommunityItem
          title="Github"
          iconSource={require('../../assets/images/github.png')}
          onPress={() => Linking.openURL('https://github.com/42-finance/42-finance')}
          tintColor="white"
        />
      </Card.Content>
    </Card>
  )
}
