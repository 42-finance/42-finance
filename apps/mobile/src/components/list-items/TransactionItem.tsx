import { Entypo, FontAwesome5, FontAwesome6 } from '@expo/vector-icons'
import { formatAccountName, formatDateInUtc, formatDollars } from 'frontend-utils'
import { memo } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Avatar, Divider, Text, useTheme } from 'react-native-paper'

import { Transaction } from '../../../../../libs/frontend-types/src/transaction.type'
import { useUserTokenContext } from '../../contexts/user-token.context'

type Props = {
  transaction: Transaction
  isSelecting?: boolean
  isSelected?: boolean
  onSelected?: (transaction: Transaction) => void
  backgroundColor?: string
  showAccount?: boolean
  showDate?: boolean
  flex?: boolean
}

const TI = ({
  transaction,
  isSelecting,
  onSelected,
  isSelected,
  backgroundColor,
  showAccount,
  showDate,
  flex = true
}: Props) => {
  const { colors } = useTheme()
  const { currencyCode } = useUserTokenContext()

  return (
    <TouchableOpacity
      key={transaction.id}
      onPress={() => {
        if (onSelected) {
          onSelected(transaction)
        }
      }}
      style={{
        flex: flex ? 1 : undefined,
        alignItems: 'stretch',
        backgroundColor
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
        <Text variant="titleMedium" style={{ marginRight: 15 }}>
          {transaction.category.icon}
        </Text>
        <View style={{ flex: 1, marginRight: 15 }}>
          <Text
            variant="titleMedium"
            style={{ fontStyle: transaction.pending ? 'italic' : 'normal' }}
            numberOfLines={1}
          >
            {transaction.merchant.name}
          </Text>
          {showAccount && (
            <Text
              variant="bodyMedium"
              style={{ fontStyle: transaction.pending ? 'italic' : 'normal', color: colors.outline }}
              numberOfLines={1}
            >
              {formatAccountName(transaction.account)}
            </Text>
          )}
          {showDate && (
            <Text
              variant="bodyMedium"
              style={{ fontStyle: transaction.pending ? 'italic' : 'normal', color: colors.outline }}
              numberOfLines={1}
            >
              {formatDateInUtc(transaction.date, 'MMMM dd, yyyy')}
            </Text>
          )}
        </View>
        {transaction.splitTransactionId && (
          <FontAwesome6 name="code-fork" size={16} color={colors.outline} style={{ marginEnd: 5 }} />
        )}
        {transaction.pending && <Entypo name="hour-glass" size={16} color={colors.outline} style={{ marginEnd: 5 }} />}
        <Text
          variant="titleMedium"
          style={{
            ...(transaction.amount >= 0 ? {} : { color: '#19d2a5' }),
            fontStyle: transaction.pending ? 'italic' : 'normal'
          }}
        >
          {transaction.amount < 0 ? '+' : ''}
          {formatDollars(transaction.amount, transaction.account.currencyCode)}
          {transaction.account.currencyCode === currencyCode ? '' : ` ${transaction.account.currencyCode}`}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export const TransactionItem = memo(
  TI,
  (prev, next) =>
    prev.transaction === next.transaction &&
    prev.isSelecting === next.isSelecting &&
    prev.isSelected === next.isSelected &&
    prev.onSelected === next.onSelected &&
    prev.backgroundColor === next.backgroundColor
)
