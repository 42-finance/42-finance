import { Feather } from '@expo/vector-icons'
import { Account, Category, Merchant, Tag } from 'frontend-types'
import { eventEmitter } from 'frontend-utils'
import { mapAmount } from 'frontend-utils/src/mappers/map-amount-filter'
import * as React from 'react'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { ScrollView, TouchableOpacity } from 'react-native'
import { Divider, Text, useTheme } from 'react-native-paper'
import { AmountFilter, TransactionAmountType } from 'shared-types'

import { AccountFilter } from '../components/account/AccountFilter'
import { CategoryFilter } from '../components/category/CategoryFilter'
import { BottomActionView } from '../components/common/BottomActionView'
import { DateField } from '../components/common/DateField'
import { PaperPickerField } from '../components/common/PaperPickerField'
import { View } from '../components/common/View'
import { MerchantFilter } from '../components/merchant/MerchantFilter'
import { TagFilter } from '../components/tag/TagFilter'
import { useTransactionsFilterContext } from '../contexts/transactions-filter.context'
import { useUserTokenContext } from '../contexts/user-token.context'
import { RootStackScreenProps } from '../types/root-stack-screen-props'
import { AmountFormFields } from './SelectAmountsScreen'

export type TransactionFilterFormFields = {
  accounts: string[]
  amountType: TransactionAmountType | null
  amountFilter: AmountFilter | null
  amountValue: number | null
  amountValue2: number | null
  categories: number[]
  startDate: Date | null
  endDate: Date | null
  merchants: number[]
  hidden: boolean | null
  needsReview: boolean | null
  tags: number[]
}

