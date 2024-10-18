import { yupResolver } from '@hookform/resolvers/yup'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getAccounts, getGroups } from 'frontend-api'
import React, { useMemo } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { CurrencyCode, TransactionAmountType } from 'shared-types'
import * as Yup from 'yup'

import { useLocalStorage } from '../../hooks/use-local-storage.hook'
import { FormCurrencyInput } from '../common/form/form-currency-input'
import { FormDateInput } from '../common/form/form-date-input'
import { FormInput } from '../common/form/form-input'
import { FormSelect } from '../common/form/form-select'
import { FormSelectGroup } from '../common/form/form-select-group'

export type TransactionFormFields = {
  date: Date
  amount: number
  accountId: string | null
  categoryId: number | null
  merchantName: string
  type: string
  currencyCode: CurrencyCode
  needsReview: boolean
  hidden: boolean
}

type Props = {
  transactionInfo?: TransactionFormFields | null
  onSubmit: SubmitHandler<TransactionFormFields>
  mode: 'add' | 'edit'
}

export const TransactionForm: React.FC<Props> = ({ onSubmit, transactionInfo, mode }) => {
  const [currencyCode] = useLocalStorage('currencyCode', CurrencyCode.USD)

  const schema = Yup.object().shape({
    date: Yup.date().required('Date is required'),
    amount: Yup.number().moreThan(0, 'Amount must be greater than 0').required('Amount is required'),
    accountId: Yup.string().required('Account is required').nullable().notOneOf([null], 'Account is required'),
    categoryId: Yup.number().required('Category is required').nullable().notOneOf([null], 'Category is required'),
    merchantName: Yup.string().required('Merchant is required'),
    type: Yup.string().required('Type is required'),
    currencyCode: Yup.mixed<CurrencyCode>().required('Currency is required'),
    needsReview: Yup.boolean().required('Review status is required'),
    hidden: Yup.boolean().required('Visibility is required')
  })

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm<TransactionFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      date: transactionInfo?.date ?? new Date(),
      amount: transactionInfo?.amount ?? 0,
      accountId: transactionInfo?.accountId ?? null,
      categoryId: transactionInfo?.categoryId ?? null,
      merchantName: transactionInfo?.merchantName ?? '',
      type: transactionInfo?.type ?? TransactionAmountType.Debit,
      currencyCode: transactionInfo?.currencyCode ?? currencyCode,
      needsReview: transactionInfo?.needsReview ?? true,
      hidden: transactionInfo?.hidden ?? false
    }
  })

  const { data: groups = [], isFetching: fetchingGroups } = useQuery({
    queryKey: [ApiQuery.Groups],
    queryFn: async () => {
      const res = await getGroups()
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  const { data: accounts = [], isFetching: fetchingAccounts } = useQuery({
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

  const groupItems = useMemo(
    () =>
      groups.map((g) => ({
        label: g.name,
        options: g.categories.map((c) => ({ label: `${c.icon} ${c.name}`, value: c.id }))
      })),
    [groups]
  )

  const accountItems = useMemo(
    () =>
      accounts.map((a) => ({
        label: a.name,
        value: a.id
      })),
    [accounts]
  )

  const typeItems = useMemo(
    () => [
      { label: 'Debit', value: TransactionAmountType.Debit },
      { label: 'Credit', value: TransactionAmountType.Credit }
    ],
    []
  )

  const currencyItems = useMemo(() => Object.values(CurrencyCode).map((c) => ({ label: c, value: c })), [])

  const reviewItems = useMemo(
    () => [
      { label: 'Needs review', value: true },
      { label: 'Reviewed', value: false }
    ],
    []
  )

  const visibilityItems = useMemo(
    () => [
      { label: 'Hidden', value: true },
      { label: 'Visible', value: false }
    ],
    []
  )

  return (
    <form
      id="transaction-form"
      data-testid="transaction-form"
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid gap-x-6 md:grid-cols-2">
        <div>
          <FormSelect
            control={control}
            errors={errors.type?.message}
            label="Type"
            name="type"
            options={typeItems}
            disabled={mode === 'edit'}
          />
        </div>
        <div>
          <FormCurrencyInput
            control={control}
            errors={errors.amount?.message}
            label="Amount"
            name="amount"
            disabled={mode === 'edit'}
          />
        </div>
        <div>
          <FormInput
            control={control}
            errors={errors.merchantName?.message}
            label="Merchant"
            name="merchantName"
            type="text"
            disabled={mode === 'edit'}
          />
        </div>
        <div>
          <FormDateInput control={control} errors={errors.date?.message} label="Date" name="date" />
        </div>
        <div>
          <FormSelect
            control={control}
            errors={errors.accountId?.message}
            label="Account"
            name="accountId"
            options={accountItems}
            disabled={mode === 'edit'}
            loading={fetchingAccounts}
          />
        </div>
        <div>
          <FormSelectGroup
            control={control}
            errors={errors.categoryId?.message}
            label="Category"
            name="categoryId"
            options={groupItems}
            loading={fetchingGroups}
          />
        </div>
        <div>
          <FormSelect
            control={control}
            errors={errors.currencyCode?.message}
            label="Currency"
            name="currencyCode"
            options={currencyItems}
            disabled={mode === 'edit'}
          />
        </div>
        {mode === 'edit' && (
          <>
            <div>
              <FormSelect
                control={control}
                errors={errors.needsReview?.message}
                label="Review status"
                name="needsReview"
                options={reviewItems}
              />
            </div>
            <div>
              <FormSelect
                control={control}
                errors={errors.hidden?.message}
                label="Visiblity"
                name="hidden"
                options={visibilityItems}
              />
            </div>
          </>
        )}
      </div>
    </form>
  )
}
