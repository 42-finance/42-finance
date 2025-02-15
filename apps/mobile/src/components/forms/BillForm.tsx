import { yupResolver } from '@hookform/resolvers/yup'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getAccounts } from 'frontend-api'
import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'
import { Button } from 'react-native-paper'
import * as Yup from 'yup'

import { addMonths, startOfDay } from 'date-fns'
import { dateToLocal, formatAccountName } from 'frontend-utils'
import { useUserTokenContext } from '../../contexts/user-token.context'
import { CurrencyInput } from '../common/CurrencyInput'
import { DateField } from '../common/DateField'
import { PaperPickerField } from '../common/PaperPickerField'

export type BillFormFields = {
  balance: number
  issueDate: Date
  dueDate: Date
  minimumPaymentAmount: number | null
  accountId: string
}

type Props = {
  billInfo?: BillFormFields
  onSubmit: (values: BillFormFields) => void
  submitting: boolean
}

export const BillForm: React.FC<Props> = ({ billInfo, onSubmit, submitting }) => {
  const { currencyCode } = useUserTokenContext()

  const schema = Yup.object().shape({
    balance: Yup.number().required('Balance is required'),
    issueDate: Yup.date().required('Date is required'),
    dueDate: Yup.date().required('Due date is required'),
    minimumPaymentAmount: Yup.number().defined().nullable(),
    accountId: Yup.string().required('Account is required')
  })

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    setValue
  } = useForm<BillFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      balance: billInfo?.balance ?? 0,
      issueDate: billInfo?.issueDate ? dateToLocal(billInfo?.issueDate) : new Date(),
      dueDate: billInfo?.dueDate ? dateToLocal(billInfo?.dueDate) : addMonths(new Date(), 1),
      minimumPaymentAmount: billInfo?.minimumPaymentAmount ?? 0,
      accountId: billInfo?.accountId ?? ''
    }
  })

  const { data: accounts = [] } = useQuery({
    queryKey: [ApiQuery.Accounts],
    queryFn: async () => {
      const res = await getAccounts()
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  const accountItems = useMemo(() => accounts.map((a) => ({ label: formatAccountName(a), value: a.id })), [accounts])

  const issueDate = watch('issueDate')
  const dueDate = watch('dueDate')
  const accountId = watch('accountId')

  const accountCurrencyCode = useMemo(() => {
    const account = accounts.find((a) => a.id === accountId)
    if (account) {
      return account.currencyCode
    }
    return currencyCode
  }, [accounts, accountId, currencyCode])

  return (
    <View>
      <CurrencyInput
        label="Balance"
        name="balance"
        control={control}
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
        error={errors.balance}
        currencyCode={accountCurrencyCode}
      />
      <DateField
        label="Date"
        name="issueDate"
        control={control}
        value={issueDate ?? undefined}
        setValue={(value) => {
          setValue('issueDate', startOfDay(value))
        }}
        error={errors.issueDate}
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
      />
      <DateField
        label="Due date"
        name="dueDate"
        control={control}
        value={dueDate ?? undefined}
        setValue={(value) => {
          setValue('dueDate', startOfDay(value))
        }}
        error={errors.dueDate}
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
      />
      <CurrencyInput
        label="Minimum payment"
        name="minimumPaymentAmount"
        control={control}
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
        error={errors.balance}
        currencyCode={accountCurrencyCode}
      />
      <PaperPickerField
        label="Account"
        name="accountId"
        control={control}
        items={accountItems}
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
        error={errors.accountId}
      />
      <Button
        mode="contained"
        style={{ marginHorizontal: 5, marginTop: 5, alignSelf: 'stretch' }}
        disabled={submitting}
        onPress={handleSubmit(onSubmit)}
        loading={submitting}
      >
        Save Bill
      </Button>
    </View>
  )
}
