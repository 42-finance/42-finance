import { FontAwesome5 } from '@expo/vector-icons'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getTransaction } from 'frontend-api'
import * as React from 'react'
import { useEffect } from 'react'
import { FlatList, TouchableOpacity } from 'react-native'
import { ProgressBar, useTheme } from 'react-native-paper'

import { View } from '../components/common/View'
import { RuleItem } from '../components/list-items/RuleItem'
import { TransactionItem } from '../components/list-items/TransactionItem'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const TransactionRulesScreen = ({ navigation, route }: RootStackScreenProps<'TransactionRules'>) => {
  const { transactionId } = route.params

  const { colors } = useTheme()

  const { data: transaction } = useQuery({
    queryKey: [ApiQuery.Transaction, transactionId],
    queryFn: async () => {
      const res = await getTransaction(transactionId)
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return null
    },
    placeholderData: keepPreviousData
  })

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('AddRule', {})}>
          <FontAwesome5 name="plus" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      )
    })
  }, [colors.onSurface, navigation])

  if (!transaction) {
    return <ProgressBar indeterminate visible />
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{}}>
        <TransactionItem transaction={transaction} showDate flex={false} />
      </View>
      <FlatList
        data={transaction.matchingRules}
        renderItem={({ item, index }) => (
          <RuleItem
            key={item.id}
            rule={item}
            onSelected={() => {
              navigation.navigate('EditRule', { ruleId: item.id })
            }}
            index={index}
          />
        )}
      />
    </View>
  )
}
