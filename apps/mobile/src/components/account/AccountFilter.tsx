import { AntDesign } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getAccounts } from 'frontend-api'
import { useMemo } from 'react'
import { TouchableOpacity } from 'react-native'
import { Text, useTheme } from 'react-native-paper'

import { View } from '../common/View'
import { AccountFilterSelection } from './AccountFilterSelection'

type Props = {
  accountIds: string[]
  onDelete: (accountId: string) => void
}

export const AccountFilter: React.FC<Props> = ({ accountIds, onDelete }) => {
  const { colors } = useTheme()
  const navigation = useNavigation()

  const { data: accounts = [] } = useQuery({
    queryKey: [ApiQuery.Accounts],
    queryFn: async () => {
      const res = await getAccounts()
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  const filteredAccounts = useMemo(() => accounts.filter((a) => accountIds.includes(a.id)), [accounts, accountIds])

  return (
    <>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 15, marginVertical: 10 }}>
        <Text variant="bodyMedium" style={{ flex: 1 }}>
          Accounts
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('SelectAccount', {
              accountIds,
              eventName: 'onAccountFilterSelected',
              multiple: true
            })
          }
        >
          <AntDesign name="pluscircleo" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      </View>
      {filteredAccounts.map((account) => (
        <AccountFilterSelection key={account.id} account={account} onDelete={() => onDelete(account.id)} />
      ))}
    </>
  )
}
