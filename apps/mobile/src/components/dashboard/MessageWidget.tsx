import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, EditUserRequest, editUser, getUser } from 'frontend-api'
import { Linking } from 'react-native'
import { Button, Card, Divider, Text } from 'react-native-paper'

import { useRefetchOnFocus } from '../../hooks/use-refetch-on-focus.hook'
import { View } from '../common/View'
import { CommunityItem } from './CommunityItem'

export const MessageWidget = () => {
  const queryClient = useQueryClient()

  const { data: user, refetch } = useQuery({
    queryKey: [ApiQuery.User],
    queryFn: async () => {
      const res = await getUser()
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
    },
    placeholderData: keepPreviousData
  })

  useRefetchOnFocus(refetch)

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: EditUserRequest) => {
      const res = await editUser(request)
      if (res.ok && res.parsedBody?.payload) {
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.User] })
      }
    }
  })

  if (!user || user.hideCommunity) {
    return null
  }

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
        <Divider />
        <Divider />
        <View style={{ alignSelf: 'flex-end' }}>
          <Button
            mode="text"
            style={{ paddingVertical: 5 }}
            onPress={() => {
              mutate({
                hideOpenSource: true
              })
            }}
            disabled={submitting}
            loading={submitting}
          >
            Hide Widget
          </Button>
        </View>
      </Card.Content>
    </Card>
  )
}
