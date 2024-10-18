import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons'
import { RecurringTransaction } from 'frontend-types'
import {
  formatDateInUtc,
  formatDollars,
  formatFrequency,
  formatRecurringTransaction,
  getNextRecurringDate
} from 'frontend-utils'
import _ from 'lodash'
import { useMemo } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Avatar, Divider, Text, useTheme } from 'react-native-paper'

import { useUserTokenContext } from '../../contexts/user-token.context'

type Props = {
  transaction: RecurringTransaction
  date?: Date
  onSelected?: (transaction: RecurringTransaction) => void
  isSelected?: boolean
  isSelecting?: boolean
  backgroundColor?: string
}

export const RecurringTransactionItem = ({
  transaction,
  date,
  onSelected,
  isSelected,
  isSelecting = false,
  backgroundColor
}: Props) => {
  const { colors } = useTheme()
  const { currencyCode } = useUserTokenContext()

  const nextRecurringDate = useMemo(
    () => date ?? getNextRecurringDate(transaction.startDate, transaction.frequency, transaction.interval),
    [date, transaction]
  )

  return (
    <TouchableOpacity
      key={transaction.id}
      onPress={() => {
        if (onSelected) {
          onSelected(transaction)
        }
      }}
      style={{
        backgroundColor: backgroundColor ?? colors.elevation.level2
      }}
    >
      <Divider />
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          backgroundColor: 'transparent',
          alignItems: 'center',
          padding: 15
        }}
      >
        {isSelecting && (
          <>
            {isSelected ? (
              <Avatar.Icon
                size={24}
                icon={() => <FontAwesome5 name="check" size={12} color="white" />}
                style={{ marginEnd: 15, backgroundColor: colors.primary }}
              />
            ) : (
              <Avatar.Icon size={24} icon={() => null} style={{ marginEnd: 15, backgroundColor: colors.outline }} />
            )}
          </>
        )}
        {_.isEmpty(transaction.merchant.icon) ? (
          <Avatar.Icon
            size={36}
            icon={() => <FontAwesome6 name="building" size={20} color={colors.outline} />}
            style={{ marginEnd: 15, backgroundColor: colors.surface }}
          />
        ) : (
          <Avatar.Image size={36} source={{ uri: transaction.merchant.icon }} style={{ marginEnd: 15 }} />
        )}
        <View style={{ flex: 1 }}>
          <Text variant="titleMedium" numberOfLines={1}>
            {formatRecurringTransaction(transaction)}
          </Text>
          <Text variant="bodyMedium" style={{ color: colors.outline }} numberOfLines={1}>
            {formatFrequency(transaction.startDate, transaction.frequency, transaction.interval)}
          </Text>
        </View>
        <View style={{ marginRight: 15, alignItems: 'flex-end' }}>
          <Text
            variant="titleMedium"
            style={{
              ...(transaction.amount >= 0 ? {} : { color: '#19d2a5' })
            }}
          >
            {transaction.amount < 0 ? '+' : ''}
            {formatDollars(transaction.amount, transaction.account.currencyCode)}
            {transaction.account.currencyCode === currencyCode ? '' : ` ${transaction.account.currencyCode}`}
          </Text>
          {nextRecurringDate && (
            <Text variant="bodyMedium" style={{ color: colors.outline }} numberOfLines={1}>
              {formatDateInUtc(nextRecurringDate, 'MMM dd')}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}
