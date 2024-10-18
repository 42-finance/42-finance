import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { useForm } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'
import { Button, Caption } from 'react-native-paper'
import * as Yup from 'yup'

import { TextInput } from '../common/TextInput'

export type TenantFormFields = {
  name: string
  email: string
  rent?: number | null
  rentDueDayOfMonth?: number | null
  handleRent?: boolean
  sendInviteEmail?: boolean
  emailConfirmed?: boolean
  acceptedInvite?: boolean
}

type Props = {
  tenantInfo?: TenantFormFields
  onSubmit: (values: TenantFormFields) => void
  submitting: boolean
}

export const TenantForm: React.FC<Props> = ({ tenantInfo, onSubmit, submitting }) => {
  const emailInput = React.useRef<any>()
  const rentInput = React.useRef<any>()
  const rentDueDayOfMonthInput = React.useRef<any>()

  const styles = StyleSheet.create({
    input: {
      marginBottom: 5,
      marginHorizontal: 5
    }
  })

  const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Email must be a valid email').required('Email is required'),
    rent: Yup.number()
      .nullable()
      .when('handleRent', {
        is: (val: boolean) => val,
        then: (schema) =>
          schema
            .moreThan(0, 'Rent must be greater than 0')
            .typeError('Rent must be a number')
            .required('Rent is required')
      }),
    rentDueDayOfMonth: Yup.number()
      .nullable()
      .when('handleRent', {
        is: (val: boolean) => val,
        then: (schema) =>
          schema
            .integer('Rent due date must be a whole number')
            .moreThan(0, 'Rent due date must be greater than 0')
            .max(31, 'Rent due date must be less than or equal to 31')
            .typeError('Rent due date must be a number')
            .required('Rent due date is required')
      }),
    handleRent: Yup.boolean(),
    sendInviteEmail: Yup.boolean()
  })

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch
  } = useForm<TenantFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: tenantInfo?.name ?? '',
      email: tenantInfo?.email ?? '',
      rent: tenantInfo?.rent,
      rentDueDayOfMonth: tenantInfo?.rentDueDayOfMonth,
      sendInviteEmail: tenantInfo?.sendInviteEmail,
      handleRent: tenantInfo?.handleRent,
      emailConfirmed: tenantInfo?.emailConfirmed,
      acceptedInvite: tenantInfo?.acceptedInvite
    }
  })

  const acceptedInvite = watch('acceptedInvite')
  const handleRent = watch('handleRent')
  const emailConfirmed = watch('emailConfirmed')
  const email = watch('email')

  return (
    <View>
      {acceptedInvite && (
        <Caption
          style={{
            marginBottom: 5,
            marginHorizontal: 5
          }}
        >
          You cannot edit this tenants email and name once they have accepted your invitation
        </Caption>
      )}
      <TextInput
        label="Name"
        name="name"
        control={control}
        disabled={(emailConfirmed && email === tenantInfo?.email) || acceptedInvite}
        returnKeyType="next"
        onSubmitEditing={() => {
          emailInput?.current?.focus()
        }}
        style={styles.input}
        error={errors.name}
      />
      <TextInput
        label="Email"
        name="email"
        control={control}
        disabled={acceptedInvite}
        returnKeyType={handleRent ? 'next' : 'done'}
        onSubmitEditing={() => {
          if (handleRent) {
            rentInput?.current?.focus()
          } else {
            emailInput?.current?.blur()
          }
        }}
        style={styles.input}
        error={errors.email}
        forwardRef={emailInput}
        keyboardType="email-address"
      />
      {handleRent && (
        <>
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
            keyboardType="numeric"
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
            keyboardType="number-pad"
          />
        </>
      )}
      {/* {values.sendInviteEmail !== undefined && (
            <Checkbox
              label="Send Invite Email?"
              isChecked={values.sendInviteEmail}
              onPress={() => setFieldValue('sendInviteEmail', !values.sendInviteEmail)}
            />
          )} */}
      <Button
        mode="contained"
        style={{ marginHorizontal: 5, marginTop: 5, alignSelf: 'stretch' }}
        disabled={submitting}
        onPress={handleSubmit(onSubmit)}
        loading={submitting}
      >
        Save Tenant
      </Button>
    </View>
  )
}
