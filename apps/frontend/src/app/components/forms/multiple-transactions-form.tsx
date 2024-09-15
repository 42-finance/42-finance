import { yupResolver } from '@hookform/resolvers/yup'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getGroups } from 'frontend-api'
import React, { useMemo } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { CurrencyCode } from 'shared-types'
import * as Yup from 'yup'

import { useLocalStorage } from '../../hooks/use-local-storage.hook'
import { FormDateInput } from '../common/form/form-date-input'
import { FormSelect } from '../common/form/form-select'
import { FormSelectGroup } from '../common/form/form-select-group'

export type MultipleTransactionsFormFields = {
  date?: Date | null
  categoryId?: number | null
  needsReview?: boolean | null
  hidden?: boolean | null
}

type Props = {
  onSubmit: SubmitHandler<MultipleTransactionsFormFields>
}

export const MultipleTransactionsForm: React.FC<Props> = ({ onSubmit }) => {
  const [currencyCode] = useLocalStorage('currencyCode', CurrencyCode.USD)

  const schema = Yup.object().shape({
    date: Yup.date().nullable(),
    categoryId: Yup.number().nullable(),
    needsReview: Yup.boolean().nullable(),
    hidden: Yup.boolean().nullable()
  })

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm<MultipleTransactionsFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      date: null,
      categoryId: null,
      needsReview: null,
      hidden: null
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

  const groupItems = useMemo(
    () =>
      groups.map((g) => ({
        label: g.name,
        options: g.categories.map((c) => ({ label: `${c.icon} ${c.name}`, value: c.id }))
      })),
    [groups]
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

  return (
    <form
      id="multiple-transaction-form"
      data-testid="multiple-transaction-form"
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid gap-x-6 md:grid-cols-2">
        <div>
          <FormDateInput control={control} errors={errors.date?.message} label="Date" name="date" />
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
      </div>
    </form>
  )
}
