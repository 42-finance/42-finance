import { yupResolver } from '@hookform/resolvers/yup'
import { TagColor } from 'frontend-types'
import { mapTagColor } from 'frontend-utils'
import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'
import { Button } from 'react-native-paper'
import * as Yup from 'yup'

import { PaperPickerField } from '../common/PaperPickerField'
import { TextInput } from '../common/TextInput'

export type TagFormFields = {
  color: string
  name: string
}

type Props = {
  tagInfo?: TagFormFields
  onSubmit: (values: TagFormFields) => void
  submitting: boolean
}

export const TagForm: React.FC<Props> = ({ tagInfo, onSubmit, submitting }) => {
  const schema = Yup.object().shape({
    color: Yup.string().required('Color is required'),
    name: Yup.string().required('Name is required')
  })

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm<TagFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: tagInfo?.name ?? '',
      color: tagInfo?.color ?? ''
    }
  })

  const colorItems = useMemo(() => Object.values(TagColor).map((t) => ({ label: mapTagColor(t), value: t })), [])

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
        label="Color"
        name="color"
        control={control}
        items={colorItems}
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
        error={errors.color}
      />
      <Button
        mode="contained"
        style={{ marginHorizontal: 5, marginTop: 5, alignSelf: 'stretch' }}
        disabled={submitting}
        onPress={handleSubmit(onSubmit)}
        loading={submitting}
      >
        Save Tag
      </Button>
    </View>
  )
}
