import { Entypo } from '@expo/vector-icons'
import { BalanceHistory } from 'frontend-types'
import { formatDateInUtc, formatDollarsSigned } from 'frontend-utils'
import { TouchableOpacity } from 'react-native'
import { Divider, Text, useTheme } from 'react-native-paper'
import { CurrencyCode } from 'shared-types'

import { View } from '../common/View'
import { BalanceHistoryForm, BalanceHistoryFormFields } from '../forms/BalanceHistoryForm'

type Props = {
  history: BalanceHistory
  currencyCode: CurrencyCode
  isEditing: boolean
  isLoading: boolean
  onPress: (history: BalanceHistory) => void
  onEdit: (values: BalanceHistoryFormFields) => void
  onDelete: (history: BalanceHistory) => void
}

export const BalanceHistoryEntry: React.FC<Props> = ({
  history,
  currencyCode,
  isEditing,
  isLoading,
  onPress,
  onEdit,
  onDelete
}) => {
  const { colors } = useTheme()

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
            {formatDateInUtc(history.date, 'MMMM dd, yyyy')}
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
        <BalanceHistoryForm history={history} currencyCode={currencyCode} onSubmit={onEdit} submitting={isLoading} />
      )}
    </View>
  )
}
