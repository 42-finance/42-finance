import { AntDesign } from '@expo/vector-icons'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import { eventEmitter } from 'frontend-utils'
import { formatAccountName } from 'frontend-utils/src/account/account.utils'
import { useEffect } from 'react'
import { FieldError, useForm } from 'react-hook-form'
import { View } from 'react-native'
import { Button, SegmentedButtons, useTheme } from 'react-native-paper'
import { TransactionAmountType } from 'shared-types'
import * as Yup from 'yup'

import { Account } from '../../../../../libs/frontend-types/src/account.type'
import { Category } from '../../../../../libs/frontend-types/src/category.type'
import { useUserTokenContext } from '../../contexts/user-token.context'
import { CurrencyInput } from '../common/CurrencyInput'
import { DateField } from '../common/DateField'
import { TextInput } from '../common/TextInput'
import { TouchableTextInput } from '../common/TouchableTextInput'

export type TransactionFormFields = {
  date: Date
  amount: number
  account: Account | null
  category: Category | null
  merchantName: string
  type: string
}

type Props = {
  transactionInfo?: TransactionFormFields
  onSubmit: (values: TransactionFormFields) => void
  submitting: boolean
}

export const TransactionForm: React.FC<Props> = ({ transactionInfo, onSubmit, submitting }) => {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const { currencyCode } = useUserTokenContext()

  const schema = Yup.object().shape({
    date: Yup.date().required('Date is required'),
    amount: Yup.number().moreThan(0, 'Amount must be greater than 0').required('Amount is required'),
    account: Yup.mixed<Account>().required('Account is required').nullable().notOneOf([null], 'Account is required'),
    category: Yup.mixed<Category>()
      .required('Category is required')
      .nullable()
      .notOneOf([null], 'Category is required'),
    merchantName: Yup.string().required('Merchant is required'),
    type: Yup.string().required('Type is required')
  })

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch
  } = useForm<TransactionFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      date: transactionInfo?.date ?? new Date(),
      amount: transactionInfo?.amount ?? 0,
      account: transactionInfo?.account ?? null,
      category: transactionInfo?.category ?? null,
      merchantName: transactionInfo?.merchantName ?? '',
      type: transactionInfo?.type ?? 'debit'
    }
  })

  useEffect(() => {
    const onCategorySelected = (category: Category) => {
      setValue('category', category)
    }

    eventEmitter.on('onCategorySelected', onCategorySelected)

    const onAccountSelected = (account: Account) => {
      setValue('account', account)
    }

    eventEmitter.on('onAccountSelected', onAccountSelected)

    return () => {
      eventEmitter.off('onCategorySelected', onCategorySelected)
      eventEmitter.off('onAccountSelected', onAccountSelected)
    }
  }, [setValue])

  const type = watch('type')
  const date = watch('date')
  const account = watch('account')

  return (
    <View>
      <SegmentedButtons
        value={type}
        onValueChange={(value) => setValue('type', value)}
        buttons={[
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
      <CurrencyInput
        label="Amount"
        name="amount"
        control={control}
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
        error={errors.amount}
        currencyCode={account?.currencyCode ?? currencyCode}
      />
      <TextInput
        label="Merchant name"
        name="merchantName"
        control={control}
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
        error={errors.merchantName}
      />
      <DateField
        label="Date"
        name="date"
        control={control}
        value={date}
        setValue={(value) => {
          setValue('date', value)
        }}
        error={errors.date}
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
      />
      <TouchableTextInput
        label="Account"
        name="account"
        control={control}
        format={(value) => (value ? formatAccountName(value) : '')}
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
        label="Category"
        name="category"
        control={control}
        format={(value) => (value ? `${value.icon} ${value.name}` : '')}
        onPress={() =>
          navigation.navigate('SelectCategory', { categoryIds: [], eventName: 'onCategorySelected', multiple: false })
        }
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
        error={errors.category as FieldError}
      />
      <Button
        mode="contained"
        style={{ marginHorizontal: 5, marginTop: 5, alignSelf: 'stretch' }}
        disabled={submitting}
        onPress={handleSubmit(onSubmit)}
        loading={submitting}
      >
        Save Transaction
      </Button>
    </View>
  )
}
