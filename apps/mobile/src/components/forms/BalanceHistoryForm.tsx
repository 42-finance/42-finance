import { format } from 'date-fns'
import { BalanceHistory } from 'frontend-types'
import { dateToLocal, getCurrencySymbol, todayInUtc } from 'frontend-utils'
import { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import CurrencyInput from 'react-native-currency-input'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { Button, TextInput, useTheme } from 'react-native-paper'
import { CurrencyCode } from 'shared-types'

import { View } from '../common/View'

export type BalanceHistoryFormFields = {
  date: Date
  currentBalance: number
}

type Props = {
  history?: BalanceHistory
  currencyCode: CurrencyCode
  onSubmit: (values: BalanceHistoryFormFields) => void
  submitting: boolean
}

export const BalanceHistoryForm: React.FC<Props> = ({ history, currencyCode, onSubmit, submitting }) => {
  const { colors } = useTheme()

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [date, setDate] = useState(history ? dateToLocal(history.date) : dateToLocal(todayInUtc()))
  const [currentBalance, setCurrentBalance] = useState<number | null>(history?.currentBalance ?? 0)

  return (
    <View style={{ backgroundColor: colors.background, padding: 10 }}>
      <View style={{ position: 'relative' }}>
        {history == null && (
          <>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              activeOpacity={1}
              style={{ position: 'relative', marginBottom: 5 }}
            >
              <View pointerEvents="box-only">
                <TextInput label="Date" editable={false} value={format(date, 'MMMM d, yyyy')} />
              </View>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={showDatePicker}
              date={date}
              mode="date"
              display="inline"
              onConfirm={(date) => {
                setShowDatePicker(false)
                setDate(date)
              }}
              onCancel={() => {
                setShowDatePicker(false)
              }}
            />
          </>
        )}
        <TextInput
          render={(props) => (
            <CurrencyInput
              {...props}
              value={currentBalance}
              onChangeValue={(value) => setCurrentBalance(value)}
              keyboardType="number-pad"
              prefix={getCurrencySymbol(currencyCode)}
              delimiter=","
              separator="."
              precision={2}
            />
          )}
        />
        <Button
          mode="contained"
          style={{ marginTop: 5, alignSelf: 'stretch' }}
          disabled={submitting}
          onPress={() => {
            const value = Number(currentBalance)
            onSubmit({
              date,
              currentBalance: value
            })
          }}
          loading={submitting}
        >
          Save Balance History
        </Button>
      </View>
    </View>
  )
}
