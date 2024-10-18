import { yupResolver } from '@hookform/resolvers/yup'
import { mapBudgetType, mapCategoryType } from 'frontend-utils'
import React, { useMemo } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { BudgetType, CategoryType } from 'shared-types'
import * as Yup from 'yup'

import { FormInput } from '../common/form/form-input'
import { FormSelect } from '../common/form/form-select'

export type GroupFormFields = {
  name: string
  type: CategoryType
  budgetType: BudgetType
  hideFromBudget: boolean
  rolloverBudget: boolean
}

type Props = {
  groupInfo?: GroupFormFields | null
  onSubmit: SubmitHandler<GroupFormFields>
  mode: 'add' | 'edit'
}

export const GroupForm: React.FC<Props> = ({ onSubmit, groupInfo, mode }) => {
  const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    type: Yup.mixed<CategoryType>().required('Type is required'),
    budgetType: Yup.mixed<BudgetType>().required('Budget type is required'),
    hideFromBudget: Yup.boolean().required('Exclude from budget is required'),
    rolloverBudget: Yup.boolean().required('Rollover budget is required')
  })

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm<GroupFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: groupInfo?.name ?? '',
      type: groupInfo?.type ?? CategoryType.Expense,
      budgetType: groupInfo?.budgetType ?? BudgetType.Category,
      hideFromBudget: groupInfo?.hideFromBudget ?? false,
      rolloverBudget: groupInfo?.rolloverBudget ?? false
    }
  })

  const typeItems = useMemo(
    () => Object.values(CategoryType).map((c) => ({ key: c, label: mapCategoryType(c), value: c })),
    []
  )

  const budgetTypeItems = useMemo(
    () => Object.values(BudgetType).map((c) => ({ key: c, label: mapBudgetType(c), value: c })),
    []
  )

  const switchItems = useMemo(
    () => [
      { label: 'Yes', value: true },
      { label: 'No', value: false }
    ],
    []
  )

  return (
    <form id="group-form" data-testid="group-form" autoComplete="off" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-x-6 md:grid-cols-2">
        <div>
          <FormInput control={control} errors={errors.name?.message} label="Name" name="name" type="text" />
        </div>
        <div>
          <FormSelect control={control} errors={errors.type?.message} label="Type" name="type" options={typeItems} />
        </div>
        <div>
          <FormSelect
            control={control}
            errors={errors.budgetType?.message}
            label="Budget Type"
            name="budgetType"
            options={budgetTypeItems}
          />
        </div>
        <div>
          <FormSelect
            control={control}
            errors={errors.hideFromBudget?.message}
            label="Hide from budget"
            name="hideFromBudget"
            options={switchItems}
          />
        </div>
        <div>
          <FormSelect
            control={control}
            errors={errors.rolloverBudget?.message}
            label="Rollover remaining budget"
            name="rolloverBudget"
            options={switchItems}
          />
        </div>
      </div>
    </form>
  )
}
