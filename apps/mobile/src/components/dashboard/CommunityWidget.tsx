import { useNavigation } from '@react-navigation/native'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, EditUserRequest, editUser, getUser } from 'frontend-api'
import { Linking } from 'react-native'
import { Button, Card, Divider, Text, useTheme } from 'react-native-paper'

import { useRefetchOnFocus } from '../../hooks/use-refetch-on-focus.hook'
import { View } from '../common/View'
import { CommunityItem } from './CommunityItem'

export const CommunityWidget = () => {
  const navigation = useNavigation()
  const { colors } = useTheme()
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
        <Divider />
        <View style={{ alignSelf: 'flex-end' }}>
          <Button
            mode="text"
            style={{ paddingVertical: 5 }}
            onPress={() => {
              mutate({
                hideCommunity: true
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
