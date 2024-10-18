import { AntDesign, Feather } from '@expo/vector-icons'
import { Account, Category, Merchant, Tag } from 'frontend-types'
import { eventEmitter } from 'frontend-utils'
import { useTransactionsFilterContext } from 'frontend-utils/src/contexts/transactions-filter.context'
import { mapAmount } from 'frontend-utils/src/mappers/map-amount-filter'
import * as React from 'react'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { ScrollView, TouchableOpacity } from 'react-native'
import { Divider, Text, useTheme } from 'react-native-paper'
import { AmountFilter, TransactionAmountType } from 'shared-types'

import { AccountFilterSelection } from '../components/account/AccountFilterSelection'
import { CategoryFilterSelection } from '../components/category/CategoryFilterSelection'
import { BottomActionView } from '../components/common/BottomActionView'
import { DateField } from '../components/common/DateField'
import { PaperPickerField } from '../components/common/PaperPickerField'
import { View } from '../components/common/View'
import { MerchantFilterSelection } from '../components/merchant/MerchantFilterSelection'
import { TagFilterSelection } from '../components/tag/TagFilterSelection'
import { useUserTokenContext } from '../contexts/user-token.context'
import { RootStackScreenProps } from '../types/root-stack-screen-props'
import { AmountFormFields } from './SelectAmountsScreen'

export type TransactionFilterFormFields = {
  accounts: Account[]
  amountType: TransactionAmountType | null
  amountFilter: AmountFilter | null
  amountValue: number | null
  amountValue2: number | null
  categories: Category[]
  startDate: Date | null
  endDate: Date | null
  merchants: Merchant[]
  hidden: boolean | null
  needsReview: boolean | null
  tags: Tag[]
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
        categories.find((c) => c.id === category.id)
          ? categories.filter((c) => c.id !== category.id)
          : [...categories, category]
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
        merchants.find((c) => c.id === merchant.id)
          ? merchants.filter((c) => c.id !== merchant.id)
          : [...merchants, merchant]
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
        accounts.find((c) => c.id === account.id) ? accounts.filter((c) => c.id !== account.id) : [...accounts, account]
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
      setValue('tags', tags.find((c) => c.id === tag.id) ? tags.filter((c) => c.id !== tag.id) : [...tags, tag])
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
        <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 15, marginVertical: 10 }}>
          <Text variant="bodyMedium" style={{ flex: 1 }}>
            Accounts
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('SelectAccount', {
                accountIds: accounts.map((a) => a.id),
                eventName: 'onAccountFilterSelected',
                multiple: true
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
            onDelete={() =>
              setValue(
                'accounts',
                accounts.filter((c) => c.id !== account.id)
              )
            }
          />
        ))}
        <Divider />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 15, marginVertical: 10 }}>
          <Text variant="bodyMedium" style={{ flex: 1 }}>
            Categories
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('SelectCategory', {
                categoryIds: categories.map((c) => c.id),
                eventName: 'onCategoryFilterSelected',
                multiple: true
              })
            }
          >
            <AntDesign name="pluscircleo" size={24} color={colors.onSurface} />
          </TouchableOpacity>
        </View>
        {categories.map((category) => (
          <CategoryFilterSelection
            key={category.id}
            category={category}
            onDelete={() =>
              setValue(
                'categories',
                categories.filter((c) => c.id !== category.id)
              )
            }
          />
        ))}
        <Divider />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 15, marginVertical: 10 }}>
          <Text variant="bodyMedium" style={{ flex: 1 }}>
            Merchants
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('SelectMerchant', {
                merchantIds: merchants.map((m) => m.id),
                eventName: 'onMerchantFilterSelected',
                multiple: true
              })
            }
          >
            <AntDesign name="pluscircleo" size={24} color={colors.onSurface} />
          </TouchableOpacity>
        </View>
        {merchants.map((merchant) => (
          <MerchantFilterSelection
            key={merchant.id}
            merchant={merchant}
            onDelete={() =>
              setValue(
                'merchants',
                merchants.filter((c) => c.id !== merchant.id)
              )
            }
          />
        ))}
        <Divider />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 15, marginVertical: 10 }}>
          <Text variant="bodyMedium" style={{ flex: 1 }}>
            Tags
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('SelectTag', { tagIds: tags.map((t) => t.id), eventName: 'onTagFilterSelected' })
            }
          >
            <AntDesign name="pluscircleo" size={24} color={colors.onSurface} />
          </TouchableOpacity>
        </View>
        {tags.map((tag) => (
          <TagFilterSelection
            key={tag.id}
            tag={tag}
            onDelete={() =>
              setValue(
                'tags',
                tags.filter((c) => c.id !== tag.id)
              )
            }
          />
        ))}
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
