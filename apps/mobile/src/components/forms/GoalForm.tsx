import { AntDesign } from '@expo/vector-icons'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import { startOfDay } from 'date-fns'
import { Account } from 'frontend-types'
import { calculateGoalBudgetAmount, eventEmitter, mapGoalType, todayInUtc } from 'frontend-utils'
import React, { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import { Button, SegmentedButtons, Text, useTheme } from 'react-native-paper'
import { AccountType, GoalType } from 'shared-types'
import * as Yup from 'yup'

import { useUserTokenContext } from '../../contexts/user-token.context'
import { AccountFilterSelection } from '../account/AccountFilterSelection'
import { CurrencyInput } from '../common/CurrencyInput'
import { DateField } from '../common/DateField'
import { PaperPickerField } from '../common/PaperPickerField'
import { TextInput } from '../common/TextInput'

export enum TargetType {
  None = 'none',
  Date = 'date',
  Amount = 'amount'
}

export type GoalFormFields = {
  name: string
  amount: number
  accounts: Account[]
  type: GoalType
  targetType?: TargetType
  startDate: Date | null
  targetDate: Date | null
  budgetAmount: number | null
}

type Props = {
  goalInfo?: GoalFormFields
  onSubmit: (values: GoalFormFields) => void
  submitting: boolean
}

export const GoalForm: React.FC<Props> = ({ goalInfo, onSubmit, submitting }) => {
  const { colors } = useTheme()
  const navigation = useNavigation()
  const { currencyCode } = useUserTokenContext()

  const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    amount: Yup.number().required('Amount is required').min(1, 'Amount must be greater than 0'),
    accounts: Yup.array<Account[]>().defined(),
    type: Yup.mixed<GoalType>().required('Type is required'),
    targetType: Yup.mixed<TargetType>(),
    startDate: Yup.date()
      .defined()
      .nullable()
      .when('type', {
        is: (val: GoalType) => val === GoalType.Spending,
        then: (schema) => schema.required('Start date is required')
      }),
    targetDate: Yup.date()
      .defined()
      .nullable()
      .when('type', {
        is: (val: GoalType) => val === GoalType.Spending,
        then: (schema) => schema.required('End date is required')
      }),
    budgetAmount: Yup.number().nullable().defined()
  })

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch
  } = useForm<GoalFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: goalInfo?.name ?? '',
      amount: goalInfo?.amount ?? 0,
      accounts: goalInfo?.accounts ?? [],
      type: goalInfo?.type ?? GoalType.Savings,
      targetType:
        goalInfo?.budgetAmount != null
          ? TargetType.Amount
          : goalInfo?.targetDate != null
            ? TargetType.Date
            : TargetType.None,
      startDate: goalInfo?.startDate ?? todayInUtc(),
      targetDate: goalInfo?.targetDate ?? null,
      budgetAmount: goalInfo?.budgetAmount ?? 0
    }
  })

  const accounts = watch('accounts')
  const targetDate = watch('targetDate')
  const amount = watch('amount')
  const type = watch('type')
  const targetType = watch('targetType')

  useEffect(() => {
    const onAccountSelected = (account: Account) => {
      const newAccounts = accounts.find((c) => c.id === account.id)
        ? accounts.filter((c) => c.id !== account.id)
        : [...accounts, account]
      setValue('accounts', newAccounts)
    }

    eventEmitter.on('onGoalAccountSelected', onAccountSelected)

    return () => {
      eventEmitter.off('onGoalAccountSelected', onAccountSelected)
    }
  }, [accounts, setValue])

  const goalTypeItems = useMemo(
    () => Object.values(GoalType).map((g) => ({ key: g, label: mapGoalType(g), value: g })),
    []
  )

  useEffect(() => {
    if (targetDate == null) {
      setValue('budgetAmount', 0)
    } else {
      const budgetAmount = calculateGoalBudgetAmount(targetDate, type, accounts, amount)
      setValue('budgetAmount', budgetAmount)
    }
  }, [setValue, targetDate, amount, accounts, type])

  useEffect(() => {
    if (type === GoalType.Debt) {
      const newAmount = accounts.reduce((acc, account) => acc + account.convertedBalance, 0)
      setValue('amount', newAmount)
    }
  }, [accounts, setValue, type])

  const mapGoalTypeToAccountTypes = (goalType: GoalType) => {
    switch (goalType) {
      case GoalType.Debt:
        return [AccountType.Liability]
      case GoalType.Savings:
        return [AccountType.Asset]
      case GoalType.Spending:
        return [AccountType.Asset, AccountType.Liability]
    }
  }

  return (
    <ScrollView>
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
          label="Type"
          name="type"
          control={control}
          items={goalTypeItems}
          style={{
            marginTop: 5,
            marginHorizontal: 5
          }}
          error={errors.type}
          onValueChange={() => setValue('accounts', [])}
        />
        <CurrencyInput
          label="Amount"
          name="amount"
          control={control}
          style={{
            marginTop: 5,
            marginHorizontal: 5
          }}
          error={errors.amount}
          disabled={type === GoalType.Debt}
          currencyCode={currencyCode}
        />
        {type === GoalType.Spending ? (
          <>
            <DateField
              label="Start date"
              name="startDate"
              control={control}
              value={targetDate ?? undefined}
              setValue={(value) => {
                setValue('startDate', startOfDay(value))
              }}
              error={errors.startDate}
              style={{
                marginTop: 5,
                marginHorizontal: 5
              }}
            />
            <DateField
              label="End date"
              name="targetDate"
              control={control}
              value={targetDate ?? undefined}
              setValue={(value) => {
                setValue('targetDate', startOfDay(value))
              }}
              error={errors.targetDate}
              style={{
                marginTop: 5,
                marginHorizontal: 5
              }}
            />
          </>
        ) : (
          <>
            <SegmentedButtons
              value={targetType ?? TargetType.None}
              onValueChange={(value) => setValue('targetType', value as TargetType)}
              buttons={[
                {
                  value: TargetType.None,
                  label: 'No target'
                },
                {
                  value: TargetType.Date,
                  label: 'Target date'
                },
                {
                  value: TargetType.Amount,
                  label: 'Monthly amount'
                }
              ]}
              style={{ marginHorizontal: 5, marginTop: 5 }}
            />
            {targetType === TargetType.Date ? (
              <DateField
                label="Target date"
                name="targetDate"
                control={control}
                value={targetDate ?? undefined}
                setValue={(value) => {
                  setValue('targetDate', startOfDay(value))
                }}
                error={errors.targetDate}
                style={{
                  marginTop: 5,
                  marginHorizontal: 5
                }}
                clearable
                onClear={() => setValue('targetDate', null)}
              />
            ) : targetType === TargetType.Amount ? (
              <CurrencyInput
                label="Monthly amount"
                name="budgetAmount"
                control={control}
                style={{
                  marginTop: 5,
                  marginHorizontal: 5
                }}
                error={errors.budgetAmount}
                currencyCode={currencyCode}
              />
            ) : null}
          </>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 15, marginVertical: 10 }}>
          <Text variant="bodyMedium" style={{ flex: 1 }}>
            ACCOUNTS
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('SelectAccount', {
                accountIds: accounts.map((a) => a.id),
                eventName: 'onGoalAccountSelected',
                multiple: true,
                accountTypes: mapGoalTypeToAccountTypes(type)
              })
            }
          >
            <AntDesign name="pluscircleo" size={24} color={colors.onSurface} />
          </TouchableOpacity>
        </View>
        {accounts.map((account) => (
          <AccountFilterSelection
            key={account.id}
            account={account}
            showBalance
            onDelete={() =>
              setValue(
                'accounts',
                accounts.filter((c) => c.id !== account.id)
              )
            }
          />
        ))}
      </View>
      <Button
        mode="contained"
        style={{ marginHorizontal: 5, marginTop: 5, marginBottom: 30, alignSelf: 'stretch' }}
        disabled={submitting}
        onPress={handleSubmit(onSubmit)}
        loading={submitting}
      >
        Save Goal
      </Button>
    </ScrollView>
  )
}
