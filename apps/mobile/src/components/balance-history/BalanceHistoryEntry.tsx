import { Entypo } from '@expo/vector-icons'
import { BalanceHistory } from 'frontend-types'
import { formatDateInUtc, formatDollarsSigned } from 'frontend-utils'
import { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import MaskInput from 'react-native-mask-input'
import { Divider, Text, TextInput, useTheme } from 'react-native-paper'

import { useUserTokenContext } from '../../contexts/user-token.context'
import { dollarMask } from '../../utils/mask.utils'
import { ActivityIndicator } from '../common/ActivityIndicator'
import { View } from '../common/View'

type Props = {
  history: BalanceHistory
  isEditing: boolean
  isLoading: boolean
  onPress: (history: BalanceHistory) => void
  onEdit: (history: BalanceHistory, amount: number) => void
  onDelete: (history: BalanceHistory) => void
}

export const BalanceHistoryEntry: React.FC<Props> = ({ history, isEditing, isLoading, onPress, onEdit, onDelete }) => {
  const { colors } = useTheme()
  const { currencyCode } = useUserTokenContext()

  const [amount, setAmount] = useState('')

  useEffect(() => {
    setAmount(history.currentBalance.toString())
  }, [history.currentBalance])

  return (
    <View>
      <TouchableOpacity onPress={() => onPress(history)}>
        <Divider />
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 15,
            paddingVertical: 20,
            alignItems: 'center',
            backgroundColor: colors.elevation.level2
          }}
        >
          <Text variant="titleMedium" style={{ flex: 1 }}>
            {formatDateInUtc(history.date, 'MMM dd, yyyy')}
          </Text>
          <Text variant="titleMedium" style={{ width: 90, textAlign: 'right', marginEnd: 10 }}>
            {formatDollarsSigned(history.currentBalance, currencyCode)}
          </Text>
          <TouchableOpacity onPress={() => onDelete(history)}>
            <Entypo name="cross" size={30} color={colors.onSurface} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      {isEditing && (
        <View style={{ backgroundColor: colors.background, padding: 10 }}>
          <View style={{ position: 'relative' }}>
            <TextInput
              keyboardType="number-pad"
              value={amount}
              onChangeText={(value) => setAmount(value)}
              right={
                !isLoading && (
                  <TextInput.Icon
                    icon="check"
                    onPress={() => {
                      onEdit(history, Number(amount))
                    }}
                    forceTextInputFocus={false}
                  />
                )
              }
              render={(props) => (
                <MaskInput
                  {...props}
                  onChangeText={(_masked, unmasked) => setAmount(unmasked)}
                  mask={dollarMask(currencyCode)}
                />
              )}
            />
            {isLoading && <ActivityIndicator style={{ position: 'absolute', right: 16, top: 15 }} />}
          </View>
        </View>
      )}
    </View>
  )
}
