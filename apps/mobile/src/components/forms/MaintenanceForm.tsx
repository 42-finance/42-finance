import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { useForm } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'
import { Button } from 'react-native-paper'
import * as Yup from 'yup'

import { Checkbox } from '../common/Checkbox'
import { TextInput } from '../common/TextInput'

export type MaintenanceFormFields = {
  name: string
  description: string | null
  paidByTenant: boolean
}

type Props = {
  maintenanceInfo?: MaintenanceFormFields
  onSubmit: (values: MaintenanceFormFields) => void
  submitting: boolean
}

export const MaintenanceForm: React.FC<Props> = ({ maintenanceInfo, onSubmit, submitting }) => {
  const nameInput = React.useRef<any>()
  const descriptionInput = React.useRef<any>()

  const styles = StyleSheet.create({
    input: {
      marginBottom: 5,
      marginHorizontal: 5
    }
  })

  const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().nullable().defined(),
    paidByTenant: Yup.boolean().required('Paid by tenant is required')
  })

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch
  } = useForm<MaintenanceFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: maintenanceInfo?.name ?? '',
      description: maintenanceInfo?.description ?? '',
      paidByTenant: maintenanceInfo?.paidByTenant ?? false
    }
  })

  const paidByTenant = watch('paidByTenant')

  return (
    <View
      style={{
        zIndex: 10
      }}
    >
      <TextInput
        label="Name"
        name="name"
        control={control}
        returnKeyType="next"
        onSubmitEditing={() => descriptionInput?.current?.focus()}
        style={styles.input}
        error={errors.name}
        forwardRef={nameInput}
      />
      <TextInput
        label="Description"
        name="description"
        control={control}
        style={styles.input}
        error={errors.description}
        forwardRef={descriptionInput}
        multiline
      />
      <Checkbox
        label="Paid By Tenant?"
        isChecked={paidByTenant}
        onPress={() => setValue('paidByTenant', !paidByTenant)}
      />
      <Button
        mode="contained"
        style={{ marginHorizontal: 5, marginTop: 5, alignSelf: 'stretch' }}
        disabled={submitting}
        onPress={handleSubmit(onSubmit)}
        loading={submitting}
      >
        Save Maintenance
      </Button>
    </View>
  )
}
