import { AntDesign, FontAwesome, FontAwesome5, FontAwesome6, MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, EditUserRequest, editUser, getUser } from 'frontend-api'
import { getFirstName } from 'frontend-utils'
import { Button, Card, Divider, Text, useTheme } from 'react-native-paper'

import { useRefetchOnFocus } from '../../hooks/use-refetch-on-focus.hook'
import { View } from '../common/View'
import { GettingStartedItem } from './GettingStartedItem'

export const GettingStartedWidget = () => {
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

  if (!user?.accountSetup || user.hideGettingStarted) {
    return null
  }

  if (
    user.accountSetup.accounts &&
    user.accountSetup.categories &&
    user.accountSetup.budget &&
    user.accountSetup.currency
  ) {
    return null
  }

  return (
    <Card mode="elevated" theme={{ roundness: 5 }} style={{ marginBottom: 15, marginHorizontal: 10 }}>
      <Card.Content style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}>
        <Text variant="titleLarge" style={{ marginHorizontal: 15, marginTop: 5 }}>
          Welcome {getFirstName(user.name)}, complete the following steps to finish setting up your account
        </Text>
        <Divider style={{ marginTop: 15 }} />
        <GettingStartedItem
          title="Purchase subscription"
          icon={<FontAwesome name="credit-card" size={18} color={colors.onSurface} style={{ marginStart: 1 }} />}
          complete={user.accountSetup.subscription}
          onPress={() => navigation.navigate('Subscription')}
        />
        <Divider />
        <GettingStartedItem
          title="Add an account"
          icon={<MaterialIcons name="account-balance" size={18} color={colors.onSurface} style={{ marginStart: 2 }} />}
          complete={user.accountSetup.accounts}
          onPress={() => navigation.navigate('AddAsset')}
        />
        <Divider />
        <GettingStartedItem
          title="Add a custom category"
          icon={<AntDesign name="appstore-o" size={18} color={colors.onSurface} />}
          complete={user.accountSetup.categories}
          onPress={() => navigation.navigate('Categories')}
        />
        <Divider />
        <GettingStartedItem
          title="Create a budget"
          icon={<FontAwesome6 name="money-bill-trend-up" size={18} color={colors.onSurface} />}
          complete={user.accountSetup.budget}
          onPress={() => navigation.navigate('BudgetTab')}
        />
        <Divider />
        <GettingStartedItem
          title="Update preferred currency"
          icon={<FontAwesome5 name="dollar-sign" size={18} color={colors.onSurface} />}
          complete={user.accountSetup.currency}
          onPress={() => navigation.navigate('Profile')}
        />
        <Divider />
        <View style={{ alignSelf: 'flex-end' }}>
          <Button
            mode="text"
            style={{ paddingVertical: 5 }}
            onPress={() => {
              mutate({
                hideGettingStarted: true
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