export const TransactionsFilterScreen = ({ navigation }: RootStackScreenProps<'TransactionsFilter'>) => {
  const { colors } = useTheme()
  const { currencyCode } = useUserTokenContext()
  const {
    setAccounts,
    setAmountType,
    setAmountFilter,
    setAmountValue,
    setAmountValue2,
    setCategories,
    setStartDate,
    setEndDate,
    setMerchants,
    setHidden,
    setNeedsReview,
    setTags,
    accounts: defaultAccounts,
    amountType: defaultAmountType,
    amountFilter: defaultAmountFilter,
    amountValue: defaultAmountValue,
    amountValue2: defaultAmountValue2,
    categories: defaultCategories,
    startDate: defaultStartDate,
    endDate: defaultEndDate,
    merchants: defaultMerchants,
    hidden: defaultHidden,
    needsReview: defaultNeedsReview,
    tags: defaultTags
  } = useTransactionsFilterContext()

  const { control, setValue, watch } = useForm<TransactionFilterFormFields>({
    defaultValues: {
      accounts: defaultAccounts,
      amountType: defaultAmountType,
      amountFilter: defaultAmountFilter,
      amountValue: defaultAmountValue,
      amountValue2: defaultAmountValue2,
      categories: defaultCategories,
      startDate: defaultStartDate,
      endDate: defaultEndDate,
      merchants: defaultMerchants,
      hidden: defaultHidden,
      needsReview: defaultNeedsReview,
      tags: defaultTags
    }
  })

  const accounts = watch('accounts')
  const amountType = watch('amountType')
  const amountFilter = watch('amountFilter')
  const amountValue = watch('amountValue')
  const amountValue2 = watch('amountValue2')
  const categories = watch('categories')
  const startDate = watch('startDate')
  const endDate = watch('endDate')
  const merchants = watch('merchants')
  const hidden = watch('hidden')
  const needsReview = watch('needsReview')
  const tags = watch('tags')

  const onApply = () => {
    setAccounts(accounts)
    setAmountType(amountType)
    setAmountFilter(amountFilter)
    setAmountValue(amountValue)
    setAmountValue2(amountValue2)
    setCategories(categories)
    setStartDate(startDate)
    setEndDate(endDate)
    setMerchants(merchants)
    setHidden(hidden)
    setNeedsReview(needsReview)
    setTags(tags)
    navigation.pop()
  }

  const onClear = () => {
    setValue('accounts', [])
    setValue('amountType', null)
    setValue('amountFilter', null)
    setValue('amountValue', null)
    setValue('amountValue2', null)
    setValue('categories', [])
    setValue('startDate', null)
    setValue('endDate', null)
    setValue('merchants', [])
    setValue('hidden', null)
    setValue('needsReview', null)
    setValue('tags', [])
  }

  useEffect(() => {
    const onCategorySelected = (category: Category) => {
      setValue(
        'categories',
        categories.find((c) => c === category.id)
          ? categories.filter((c) => c !== category.id)
          : [...categories, category.id]
      )
    }

    eventEmitter.on('onCategoryFilterSelected', onCategorySelected)

    return () => {
      eventEmitter.off('onCategoryFilterSelected', onCategorySelected)
    }
  }, [categories, setValue])

  useEffect(() => {
    const onMerchantSelected = (merchant: Merchant) => {
      setValue(
        'merchants',
        merchants.find((c) => c === merchant.id)
          ? merchants.filter((c) => c !== merchant.id)
          : [...merchants, merchant.id]
      )
    }

    eventEmitter.on('onMerchantFilterSelected', onMerchantSelected)

    return () => {
      eventEmitter.off('onMerchantFilterSelected', onMerchantSelected)
    }
  }, [merchants, setValue])

  useEffect(() => {
    const onAccountSelected = (account: Account) => {
      setValue(
        'accounts',
        accounts.find((c) => c === account.id) ? accounts.filter((c) => c !== account.id) : [...accounts, account.id]
      )
    }

    eventEmitter.on('onAccountFilterSelected', onAccountSelected)

    return () => {
      eventEmitter.off('onAccountFilterSelected', onAccountSelected)
    }
  }, [accounts, setValue])

  useEffect(() => {
    const onAmountSelected = (amount: AmountFormFields) => {
      setValue('amountType', amount.amountType)
      setValue('amountFilter', amount.amountFilter)
      setValue('amountValue', amount.amountValue)
      setValue('amountValue2', amount.amountValue2)
    }

    eventEmitter.on('onAmountFilterSelected', onAmountSelected)

    return () => {
      eventEmitter.off('onAmountFilterSelected', onAmountSelected)
    }
  }, [accounts, setValue])

  useEffect(() => {
    const onTagSelected = (tag: Tag) => {
      setValue('tags', tags.find((c) => c === tag.id) ? tags.filter((c) => c !== tag.id) : [...tags, tag.id])
    }

    eventEmitter.on('onTagFilterSelected', onTagSelected)

    return () => {
      eventEmitter.off('onTagFilterSelected', onTagSelected)
    }
  }, [tags, setValue])

  const reviewItems = useMemo(
    () => [
      { label: 'All', value: null },
      { label: 'Needs review', value: true },
      { label: 'Reviewed', value: false }
    ],
    []
  )

  const hideItems = useMemo(
    () => [
      { label: 'All', value: null },
      { label: 'Visible', value: false },
      { label: 'Hidden', value: true }
    ],
    []
  )

  return (
    <>
      <ScrollView style={{ backgroundColor: colors.elevation.level2 }}>
        <Text variant="bodyMedium" style={{ marginLeft: 15, marginTop: 10 }}>
          DATE RANGE
        </Text>
        <DateField
          label="Start Date"
          name="startDate"
          control={control}
          value={startDate ?? undefined}
          setValue={(value) => {
            setValue('startDate', value)
          }}
          style={{
            marginHorizontal: 5,
            marginTop: 5
          }}
        />
        <DateField
          label="End Date"
          name="endDate"
          control={control}
          value={endDate ?? undefined}
          setValue={(value) => {
            setValue('endDate', value)
          }}
          style={{
            marginHorizontal: 5,
            marginTop: 5
          }}
        />
        <AccountFilter
          accountIds={accounts}
          onDelete={(accountId) => {
            setValue(
              'accounts',
              accounts.filter((c) => c !== accountId)
            )
          }}
        />
        <Divider />
        <CategoryFilter
          categoryIds={categories}
          onDelete={(categoryId) =>
            setValue(
              'categories',
              categories.filter((c) => c !== categoryId)
            )
          }
        />
        <Divider />
        <MerchantFilter
          merchantIds={merchants}
          onDelete={(merchantId) =>
            setValue(
              'merchants',
              merchants.filter((c) => c !== merchantId)
            )
          }
        />
        <Divider />
        <TagFilter
          tagIds={tags}
          onDelete={(tagId) =>
            setValue(
              'tags',
              tags.filter((c) => c !== tagId)
            )
          }
        />
        <Divider />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 15, marginVertical: 10 }}>
          <Text variant="bodyMedium" style={{ flex: 1 }}>
            {mapAmount(amountType, amountFilter, amountValue, amountValue2, 'All Amounts', currencyCode)}
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('SelectAmounts', {
                eventName: 'onAmountFilterSelected',
                defaultAmountType: amountType,
                defaultAmountFilter: amountFilter,
                defaultAmountValue: amountValue,
                defaultAmountValue2: amountValue2
              })
            }
          >
            <Feather name="edit-2" size={24} color={colors.onSurface} />
          </TouchableOpacity>
        </View>
        <PaperPickerField
          label="Review status"
          name="needsReview"
          control={control}
          items={reviewItems}
          style={{
            marginTop: 5,
            marginHorizontal: 5
          }}
          onValueChange={(value) => setValue('needsReview', value)}
        />
        <PaperPickerField
          label="Transaction visibility"
          name="hidden"
          control={control}
          items={hideItems}
          style={{
            marginTop: 5,
            marginHorizontal: 5,
            marginBottom: 90
          }}
          onValueChange={(value) => setValue('hidden', value)}
        />
      </ScrollView>
      <BottomActionView applyText="Apply Filters" onClear={onClear} onApply={onApply} />
    </>
  )
}
