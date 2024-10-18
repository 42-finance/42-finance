import { yupResolver } from '@hookform/resolvers/yup'
import { format, startOfMonth } from 'date-fns'
import { todayInUtc } from 'frontend-utils'
import React from 'react'
import { useForm } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { Button } from 'react-native-paper'
import * as Yup from 'yup'

import { TextInput } from '../common/TextInput'
import { TouchableTextInput } from '../common/TouchableTextInput'

export type RentalUnitFormFields = {
  name: string
  rent: number
  firstRentDate: Date
}

type Props = {
  rentalUnitInfo?: Omit<RentalUnitFormFields, 'firstRentDate'>
  onSubmit: (values: RentalUnitFormFields) => void
  submitting: boolean
}

export const RentalUnitForm: React.FC<Props> = ({ rentalUnitInfo, onSubmit, submitting }) => {
  const nameInput = React.useRef<any>()
  const rentInput = React.useRef<any>()
  const [showDatePicker, setShowDatePicker] = React.useState(false)

  const styles = StyleSheet.create({
    input: {
      marginBottom: 5,
      marginHorizontal: 5
    }
  })

  const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    rent: Yup.number()
      .moreThan(0, 'Rent must be greater than 0')
      .typeError('Rent must be a number')
      .required('Rent is required'),
    firstRentDate: Yup.date().required('Start date is required')
  })

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    setValue
  } = useForm<RentalUnitFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: rentalUnitInfo?.name ?? '',
      rent: rentalUnitInfo?.rent ?? undefined,
      firstRentDate: startOfMonth(todayInUtc())
    }
  })

  const firstRentDate = watch('firstRentDate')

  return (
    <View>
      <TextInput
        label="Name"
        name="name"
        control={control}
        returnKeyType="next"
        onSubmitEditing={() => {
          rentInput?.current?.focus()
        }}
        style={styles.input}
        error={errors.name}
        forwardRef={nameInput}
      />
      <TextInput
        label="Rent"
        name="rent"
        control={control}
        returnKeyType="done"
        style={styles.input}
        error={errors.rent}
        forwardRef={rentInput}
        keyboardType="numeric"
      />
      {rentalUnitInfo == null && (
        <>
          <TouchableTextInput
            label="First Rent Due Date"
            name="firstRentDate"
            control={control}
            format={(value) => format(value, 'E MMM dd, yyyy')}
            onPress={() => setShowDatePicker(true)}
            style={styles.input}
          />
          <DateTimePickerModal
            isVisible={showDatePicker}
            date={firstRentDate}
            maximumDate={new Date()}
            mode="date"
            display="inline"
            onConfirm={(date) => {
              setShowDatePicker(false)
              setValue('firstRentDate', date)
            }}
            onCancel={() => {
              setShowDatePicker(false)
            }}
          />
        </>
      )}
      <Button
        mode="contained"
        style={{ marginHorizontal: 5, marginTop: 5, alignSelf: 'stretch' }}
        disabled={submitting}
        onPress={handleSubmit(onSubmit)}
        loading={submitting}
      >
        Save Rental Unit
      </Button>
    </View>
  )
}
