import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, EditUserRequest, editUser, getUser } from 'frontend-api'
import { Button, Card, Divider, Text } from 'react-native-paper'

import { useRefetchOnFocus } from '../../hooks/use-refetch-on-focus.hook'
import { View } from '../common/View'

export const WhatsNewWidget = () => {
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

  if (!user || user.hideWhatsNew) {
    return null
  }

  return (
    <Card mode="elevated" theme={{ roundness: 5 }} style={{ marginBottom: 15, marginHorizontal: 10 }}>
      <Card.Content style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}>
        <Text variant="titleLarge" style={{ marginHorizontal: 15, marginTop: 5 }}>
          What's New
        </Text>
        <Divider style={{ marginTop: 15 }} />
        <Text variant="bodyMedium" style={{ margin: 15 }}>
          I have released an update to better support users with both USD and CAD accounts. You can now set your
          preferred currency in your profile which will be used for net worth calculation and budgeting. The accounts
          tab will show the balance in its native currency but will convert it your profiles currency for group totals
          etc. I have defaulted everyone’s profile to USD so Canadians will have to update it through the profile screen
          in the more tab. Let me know if there’s any issues or suggestions to improve currency support further.
        </Text>
        <Divider />
        <View style={{ alignSelf: 'flex-end' }}>
          <Button
            mode="text"
            style={{ paddingVertical: 5 }}
            onPress={() => {
              mutate({
                hideWhatsNew: true
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
