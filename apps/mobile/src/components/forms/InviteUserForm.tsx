import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'
import { Button } from 'react-native-paper'
import { UserPermission } from 'shared-types'
import * as Yup from 'yup'

import { TextInput } from '../common/TextInput'

export type InviteUserFormFields = {
  email: string
  permission: UserPermission
}

type Props = {
  onSubmit: (values: InviteUserFormFields) => void
  submitting: boolean
}

export const InviteUserForm: React.FC<Props> = ({ onSubmit, submitting }) => {
  const schema = Yup.object().shape({
    email: Yup.string().email().trim().required('Email is required'),
    permission: Yup.mixed<UserPermission>().required('Permission is required')
  })

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm<InviteUserFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      permission: UserPermission.Admin
    }
  })

  return (
    <View>
      <TextInput
        label="Email"
        name="email"
        control={control}
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
        error={errors.email}
      />
      <Button
        mode="contained"
        style={{ marginHorizontal: 5, marginTop: 5, alignSelf: 'stretch' }}
        disabled={submitting}
        onPress={handleSubmit(onSubmit)}
        loading={submitting}
      >
        Invite User
      </Button>
    </View>
  )
}
