import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { useForm } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'
import { Button } from 'react-native-paper'
import * as Yup from 'yup'

import { TextInput } from '../common/TextInput'

export type SetupPropertyRentFormFields = {
  rent: number
  rentDueDayOfMonth: number
}

type Props = {
  onSubmit: (values: SetupPropertyRentFormFields) => void
  submitting: boolean
}

export const SetupPropertyRentForm: React.FC<Props> = ({ onSubmit, submitting }) => {
  const rentInput = React.useRef<any>()
  const rentDueDayOfMonthInput = React.useRef<any>()

  const styles = StyleSheet.create({
    input: {
      marginBottom: 5,
      marginHorizontal: 5
    }
  })

  const schema = Yup.object().shape({
    rent: Yup.number().required('Rent is required'),
    rentDueDayOfMonth: Yup.number().required('Rent due date is required')
  })

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm<SetupPropertyRentFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      rent: 0,
      rentDueDayOfMonth: 1
    }
  })

  return (
    <View>
      <TextInput
        label="Rent"
        name="rent"
        control={control}
        returnKeyType="next"
        onSubmitEditing={() => {
          rentDueDayOfMonthInput?.current?.focus()
        }}
        style={styles.input}
        error={errors.rent}
        forwardRef={rentInput}
      />
      <TextInput
        label="Rent Due Date"
        name="rentDueDayOfMonth"
        control={control}
        returnKeyType="done"
        onSubmitEditing={() => {
          rentDueDayOfMonthInput?.current?.blur()
        }}
        style={styles.input}
        error={errors.rentDueDayOfMonth}
        forwardRef={rentDueDayOfMonthInput}
      />
      <Button
        mode="contained"
        style={{ marginHorizontal: 5, marginTop: 5, alignSelf: 'stretch' }}
        disabled={submitting}
        onPress={handleSubmit(onSubmit)}
        loading={submitting}
      >
        Save Rent
      </Button>
    </View>
  )
}
