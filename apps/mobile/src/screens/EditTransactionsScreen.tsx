import { MaterialIcons } from '@expo/vector-icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ApiQuery, deleteTransactions, editTransactions } from 'frontend-api'
import { RecurringTransaction, Tag } from 'frontend-types'
import { eventEmitter, formatFrequency, formatRecurringTransaction, mapTagColorToHex } from 'frontend-utils'
import _ from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { Button, Dialog, Divider, Portal, Text, useTheme } from 'react-native-paper'

import { Account } from '../../../../libs/frontend-types/src/account.type'
import { Category } from '../../../../libs/frontend-types/src/category.type'
import { Merchant } from '../../../../libs/frontend-types/src/merchant.type'
import { ActivityIndicator } from '../components/common/ActivityIndicator'
import { PickerField } from '../components/common/PickerField'
import { View } from '../components/common/View'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const EditTransactionsScreen: React.FC<RootStackScreenProps<'EditTransactions'>> = ({ route, navigation }) => {
  const { transactions } = route.params

  const queryClient = useQueryClient()
  const { colors } = useTheme()

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [needsReview, setNeedsReview] = useState<number | null>(null)
  const [hidden, setHidden] = useState<number | null>(null)
  const [category, setCategory] = useState<Category | undefined>(undefined)
  const [merchant, setMerchant] = useState<Merchant | undefined>(undefined)
  const [tags, setTags] = useState<Tag[]>([])
  const [recurringTransaction, setRecurringTransaction] = useState<RecurringTransaction | undefined>(undefined)

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await editTransactions({
        transactionIds: transactions.map((t) => t.id),
        date,
        needsReview: needsReview === 1 ? true : needsReview === 0 ? false : undefined,
        hidden: hidden === 1 ? true : hidden === 0 ? false : undefined,
        categoryId: category?.id,
        merchantId: merchant?.id,
        tagIds: tags.length ? tags.map((t) => t.id) : undefined,
        recurringTransactionId: recurringTransaction?.id
      })
      if (res.ok && res.parsedBody?.payload) {
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.Transactions] })
        navigation.pop()
      }
    }
  })

  const { mutate: deleteMutation, isPending: loadingDelete } = useMutation({
    mutationFn: async () => {
      const res = await deleteTransactions(transactions.map((t) => t.id))
      if (res.ok && res.parsedBody?.payload) {
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.Transactions] })
        navigation.pop()
      }
    }
  })

  const disabled = useMemo(
    () =>
      date == null &&
      needsReview == null &&
      hidden == null &&
      category == null &&
      merchant == null &&
      tags.length === 0 &&
      recurringTransaction == null,
    [date, needsReview, hidden, category, merchant, tags, recurringTransaction]
  )

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        isPending || loadingDelete ? (
          <ActivityIndicator />
        ) : (
          <TouchableOpacity onPress={() => mutate()} disabled={disabled}>
            <Text variant="bodyLarge" style={{ opacity: disabled ? 0.5 : 1 }}>
              SAVE
            </Text>
          </TouchableOpacity>
        ),
      title: `Edit ${transactions.length} transactions`
    })
  }, [isPending, loadingDelete, disabled, navigation, transactions.length, mutate])

  useEffect(() => {
    const onCategorySelected = (category: Category) => {
      setCategory(category)
    }
    eventEmitter.on('onCategorySelected', onCategorySelected)

    const onMerchantSelected = (merchant: Merchant) => {
      setMerchant(merchant)
    }
    eventEmitter.on('onMerchantSelected', onMerchantSelected)

    const onTagSelected = (tag: Tag) => {
      setTags((oldTags) =>
        oldTags.find((t) => t.id === tag.id) ? oldTags.filter((t) => t.id !== tag.id) : [...oldTags, tag]
      )
    }
    eventEmitter.on('onTagSelected', onTagSelected)

    const onRecurringTransactionSelected = (recurringTransaction: RecurringTransaction) => {
      setRecurringTransaction(recurringTransaction)
    }
    eventEmitter.on('onRecurringTransactionSelected', onRecurringTransactionSelected)

    return () => {
      eventEmitter.off('onCategorySelected', onCategorySelected)
      eventEmitter.off('onMerchantSelected', onMerchantSelected)
      eventEmitter.off('onTagSelected', onTagSelected)
      eventEmitter.off('onRecurringTransactionSelected', onRecurringTransactionSelected)
    }
  }, [])

  const accounts = useMemo(() => {
    return _.uniqBy(
      transactions.map((t) => t.account),
      'id'
    )
  }, [transactions])

  const getAccountName = (account: Account) => {
    let title = account.name
    if (account.mask) {
      title += ` (...${account.mask})`
    }
    return title
  }

  const styles = StyleSheet.create({
    infoView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20
    }
  })

  const needsReviewItems = useMemo(
    () => [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 }
    ],
    []
  )

  const hiddenItems = useMemo(
    () => [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 }
    ],
    []
  )

  return (
    <ScrollView>
      <View style={{ marginVertical: 25, paddingHorizontal: 20 }}>
        <Text variant="titleMedium" style={{}}>
          {accounts.length} accounts selected
        </Text>
        {accounts.map((account) => (
          <Text key={account.id} variant="bodyMedium" style={{ marginTop: 5 }} numberOfLines={1}>
            {getAccountName(account)}
          </Text>
        ))}
      </View>
      <Divider />
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('SelectMerchant', { merchantIds: [], eventName: 'onMerchantSelected', multiple: false })
        }
      >
        <View style={styles.infoView}>
          <Text variant="bodyMedium" style={{ textAlign: 'center', marginVertical: 25 }}>
            Merchant
          </Text>
          <Text variant="bodyMedium" style={{ textAlign: 'center', marginVertical: 25 }}>
            {merchant ? `${merchant.name}` : 'Select merchants...'}
          </Text>
        </View>
      </TouchableOpacity>
      <Divider />
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('SelectCategory', { categoryIds: [], eventName: 'onCategorySelected', multiple: false })
        }
      >
        <View style={styles.infoView}>
          <Text variant="bodyMedium" style={{ textAlign: 'center', marginVertical: 25 }}>
            Category
          </Text>
          <Text variant="bodyMedium" style={{ textAlign: 'center', marginVertical: 25 }}>
            {category ? `${category.name}` : 'Select category...'}
          </Text>
        </View>
      </TouchableOpacity>
      <Divider />
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <View style={styles.infoView}>
          <Text variant="bodyMedium" style={{ textAlign: 'center', marginVertical: 25 }}>
            Date
          </Text>
          {date ? (
            <Text variant="bodyMedium" style={{ textAlign: 'center', marginVertical: 25 }}>
              {format(date, 'MMMM d, yyyy')}
            </Text>
          ) : (
            <Text variant="bodyMedium" style={{ textAlign: 'center', marginVertical: 25 }}>
              Change date...
            </Text>
          )}
        </View>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={showDatePicker}
        date={date ?? new Date()}
        mode="date"
        display="inline"
        onConfirm={(date) => {
          setShowDatePicker(false)
          setDate(date)
        }}
        onCancel={() => {
          setShowDatePicker(false)
        }}
      />
      <Divider />
      <TouchableOpacity
        onPress={() => navigation.navigate('SelectTag', { tagIds: tags.map((t) => t.id), eventName: 'onTagSelected' })}
      >
        <View style={styles.infoView}>
          <Text variant="bodyMedium" style={{ textAlign: 'center', marginVertical: 25 }}>
            Tags
          </Text>
          {tags.length === 0 ? (
            <Text variant="bodyMedium" style={{ textAlign: 'center', marginVertical: 25 }}>
              Add tags...
            </Text>
          ) : (
            <View style={{ flexDirection: 'row', gap: 5 }}>
              {tags.map((tag) => (
                <View
                  key={tag.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: colors.secondaryContainer,
                    padding: 5,
                    borderRadius: 5
                  }}
                >
                  <View
                    style={{
                      backgroundColor: mapTagColorToHex(tag.color),
                      borderRadius: 100,
                      width: 15,
                      height: 15,
                      marginRight: 10
                    }}
                  />
                  <Text variant="titleMedium" numberOfLines={1} style={{ marginBottom: 2 }}>
                    {tag.name}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </TouchableOpacity>
      <Divider />
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('SelectRecurringTransaction', {
            recurringTransactionIds: [],
            eventName: 'onRecurringTransactionSelected',
            multiple: false
          })
        }
      >
        <View style={styles.infoView}>
          <Text variant="bodyMedium" style={{ textAlign: 'center', marginVertical: 25 }}>
            Recurring
          </Text>
          {recurringTransaction ? (
            <View style={{ alignItems: 'flex-end' }}>
              <Text variant="titleMedium" numberOfLines={1}>
                {formatRecurringTransaction(recurringTransaction)}
              </Text>
              <Text variant="bodyMedium" style={{ color: colors.outline }} numberOfLines={1}>
                {formatFrequency(
                  recurringTransaction.startDate,
                  recurringTransaction.frequency,
                  recurringTransaction.interval
                )}
              </Text>
            </View>
          ) : (
            <Text
              variant="bodyMedium"
              style={{ textAlign: 'right', marginVertical: 25, marginLeft: 10, flex: 1, flexWrap: 'wrap' }}
            >
              Select recurring...
            </Text>
          )}
        </View>
      </TouchableOpacity>
      <Divider />
      <PickerField
        label="Hidden"
        onValueChange={(value) => {
          setHidden(value)
        }}
        items={hiddenItems}
        value={hidden}
        showPlaceholder
        backgroundColor="transparent"
      />
      <Divider />
      <PickerField
        label="Needs review"
        onValueChange={(value) => {
          setNeedsReview(value)
        }}
        items={needsReviewItems}
        value={needsReview}
        showPlaceholder
        backgroundColor="transparent"
      />
      <Divider />

      <TouchableOpacity
        onPress={() => setDeleteDialogVisible(true)}
        style={{
          flexDirection: 'row',
          paddingHorizontal: 20,
          paddingVertical: 25,
          alignItems: 'center'
        }}
      >
        <Text variant="bodyMedium" style={{ flex: 1 }}>
          Delete {transactions.length} transactions
        </Text>
        <MaterialIcons name="arrow-forward-ios" size={16} color={colors.onSurface} />
      </TouchableOpacity>
      <Divider />
      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>Delete Transactions</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete the selected transactions?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button onPress={() => deleteMutation()}>Ok</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  )
}
