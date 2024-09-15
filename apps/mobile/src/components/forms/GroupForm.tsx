import { yupResolver } from '@hookform/resolvers/yup'
import { mapBudgetType } from 'frontend-utils/src/mappers/map-budget-type'
import { mapCategoryType } from 'frontend-utils/src/mappers/map-category-type'
import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'
import { Button } from 'react-native-paper'
import { BudgetType, CategoryType } from 'shared-types'
import * as Yup from 'yup'

import { PaperPickerField } from '../common/PaperPickerField'
import { TextInput } from '../common/TextInput'

export type GroupFormFields = {
  name: string
  type: CategoryType
  budgetType: BudgetType
  hideFromBudget: boolean
  rolloverBudget: boolean
}

type Props = {
  groupInfo?: GroupFormFields
  onSubmit: (values: GroupFormFields) => void
  submitting: boolean
}

export const GroupForm: React.FC<Props> = ({ groupInfo, onSubmit, submitting }) => {
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
    <View>
      <TextInput
        label="Name"
        name="name"
        control={control}
        returnKeyType="next"
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
        error={errors.name}
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
      <PaperPickerField
        label="Budget Type"
        name="budgetType"
        control={control}
        items={budgetTypeItems}
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
        error={errors.budgetType}
      />
      <PaperPickerField
        label="Exclude from budget"
        name="hideFromBudget"
        control={control}
        items={switchItems}
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
        error={errors.hideFromBudget}
      />
      <PaperPickerField
        label="Rollover remaining budget"
        name="rolloverBudget"
        control={control}
        items={switchItems}
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
        error={errors.rolloverBudget}
      />
      <Button
        mode="contained"
        style={{ marginHorizontal: 5, marginTop: 5, alignSelf: 'stretch' }}
        disabled={submitting}
        onPress={handleSubmit(onSubmit)}
        loading={submitting}
      >
        Save Group
      </Button>
    </View>
  )
}
