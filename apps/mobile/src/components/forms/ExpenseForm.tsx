import { yupResolver } from '@hookform/resolvers/yup'
import { format, startOfMonth } from 'date-fns'
import { mapFrequency } from 'frontend-utils/src/mappers/map-frequency'
import React, { useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { Button } from 'react-native-paper'
import { Frequency } from 'shared-types'
import * as Yup from 'yup'

import { PaperPickerField } from '../common/PaperPickerField'
import { TextInput } from '../common/TextInput'
import { TouchableTextInput } from '../common/TouchableTextInput'

export type ExpenseFormFields = {
  name: string
  amount: number
  frequency: Frequency
  dateOfFirstOccurence: Date
}

type Props = {
  expenseInfo?: ExpenseFormFields
  onSubmit: (values: ExpenseFormFields) => void
  submitting: boolean
}

export const ExpenseForm: React.FC<Props> = ({ expenseInfo, onSubmit, submitting }) => {
  const nameInput = useRef<any>()
  const amountInput = useRef<any>()

  const [showDatePicker, setShowDatePicker] = React.useState(false)

  const styles = StyleSheet.create({
    input: {
      marginBottom: 5,
      marginHorizontal: 5
    }
  })

  const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    amount: Yup.number()
      .moreThan(0, 'Amount must be greater than 0')
      .typeError('Amount must be a number')
      .required('Amount is required'),
    frequency: Yup.mixed<Frequency>().required('Please select a frequency').oneOf(Object.values(Frequency)),
    dateOfFirstOccurence: Yup.date().required('Please select a date')
  })

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    setValue
  } = useForm<ExpenseFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: expenseInfo?.name ?? '',
      amount: expenseInfo?.amount ?? 0,
      frequency: expenseInfo?.frequency ?? Frequency.Daily,
      dateOfFirstOccurence: expenseInfo?.dateOfFirstOccurence ?? startOfMonth(new Date())
    }
  })

  const walletTypes = useMemo(() => Object.values(Frequency).map((c) => ({ label: mapFrequency(c), value: c })), [])

  const dateOfFirstOccurence = watch('dateOfFirstOccurence')

  return (
    <View>
      <TextInput
        label="Name"
        name="name"
        control={control}
        returnKeyType="next"
        onSubmitEditing={() => amountInput?.current?.focus()}
        style={styles.input}
        error={errors.name}
        forwardRef={nameInput}
      />
      <TextInput
        label="Amount"
        name="amount"
        control={control}
        returnKeyType="done"
        style={styles.input}
        error={errors.amount}
        forwardRef={amountInput}
        keyboardType="numeric"
      />
      <PaperPickerField
        label="Frequency"
        name="frequency"
        control={control}
        items={walletTypes}
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
        error={errors.frequency}
      />
      {expenseInfo == null && (
        <>
          <TouchableTextInput
            label="Start Date"
            name="dateOfFirstOccurence"
            control={control}
            format={(value) => format(value, 'E MMM dd, yyyy')}
            onPress={() => setShowDatePicker(true)}
            style={styles.input}
          />
          <DateTimePickerModal
            isVisible={showDatePicker}
            date={dateOfFirstOccurence}
            maximumDate={new Date()}
            mode="date"
            display="inline"
            onConfirm={(date) => {
              setShowDatePicker(false)
              setValue('dateOfFirstOccurence', date)
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
        Save Expense
      </Button>
    </View>
  )
}
