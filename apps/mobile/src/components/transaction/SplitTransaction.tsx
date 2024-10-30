import { getCurrencySymbol } from 'frontend-utils'
import { useState } from 'react'
import CurrencyInput from 'react-native-currency-input'
import { Divider, TextInput, useTheme } from 'react-native-paper'

import { Transaction } from '../../../../../libs/frontend-types/src/transaction.type'
import { View } from '../common/View'
import { TransactionItem } from '../list-items/TransactionItem'

type Props = {
  transaction: Transaction
  onPress: (transaction: Transaction) => void
  onEdit: (transaction: Transaction, amount: number) => void
  isEditing: boolean
}

export const SplitTransaction: React.FC<Props> = ({ transaction, onPress, onEdit, isEditing }) => {
  const { colors } = useTheme()

  const [amount, setAmount] = useState<number | null>(transaction.amount)

  return (
    <View>
      <TransactionItem transaction={transaction} onSelected={onPress} />
      <Divider style={{ backgroundColor: colors.elevation.level2 }} />
      {isEditing && (
        <View style={{ backgroundColor: colors.background, padding: 10 }}>
          <TextInput
            right={
              <TextInput.Icon
                icon="check"
                onPress={() => {
                  const value = Number(amount)
                  transaction.amount = value
                  onEdit(transaction, value)
                }}
                forceTextInputFocus={false}
              />
            }
            render={(props) => (
              <CurrencyInput
                {...props}
                value={amount}
                onChangeValue={(value) => setAmount(value)}
                keyboardType="number-pad"
                prefix={getCurrencySymbol(transaction.account.currencyCode)}
                delimiter=","
                separator="."
                precision={2}
              />
            )}
          />
        </View>
      )}
    </View>
  )
}
