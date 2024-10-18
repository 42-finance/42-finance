import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { StyleSheet } from 'react-native'
import { Button, Text } from 'react-native-paper'
import * as Yup from 'yup'

import { TextInput } from '../common/TextInput'
import { View } from '../common/View'

export type SetPasswordFormFields = {
  password: string
}

type Props = {
  onSubmit: (values: SetPasswordFormFields) => void
  submitting: boolean
}

export const SetPasswordForm: React.FC<Props> = ({ onSubmit, submitting }) => {
  const schema = Yup.object().shape({
    password: Yup.string().required('Password is required')
  })

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm<SetPasswordFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      password: ''
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
      <Text variant="bodyMedium" style={{ marginBottom: 10, marginHorizontal: 10 }}>
        You do not have a password setup. Create a new password to enable login via email and password.
      </Text>
      <TextInput
        label="Password"
        name="password"
        control={control}
        secureTextEntry
        style={styles.input}
        error={errors.password}
        textContentType="newPassword"
      />
      <Button
        mode="contained"
        style={{ marginHorizontal: 5, alignSelf: 'stretch' }}
        disabled={submitting}
        onPress={handleSubmit(onSubmit)}
        loading={submitting}
      >
        Set Password
      </Button>
    </View>
  )
}
