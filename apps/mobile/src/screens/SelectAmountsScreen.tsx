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
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export type AmountFormFields = {
  amountType: TransactionAmountType | null
  amountFilter: AmountFilter | null
  amountValue: number | null
  amountValue2: number | null
}

export const SelectAmountsScreen = ({ route }: RootStackScreenProps<'SelectAmounts'>) => {
  const { eventName, defaultAmountType, defaultAmountFilter, defaultAmountValue, defaultAmountValue2 } = route.params

  const { colors } = useTheme()

  const { control, setValue, watch } = useForm<AmountFormFields>({
    defaultValues: {
      amountType: defaultAmountType,
      amountFilter: defaultAmountFilter,
      amountValue: defaultAmountValue,
      amountValue2: defaultAmountValue2
    }
  })

  const amountType = watch('amountType')
  const amountFilter = watch('amountFilter')
  const amountValue = watch('amountValue')
  const amountValue2 = watch('amountValue2')

  useEffect(() => {
    eventEmitter.emit(eventName, {
      amountType,
      amountFilter,
      amountValue,
      amountValue2
    })
  }, [amountType, amountFilter, amountValue, amountValue2, eventName])

  return (
    <View>
      <SegmentedButtons
        value={amountType ?? 'disabled'}
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
      {amountType && (
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
      {amountType && amountFilter && (
        <CurrencyInput
          label={amountFilter === AmountFilter.Between ? 'Minimum' : 'Amount'}
          name="amountValue"
          control={control}
          style={{
            marginTop: 5,
            marginHorizontal: 5
          }}
        />
      )}
      {amountType && amountFilter === AmountFilter.Between && (
        <CurrencyInput
          label="Maximum"
          name="amountValue2"
          control={control}
          style={{
            marginTop: 5,
            marginHorizontal: 5
          }}
        />
      )}
    </View>
  )
}
