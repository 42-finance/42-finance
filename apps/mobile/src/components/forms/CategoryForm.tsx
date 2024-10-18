import { yupResolver } from '@hookform/resolvers/yup'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getGroups } from 'frontend-api'
import React, { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'
import { Button } from 'react-native-paper'
import EmojiPicker from 'rn-emoji-keyboard'
import * as Yup from 'yup'

import { PaperPickerField } from '../common/PaperPickerField'
import { TextInput } from '../common/TextInput'
import { TouchableTextInput } from '../common/TouchableTextInput'

export type CategoryFormFields = {
  name: string
  icon: string
  groupId: number
  hideFromBudget: boolean
  rolloverBudget: boolean
}

type Props = {
  categoryInfo?: CategoryFormFields
  onSubmit: (values: CategoryFormFields) => void
  submitting: boolean
}

export const CategoryForm: React.FC<Props> = ({ categoryInfo, onSubmit, submitting }) => {
  const [showEmojiBoard, setShowEmojiBoard] = useState(false)

  const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    icon: Yup.string().required('Icon is required'),
    groupId: Yup.number().min(1, 'Group is required').required('Group is required'),
    hideFromBudget: Yup.boolean().required('Exclude from budget is required'),
    rolloverBudget: Yup.boolean().required('Rollover budget is required')
  })

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue
  } = useForm<CategoryFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: categoryInfo?.name ?? '',
      icon: categoryInfo?.icon ?? '',
      groupId: categoryInfo?.groupId ?? -1,
      hideFromBudget: categoryInfo?.hideFromBudget ?? false,
      rolloverBudget: categoryInfo?.rolloverBudget ?? false
    }
  })

  const { data: groups = [] } = useQuery({
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

  const groupItems = useMemo(() => groups.map((g) => ({ label: g.name, value: g.id })), [groups])

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
      <TouchableTextInput
        label="Icon"
        control={control}
        name="icon"
        onPress={() => setShowEmojiBoard(true)}
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
      />
      <EmojiPicker
        onEmojiSelected={({ emoji }) => {
          setShowEmojiBoard(false)
          setValue('icon', emoji)
        }}
        open={showEmojiBoard}
        onClose={() => setShowEmojiBoard(false)}
        enableSearchBar
      />
      <PaperPickerField
        label="Group"
        name="groupId"
        control={control}
        items={groupItems}
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
        error={errors.groupId}
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
        Save Category
      </Button>
    </View>
  )
}
