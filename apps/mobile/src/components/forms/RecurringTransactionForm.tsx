import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import { Account, Merchant } from 'frontend-types'
import { eventEmitter, formatAccountName, mapCategoryType, mapFrequency } from 'frontend-utils'
import { useEffect, useMemo } from 'react'
import { FieldError, useForm } from 'react-hook-form'
import { View } from 'react-native'
import { Button } from 'react-native-paper'
import { CategoryType, Frequency } from 'shared-types'
import * as Yup from 'yup'

import { CurrencyInput } from '../common/CurrencyInput'
import { DateField } from '../common/DateField'
import { PaperPickerField } from '../common/PaperPickerField'
import { TextInput } from '../common/TextInput'
import { TouchableTextInput } from '../common/TouchableTextInput'

export type RecurringTransactionFormFields = {
  name: string
  startDate: Date
  frequency: Frequency
  interval: number | null
  amount: number
  type: CategoryType
  account: Account | null
  merchant: Merchant | null
}

type Props = {
  transactionInfo?: RecurringTransactionFormFields
  onSubmit: (values: RecurringTransactionFormFields) => void
  submitting: boolean
}

export const RecurringTransactionForm: React.FC<Props> = ({ transactionInfo, onSubmit, submitting }) => {
  const navigation = useNavigation()

  const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    startDate: Yup.date().required('Start date is required'),
    frequency: Yup.mixed<Frequency>().required('Frequency is required'),
    interval: Yup.number().moreThan(0, 'Interval must be greater than 0').nullable().defined(),
    amount: Yup.number().moreThan(0, 'Amount must be greater than 0').required('Amount is required'),
    type: Yup.mixed<CategoryType>().required('Type is required'),
    account: Yup.mixed<Account>().required('Account is required').nullable().notOneOf([null], 'Account is required'),
    merchant: Yup.mixed<Merchant>().required('Merchant is required').nullable().notOneOf([null], 'Merchant is required')
  })

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch
  } = useForm<RecurringTransactionFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: transactionInfo?.name ?? '',
      startDate: transactionInfo?.startDate ?? new Date(),
      frequency: transactionInfo?.frequency ?? Frequency.MonthlyExactDay,
      interval: transactionInfo?.interval ?? null,
      amount: transactionInfo?.amount ?? 0,
      type: transactionInfo?.type ?? CategoryType.Expense,
      account: transactionInfo?.account ?? null,
      merchant: transactionInfo?.merchant ?? null
    }
  })

  useEffect(() => {
    const onAccountSelected = (account: Account) => {
      setValue('account', account)
    }
    eventEmitter.on('onAccountSelected', onAccountSelected)

    const onMerchantSelected = (merchant: Merchant) => {
      setValue('merchant', merchant)
    }
    eventEmitter.on('onMerchantSelected', onMerchantSelected)

    return () => {
      eventEmitter.off('onAccountSelected', onAccountSelected)
      eventEmitter.off('onMerchantSelected', onMerchantSelected)
    }
  }, [setValue])

  const startDate = watch('startDate')
  const frequency = watch('frequency')

  const frequencyItems = useMemo(() => Object.values(Frequency).map((f) => ({ label: mapFrequency(f), value: f })), [])

  const typeItems = useMemo(() => Object.values(CategoryType).map((c) => ({ label: mapCategoryType(c), value: c })), [])

  return (
    <View>
      <TextInput
        label="Name"
        name="name"
        control={control}
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
        error={errors.name}
      />
      <PaperPickerField
        label="Frequency"
        name="frequency"
        control={control}
        items={frequencyItems}
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
        error={errors.frequency}
      />
      {frequency === Frequency.FixedInterval && (
        <TextInput
          label="Interval"
          name="interval"
          control={control}
          style={{
            marginTop: 5,
            marginHorizontal: 5
          }}
          error={errors.interval}
          keyboardType="number-pad"
        />
      )}
      <DateField
        label="Start Date"
        name="startDate"
        control={control}
        value={startDate}
        setValue={(value) => {
          setValue('startDate', value)
        }}
        error={errors.startDate}
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
      />
      <PaperPickerField
        label="Type"
        name="type"
        control={control}
        items={typeItems}
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
        error={errors.type}
      />
      <CurrencyInput
        label="Amount"
        name="amount"
        control={control}
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
        error={errors.amount}
      />
      <TouchableTextInput
        label="Account"
        name="account"
        control={control}
        format={(value: Account) => (value ? formatAccountName(value) : '')}
        onPress={() =>
          navigation.navigate('SelectAccount', { accountIds: [], eventName: 'onAccountSelected', multiple: false })
        }
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
        error={errors.account as FieldError}
      />
      <TouchableTextInput
        label="Merchant"
        name="merchant"
        control={control}
        format={(value: Merchant) => (value ? value.name : '')}
        onPress={() =>
          navigation.navigate('SelectMerchant', { merchantIds: [], eventName: 'onMerchantSelected', multiple: false })
        }
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
        error={errors.account as FieldError}
      />
      <Button
        mode="contained"
        style={{ marginHorizontal: 5, marginTop: 5, alignSelf: 'stretch' }}
        disabled={submitting}
        onPress={handleSubmit(onSubmit)}
        loading={submitting}
      >
        Save Recurring Transaction
      </Button>
    </View>
  )
}
