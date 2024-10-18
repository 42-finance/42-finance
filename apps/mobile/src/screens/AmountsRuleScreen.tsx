import { AntDesign } from '@expo/vector-icons'
import { eventEmitter } from 'frontend-utils'
import { mapAmountFilter } from 'frontend-utils/src/mappers/map-amount-filter'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { SegmentedButtons, useTheme } from 'react-native-paper'
import { AmountFilter, TransactionAmountType } from 'shared-types'

import { CurrencyInput } from '../components/common/CurrencyInput'
import { PaperPickerField } from '../components/common/PaperPickerField'
import { View } from '../components/common/View'
import { useUserTokenContext } from '../contexts/user-token.context'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const AmountsRuleScreen = ({ route }: RootStackScreenProps<'AmountsRule'>) => {
  const { amountType, amountFilter, amountValue, amountValue2 } = route.params

  const { colors } = useTheme()
  const { currencyCode } = useUserTokenContext()

  const { control, setValue, watch } = useForm({
    defaultValues: {
      amountType,
      amountFilter,
      amountValue,
      amountValue2
    }
  })

  const type = watch('amountType')
  const filter = watch('amountFilter')
  const value = watch('amountValue')
  const value2 = watch('amountValue2')

  useEffect(() => {
    eventEmitter.emit('onAmountSelected', {
      type,
      filter,
      value,
      value2
    })
  }, [type, filter, value, value2])

  return (
    <View>
      <SegmentedButtons
        value={type ?? 'disabled'}
        onValueChange={(value) =>
          value === 'disabled' ? setValue('amountType', null) : setValue('amountType', value as TransactionAmountType)
        }
        buttons={[
          {
            value: 'disabled',
            label: 'DISABLED',
            icon: () => (
              <AntDesign
                name="closecircleo"
                size={16}
                color={colors.onSecondaryContainer}
                style={{ marginEnd: 4, marginTop: 1 }}
              />
            )
          },
          {
            value: TransactionAmountType.Debit,
            label: 'DEBIT',
            icon: () => (
              <AntDesign
                name="minuscircleo"
                size={16}
                color={colors.onSecondaryContainer}
                style={{ marginEnd: 4, marginTop: 1 }}
              />
            )
          },
          {
            value: TransactionAmountType.Credit,
            label: 'CREDIT',
            icon: () => (
              <AntDesign
                name="pluscircleo"
                size={16}
                color={colors.onSecondaryContainer}
                style={{ marginEnd: 4, marginTop: 1 }}
              />
            )
          }
        ]}
        style={{ marginHorizontal: 5, marginTop: 5 }}
      />
      {type && (
        <PaperPickerField
          label="Filter"
          name="amountFilter"
          control={control}
          items={Object.values(AmountFilter).map((a) => ({ value: a, label: mapAmountFilter(a) }))}
          style={{
            marginTop: 5,
            marginHorizontal: 5
          }}
        />
      )}
      {type && filter && (
        <CurrencyInput
          label={filter === AmountFilter.Between ? 'Minimum' : 'Amount'}
          name="amountValue"
          control={control}
          style={{
            marginTop: 5,
            marginHorizontal: 5
          }}
          currencyCode={currencyCode}
        />
      )}
      {type && filter === AmountFilter.Between && (
        <CurrencyInput
          label="Maximum"
          name="amountValue2"
          control={control}
          style={{
            marginTop: 5,
            marginHorizontal: 5
          }}
          currencyCode={currencyCode}
        />
      )}
    </View>
  )
}
