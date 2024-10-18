import { AntDesign } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getMerchants } from 'frontend-api'
import { useMemo } from 'react'
import { TouchableOpacity } from 'react-native'
import { Text, useTheme } from 'react-native-paper'

import { View } from '../common/View'
import { MerchantFilterSelection } from './MerchantFilterSelection'

type Props = {
  merchantIds: number[]
  onDelete: (categoryId: number) => void
}

export const MerchantFilter: React.FC<Props> = ({ merchantIds, onDelete }) => {
  const { colors } = useTheme()
  const navigation = useNavigation()

  const { data: merchants = [] } = useQuery({
    queryKey: [ApiQuery.Merchants],
    queryFn: async () => {
      const res = await getMerchants()
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  const filteredMerchants = useMemo(() => merchants.filter((a) => merchantIds.includes(a.id)), [merchants, merchantIds])

  return (
    <>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 15, marginVertical: 10 }}>
        <Text variant="bodyMedium" style={{ flex: 1 }}>
          Merchants
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('SelectMerchant', {
              merchantIds,
              eventName: 'onMerchantFilterSelected',
              multiple: true
            })
          }
        >
          <AntDesign name="pluscircleo" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      </View>
      {filteredMerchants.map((merchant) => (
        <MerchantFilterSelection key={merchant.id} merchant={merchant} onDelete={() => onDelete(merchant.id)} />
      ))}
    </>
  )
}
