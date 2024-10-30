import { BalanceHistory } from 'frontend-types'
import { dateToLocal, todayInUtc } from 'frontend-utils'
import { useForm } from 'react-hook-form'
import { Button, useTheme } from 'react-native-paper'

import { useUserTokenContext } from '../../contexts/user-token.context'
import { dollarCentMask } from '../../utils/mask.utils'
import { DateField } from '../common/DateField'
import { TextInput } from '../common/TextInput'
import { View } from '../common/View'

export type BalanceHistoryFormFields = {
  date: Date
  currentBalance: string
}

type Props = {
  history?: BalanceHistory
  onSubmit: (values: BalanceHistoryFormFields) => void
  submitting: boolean
}

export const BalanceHistoryForm: React.FC<Props> = ({ history, onSubmit, submitting }) => {
  const { colors } = useTheme()
  const { currencyCode } = useUserTokenContext()

  const { control, setValue, handleSubmit, watch } = useForm<BalanceHistoryFormFields>({
    defaultValues: {
      date: history ? dateToLocal(history.date) : dateToLocal(todayInUtc()),
      currentBalance: (history?.currentBalance ?? 0).toFixed(2)
    }
  })

  const date = watch('date')

  return (
    <View style={{ backgroundColor: colors.background, padding: 10 }}>
      <View style={{ position: 'relative' }}>
        {history == null && (
          <DateField
            label="Date"
            name="date"
            control={control}
            value={date ?? undefined}
            setValue={(value) => {
              setValue('date', value)
            }}
            style={{
              marginBottom: 5
            }}
          />
        )}
        <TextInput
          label="Amount"
          name="currentBalance"
          control={control}
          mask={dollarCentMask(currencyCode)}
          keyboardType="decimal-pad"
        />
        <Button
          mode="contained"
          style={{ marginTop: 5, alignSelf: 'stretch' }}
          disabled={submitting}
          onPress={handleSubmit(onSubmit)}
          loading={submitting}
        >
          Save Balance History
        </Button>
      </View>
    </View>
  )
}
