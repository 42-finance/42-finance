import { yupResolver } from '@hookform/resolvers/yup'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getAccounts, getGroups } from 'frontend-api'
import { mapAmountFilter, mapNameFilter } from 'frontend-utils'
import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { AmountFilter, NameFilter, TransactionAmountType } from 'shared-types'
import * as Yup from 'yup'

import { FormInput } from '../common/form/form-input'
import { FormSelect } from '../common/form/form-select'
import { FormSelectGroup } from '../common/form/form-select-group'

export type RuleFormFields = {
  merchantType: string | null
  merchantValueFilter: NameFilter | null
  merchantName: string | null
  merchantOriginalStatement: string | null
  amountType: TransactionAmountType | null
  amountFilterType: AmountFilter | null
  amountValue: number | null
  amountValue2: number | null
  categoryId: number | null
  accountId: string | null
  newMerchantName: string | null
  newCategoryId: number | null
  hideTransaction: boolean | null
  needsReview: boolean | null
  applyToExisting: boolean
}

type Props = {
  ruleInfo?: RuleFormFields
  onSubmit: (values: RuleFormFields) => void
}

export const RuleForm: React.FC<Props> = ({ onSubmit, ruleInfo }) => {
  const schema = Yup.object().shape({
    merchantType: Yup.string().nullable().defined(),
    merchantValueFilter: Yup.mixed<NameFilter>().nullable().defined(),
    merchantName: Yup.string().nullable().defined(),
    merchantOriginalStatement: Yup.string().nullable().defined(),
    amountType: Yup.mixed<TransactionAmountType>().nullable().defined(),
    amountFilterType: Yup.mixed<AmountFilter>().nullable().defined(),
    amountValue: Yup.number().nullable().defined(),
    amountValue2: Yup.number().nullable().defined(),
    categoryId: Yup.number().nullable().defined(),
    accountId: Yup.string().nullable().defined(),
    newMerchantName: Yup.string().nullable().defined(),
    newCategoryId: Yup.number().nullable().defined(),
    hideTransaction: Yup.boolean().nullable().defined(),
    needsReview: Yup.boolean().nullable().defined(),
    applyToExisting: Yup.boolean().defined()
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<RuleFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      merchantType: ruleInfo?.merchantType ?? null,
      merchantValueFilter: ruleInfo?.merchantValueFilter ?? null,
      merchantName: ruleInfo?.merchantName ?? null,
      merchantOriginalStatement: ruleInfo?.merchantOriginalStatement ?? null,
      amountType: ruleInfo?.amountType ?? null,
      amountFilterType: ruleInfo?.amountFilterType ?? null,
      amountValue: ruleInfo?.amountValue ?? null,
      amountValue2: ruleInfo?.amountValue2 ?? null,
      categoryId: ruleInfo?.categoryId ?? null,
      accountId: ruleInfo?.accountId ?? null,
      newMerchantName: ruleInfo?.newMerchantName ?? null,
      newCategoryId: ruleInfo?.newCategoryId ?? null,
      hideTransaction: ruleInfo?.hideTransaction ?? null,
      needsReview: ruleInfo?.needsReview ?? null,
      applyToExisting: false
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

  const amountFilterItems = useMemo(
    () => Object.values(AmountFilter).map((a) => ({ label: mapAmountFilter(a), value: a })),
    []
  )

  const merchantItems = useMemo(
    () => [
      { label: 'Name', value: 'name' },
      { label: 'Statement', value: 'statement' }
    ],
    []
  )

  const merchantFilterItems = useMemo(
    () => Object.values(NameFilter).map((n) => ({ label: mapNameFilter(n), value: n })),
    []
  )

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

  const applyItems = useMemo(
    () => [
      { label: 'Yes', value: true },
      { label: 'No', value: false }
    ],
    []
  )

  const amountType = watch('amountType')
  const amountFilterType = watch('amountFilterType')
  const merchantType = watch('merchantType')

  return (
    <form id="rule-form" data-testid="rule-form" autoComplete="off" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-x-6 md:grid-cols-2">
        <div className="col-span-2 mb-4 text-base text-outline">If the transaction matches...</div>
        <div>
          <FormSelect
            control={control}
            errors={errors.accountId?.message}
            label="Account"
            name="accountId"
            options={accountItems}
            loading={fetchingAccounts}
            allowClear
          />
        </div>
        <div>
          <FormSelect
            control={control}
            errors={errors.amountType?.message}
            label="Amount Type"
            name="amountType"
            options={typeItems}
            allowClear
          />
        </div>
        {amountType && (
          <>
            <div>
              <FormSelect
                control={control}
                errors={errors.amountFilterType?.message}
                label="Amount Filter"
                name="amountFilterType"
                options={amountFilterItems}
                allowClear
              />
            </div>
            <div>
              <FormInput
                control={control}
                errors={errors.amountValue?.message}
                label={amountFilterType === AmountFilter.Between ? 'Minimum' : 'Amount'}
                name="amountValue"
                type="text"
              />
            </div>
            {amountFilterType === AmountFilter.Between && (
              <div>
                <FormInput
                  control={control}
                  errors={errors.amountValue2?.message}
                  label="Maximum"
                  name="amountValue2"
                  type="text"
                />
              </div>
            )}
          </>
        )}
        <div>
          <FormSelectGroup
            control={control}
            errors={errors.categoryId?.message}
            label="Category"
            name="categoryId"
            options={groupItems}
            loading={fetchingGroups}
            allowClear
          />
        </div>
        <div>
          <FormSelect
            control={control}
            errors={errors.merchantType?.message}
            label="Merchant"
            name="merchantType"
            options={merchantItems}
            allowClear
          />
        </div>
        {merchantType && (
          <>
            <div>
              <FormSelect
                control={control}
                errors={errors.merchantValueFilter?.message}
                label="Merchant Filter"
                name="merchantValueFilter"
                options={merchantFilterItems}
                allowClear
              />
            </div>
            {merchantType === 'name' ? (
              <div>
                <FormInput
                  control={control}
                  errors={errors.merchantName?.message}
                  label="Merchant Name"
                  name="merchantName"
                  type="text"
                />
              </div>
            ) : (
              <div>
                <FormInput
                  control={control}
                  errors={errors.merchantOriginalStatement?.message}
                  label="Statement"
                  name="merchantOriginalStatement"
                  type="text"
                />
              </div>
            )}
          </>
        )}
        <div className="col-span-2 mb-4 text-base text-outline">Then apply these updates</div>
        <div>
          <FormInput
            control={control}
            errors={errors.newMerchantName?.message}
            label="Rename Merchant"
            name="newMerchantName"
            type="text"
          />
        </div>
        <div>
          <FormSelectGroup
            control={control}
            errors={errors.newCategoryId?.message}
            label="Update Category"
            name="newCategoryId"
            options={groupItems}
            loading={fetchingGroups}
            allowClear
          />
        </div>
        <div>
          <FormSelect
            control={control}
            errors={errors.needsReview?.message}
            label="Review Status"
            name="needsReview"
            options={reviewItems}
            allowClear
          />
        </div>
        <div>
          <FormSelect
            control={control}
            errors={errors.hideTransaction?.message}
            label="Transaction Visibility"
            name="hideTransaction"
            options={visibilityItems}
            allowClear
          />
        </div>
        <div>
          <FormSelect
            control={control}
            errors={errors.applyToExisting?.message}
            label="Apply To Existing Transactions"
            name="applyToExisting"
            options={applyItems}
          />
        </div>
      </div>
    </form>
  )
}
