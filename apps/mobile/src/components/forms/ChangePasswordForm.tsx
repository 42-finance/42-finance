import { yupResolver } from '@hookform/resolvers/yup'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'
import * as Yup from 'yup'

import { TextInput } from '../common/TextInput'
import { View } from '../common/View'

export type ChangePasswordFormFields = {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

type Props = {
  onSubmit: (values: ChangePasswordFormFields) => void
  submitting: boolean
}

export const ChangePasswordForm: React.FC<Props> = ({ onSubmit, submitting }) => {
  const currentPasswordInput = useRef<any>()
  const newPasswordInput = useRef<any>()
  const confirmNewPasswordInput = useRef<any>()

  const schema = Yup.object().shape({
    currentPassword: Yup.string().required('Current password is required'),
    newPassword: Yup.string().required('New password is required'),
    confirmNewPassword: Yup.string()
      .required('Confirm new password is required')
      .oneOf([Yup.ref('newPassword')], 'New passwords must match')
  })

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm<ChangePasswordFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    }
  })

  const styles = StyleSheet.create({
    input: {
      marginBottom: 5,
      marginHorizontal: 5
    }
  })

  return (
    <View>
      <TextInput
        label="Current Password"
        name="currentPassword"
        control={control}
        secureTextEntry
        forwardRef={currentPasswordInput}
        returnKeyType="next"
        onSubmitEditing={() => {
          newPasswordInput?.current?.focus()
        }}
        style={styles.input}
        error={errors.currentPassword}
        textContentType="password"
      />
      <TextInput
        label="New Password"
        name="newPassword"
        control={control}
        secureTextEntry
        forwardRef={newPasswordInput}
        returnKeyType="next"
        onSubmitEditing={() => {
          confirmNewPasswordInput?.current?.focus()
        }}
        style={styles.input}
        error={errors.newPassword}
        textContentType="newPassword"
      />
      <TextInput
        label="Confirm New Password"
        name="confirmNewPassword"
        control={control}
        secureTextEntry
        forwardRef={confirmNewPasswordInput}
        style={styles.input}
        error={errors.confirmNewPassword}
        textContentType="newPassword"
      />
      <Button
        mode="contained"
        style={{ marginHorizontal: 5, alignSelf: 'stretch' }}
        disabled={submitting}
        onPress={handleSubmit(onSubmit)}
        loading={submitting}
      >
        Change Password
      </Button>
    </View>
  )
}
