import { Bill } from 'frontend-types'
import { formatAccountName, formatDateInUtc, formatDollars } from 'frontend-utils'
import { memo } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Divider, Text, useTheme } from 'react-native-paper'

import { expenseColor, incomeColor } from '../../constants/theme'
import { useUserTokenContext } from '../../contexts/user-token.context'
import { AccountIcon } from '../account/AccountIcon'

type Props = {
  bill: Bill
  onSelected?: (bill: Bill) => void
  backgroundColor?: string
}

const BI = ({ bill, onSelected, backgroundColor }: Props) => {
  const { colors } = useTheme()
  const { currencyCode } = useUserTokenContext()

  return (
    <TouchableOpacity
      key={`${bill.issueDate}-${bill.accountId}`}
      onPress={() => {
        if (onSelected) {
          onSelected(bill)
        }
      }}
      style={{
        flex: 1,
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
        <AccountIcon account={bill.account} />
        <View style={{ flex: 1, marginRight: 15 }}>
          <Text variant="titleMedium" numberOfLines={1}>
            {formatAccountName(bill.account)}
          </Text>
          <Text variant="bodyMedium" numberOfLines={1} style={{ color: colors.outline }}>
            {formatDateInUtc(bill.issueDate, 'MMMM dd, yyyy')}
          </Text>
          {bill.dueDate && (
            <Text variant="bodyMedium" numberOfLines={1} style={{ color: colors.outline }}>
              Due: {formatDateInUtc(bill.dueDate, 'MMMM dd, yyyy')}
            </Text>
          )}
          {bill.isPaid ? (
            <Text variant="bodyMedium" numberOfLines={1} style={{ color: incomeColor }}>
              Paid
            </Text>
          ) : bill.isOverdue ? (
            <Text variant="bodyMedium" numberOfLines={1} style={{ color: expenseColor }}>
              Overdue
            </Text>
          ) : null}
        </View>
        <Text
          variant="titleMedium"
          style={{ color: bill.isPaid ? incomeColor : bill.isOverdue ? expenseColor : colors.onSurface }}
        >
          {formatDollars(bill.balance, bill.account.currencyCode)}
          {bill.account.currencyCode === currencyCode ? '' : ` ${bill.account.currencyCode}`}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export const BillItem = memo(BI, (prev, next) => prev.bill === next.bill && prev.onSelected === next.onSelected)
