import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import { ApiQuery, getTransactions } from 'frontend-api'
import { eventEmitter } from 'frontend-utils'
import { formatAccountName } from 'frontend-utils/src/account/account.utils'
import { mapAmount } from 'frontend-utils/src/mappers/map-amount-filter'
import { mapNameFilter } from 'frontend-utils/src/mappers/map-name-filter'
import _ from 'lodash'
import React, { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { ScrollView, View } from 'react-native'
import { Button, Text, useTheme } from 'react-native-paper'
import { AmountFilter, MerchantFilter, NameFilter, TransactionAmountType } from 'shared-types'
import * as Yup from 'yup'

import { Account } from '../../../../../libs/frontend-types/src/account.type'
import { Category } from '../../../../../libs/frontend-types/src/category.type'
import { PaperPickerField } from '../common/PaperPickerField'
import { TextInput } from '../common/TextInput'
import { TouchableTextInput } from '../common/TouchableTextInput'

export type RuleFormFields = {
  merchant: {
    merchantValueFilter: NameFilter | null
    merchantName: string | null
    merchantOriginalStatement: string | null
  }
  amount: {
    amountType: TransactionAmountType | null
    amountFilterType: AmountFilter | null
    amountValue: number | null
    amountValue2: number | null
  }
  category: Category | null
  account: Account | null
  newMerchantName: string | null
  newCategory: Category | null
  hideTransaction: boolean | null
  needsReview: boolean | null
  applyToExisting?: boolean | null
}

type Props = {
  ruleInfo?: RuleFormFields
  onSubmit: (values: RuleFormFields) => void
  submitting: boolean
}

type MerchantRule = {
  merchantFilter: MerchantFilter
  nameFilter: NameFilter
  value: string
}

export const RuleForm: React.FC<Props> = ({ ruleInfo, onSubmit, submitting }) => {
  const navigation = useNavigation()
  const { colors } = useTheme()

  const schema = Yup.object().shape({
    merchant: Yup.object().shape({
      merchantValueFilter: Yup.mixed<NameFilter>().nullable().defined(),
      merchantName: Yup.string().nullable().defined(),
      merchantOriginalStatement: Yup.string().nullable().defined()
    }),
    amount: Yup.object().shape({
      amountType: Yup.mixed<TransactionAmountType>().nullable().defined(),
      amountFilterType: Yup.mixed<AmountFilter>().nullable().defined(),
      amountValue: Yup.number().nullable().defined(),
      amountValue2: Yup.number().nullable().defined()
    }),
    category: Yup.mixed<Category>().nullable().defined(),
    account: Yup.mixed<Account>().nullable().defined(),
    newMerchantName: Yup.string().nullable().defined(),
    newCategory: Yup.mixed<Category>().nullable().defined(),
    hideTransaction: Yup.boolean().nullable().defined(),
    needsReview: Yup.boolean().nullable().defined(),
    applyToExisting: Yup.boolean().nullable()
  })

  const { control, handleSubmit, setValue, watch } = useForm<RuleFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      merchant: {
        merchantValueFilter: ruleInfo?.merchant?.merchantValueFilter ?? null,
        merchantName: ruleInfo?.merchant?.merchantName ?? null,
        merchantOriginalStatement: ruleInfo?.merchant?.merchantOriginalStatement ?? null
      },
      amount: {
        amountType: ruleInfo?.amount?.amountType ?? null,
        amountFilterType: ruleInfo?.amount?.amountFilterType ?? null,
        amountValue: ruleInfo?.amount?.amountValue ?? null,
        amountValue2: ruleInfo?.amount?.amountValue2 ?? null
      },
      category: ruleInfo?.category ?? null,
      account: ruleInfo?.account ?? null,
      newMerchantName: ruleInfo?.newMerchantName ?? null,
      newCategory: ruleInfo?.newCategory ?? null,
      hideTransaction: ruleInfo?.hideTransaction ?? null,
      needsReview: ruleInfo?.needsReview ?? null,
      applyToExisting: false
    }
  })

  useEffect(() => {
    const onAmountSelected = ({ type, filter, value, value2 }) => {
      setValue('amount', {
        amountType: type,
        amountFilterType: filter,
        amountValue: value,
        amountValue2: value2
      })
    }
    eventEmitter.on('onAmountSelected', onAmountSelected)

    const onAccountSelected = (account: Account) => {
      setValue('account', account)
    }
    eventEmitter.on('onAccountSelected', onAccountSelected)

    const onCategorySelected = (category: Category) => {
      setValue('category', category)
    }
    eventEmitter.on('onCategorySelected', onCategorySelected)

    const onMerchantRuleSelected = (rule: MerchantRule) => {
      const value = _.isEmpty(rule.value) ? null : rule.value
      setValue('merchant', {
        merchantValueFilter: rule.nameFilter,
        merchantName: rule.merchantFilter === MerchantFilter.Name ? value : null,
        merchantOriginalStatement: rule.merchantFilter === MerchantFilter.Name ? null : value
      })
    }
    eventEmitter.on('onMerchantRuleSelected', onMerchantRuleSelected)

    const onUpdateCategorySelected = (category: Category) => {
      setValue('newCategory', category)
    }
    eventEmitter.on('onUpdateCategorySelected', onUpdateCategorySelected)

    const onRenameMerchantSelected = (value: string) => {
      setValue('newMerchantName', value)
    }
    eventEmitter.on('onRenameMerchantSelected', onRenameMerchantSelected)

    return () => {
      eventEmitter.off('onAmountSelected', onAmountSelected)
      eventEmitter.off('onAccountSelected', onAccountSelected)
      eventEmitter.off('onCategorySelected', onCategorySelected)
      eventEmitter.off('onMerchantRuleSelected', onMerchantRuleSelected)
      eventEmitter.off('onUpdateCategorySelected', onUpdateCategorySelected)
      eventEmitter.off('onRenameMerchantSelected', onRenameMerchantSelected)
    }
  }, [setValue])

  const account = watch('account')
  const category = watch('category')
  const amount = watch('amount')
  const merchant = watch('merchant')
  const newCategory = watch('newCategory')
  const applyToExisting = watch('applyToExisting')

  const reviewItems = useMemo(
    () => [
      { label: 'No change', value: null },
      { label: 'Needs review', value: true },
      { label: 'Reviewed', value: false }
    ],
    []
  )

  const hideItems = useMemo(
    () => [
      { label: 'No change', value: null },
      { label: 'Visible', value: false },
      { label: 'Hidden', value: true }
    ],
    []
  )

  const applyItems = useMemo(
    () => [
      { label: 'Yes', value: true },
      { label: 'No', value: false }
    ],
    []
  )

  const { data: transactions = [], isFetching: fetchingTransactions } = useQuery({
    queryKey: [ApiQuery.RuleTransactions, merchant, amount, category, account],
    queryFn: async () => {
      const res = await getTransactions({
        merchantValueFilter: merchant?.merchantValueFilter ?? undefined,
        merchantName: merchant?.merchantName ?? undefined,
        merchantOriginalStatement: merchant?.merchantOriginalStatement ?? undefined,
        amountType: amount?.amountType ?? undefined,
        amountFilter: amount?.amountFilterType ?? undefined,
        amountValue: amount?.amountValue ?? undefined,
        amountValue2: amount?.amountValue2 ?? undefined,
        categoryIds: category ? [category.id] : undefined,
        accountIds: account ? [account.id] : undefined
      })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
    }
  })

  return (
    <ScrollView>
      <View>
        <Text variant="bodyMedium" style={{ color: colors.outline, paddingHorizontal: 15, paddingVertical: 20 }}>
          IF THE TRANSACTION MATCHES...
        </Text>
        <TouchableTextInput
          label="Account"
          name="account"
          control={control}
          format={(value) => (value ? formatAccountName(value) : '')}
          onPress={() => navigation.navigate('AccountRule', { value: null })}
          style={{
            marginTop: 5,
            marginHorizontal: 5
          }}
          clearable={account != null}
          onClear={() => setValue('account', null)}
        />
        <TouchableTextInput
          label="Amount"
          name="amount"
          control={control}
          format={(value) =>
            value.amountType == null || value.amountFilterType == null || value.amountValue == null
              ? ''
              : mapAmount(value.amountType, value.amountFilterType, value.amountValue, value.amountValue2)
          }
          onPress={() =>
            navigation.navigate('AmountsRule', {
              amountType: amount.amountType,
              amountFilter: amount.amountType == null ? null : amount.amountFilterType,
              amountValue: amount.amountType == null ? null : amount.amountValue,
              amountValue2: amount.amountType == null ? null : amount.amountValue2
            })
          }
          style={{
            marginTop: 5,
            marginHorizontal: 5
          }}
          clearable={amount.amountType != null}
          onClear={() =>
            setValue('amount', {
              amountType: null,
              amountFilterType: null,
              amountValue: null,
              amountValue2: null
            })
          }
        />
        <TouchableTextInput
          label="Category"
          name="category"
          control={control}
          format={(value) => (value ? `${value.icon} ${value.name}` : '')}
          onPress={() => navigation.navigate('CategoryRule', { eventName: 'onCategorySelected' })}
          style={{
            marginTop: 5,
            marginHorizontal: 5
          }}
          clearable={category != null}
          onClear={() => setValue('category', null)}
        />
        <TouchableTextInput
          label="Merchant"
          name="merchant"
          control={control}
          format={(value) =>
            value.merchantValueFilter && value.merchantName
              ? `Name ${mapNameFilter(value.merchantValueFilter).toLowerCase()} ${value.merchantName}`
              : value.merchantValueFilter && value.merchantOriginalStatement
                ? `Original statement ${mapNameFilter(value.merchantValueFilter).toLowerCase()} ${value.merchantOriginalStatement}`
                : ''
          }
          onPress={() =>
            navigation.navigate('MerchantRule', {
              merchantValueFilter: merchant.merchantValueFilter,
              merchantName: merchant.merchantName,
              merchantOriginalStatement: merchant.merchantOriginalStatement
            })
          }
          style={{
            marginTop: 5,
            marginHorizontal: 5
          }}
          clearable={merchant.merchantValueFilter != null}
          onClear={() =>
            setValue('merchant', {
              merchantValueFilter: null,
              merchantName: null,
              merchantOriginalStatement: null
            })
          }
        />
        <Text variant="bodyMedium" style={{ color: colors.outline, paddingHorizontal: 15, paddingVertical: 20 }}>
          THEN APPLY THESE UPDATES
        </Text>
        <TextInput
          label="Rename merchant"
          name="newMerchantName"
          control={control}
          style={{
            marginTop: 5,
            marginHorizontal: 5
          }}
        />
        <TouchableTextInput
          label="Update category"
          name="newCategory"
          control={control}
          format={(value) => (value ? `${value.icon} ${value.name}` : '')}
          onPress={() => navigation.navigate('CategoryRule', { eventName: 'onUpdateCategorySelected' })}
          style={{
            marginTop: 5,
            marginHorizontal: 5
          }}
          clearable={newCategory != null}
          onClear={() => setValue('newCategory', null)}
        />
        <PaperPickerField
          label="Review status"
          name="needsReview"
          control={control}
          items={reviewItems}
          style={{
            marginTop: 5,
            marginHorizontal: 5
          }}
        />
        <PaperPickerField
          label="Transaction visibility"
          name="hideTransaction"
          control={control}
          items={hideItems}
          style={{
            marginTop: 5,
            marginHorizontal: 5
          }}
        />
        <PaperPickerField
          label="Apply to existing transactions"
          name="applyToExisting"
          control={control}
          items={applyItems}
          style={{
            marginTop: 5,
            marginHorizontal: 5
          }}
        />
        {applyToExisting && (
          <Text variant="titleMedium" style={{ color: colors.outline, paddingHorizontal: 15, paddingVertical: 10 }}>
            This rule will apply to {transactions.length} existing transactions
          </Text>
        )}
      </View>
      <Button
        mode="contained"
        style={{ marginHorizontal: 5, marginTop: 5, marginBottom: 30, alignSelf: 'stretch' }}
        disabled={submitting}
        onPress={handleSubmit(onSubmit)}
        loading={submitting}
      >
        Save Rule
      </Button>
    </ScrollView>
  )
}
