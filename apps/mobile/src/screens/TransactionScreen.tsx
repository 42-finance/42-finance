import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as ImagePicker from 'expo-image-picker'
import {
  ApiQuery,
  EditTransactionRequest,
  deleteTransaction,
  editTransaction,
  getTransaction,
  uploadAttachment
} from 'frontend-api'
import { Account, Merchant, RecurringTransaction, Tag } from 'frontend-types'
import {
  dateToLocal,
  eventEmitter,
  formatAccountName,
  formatDateInUtc,
  formatDollars,
  formatFrequency,
  formatRecurringTransaction,
  mapTagColorToHex,
  useDebounce
} from 'frontend-utils'
import _ from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { Image, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import {
  ActivityIndicator,
  Avatar,
  Button,
  Dialog,
  Divider,
  Portal,
  ProgressBar,
  Snackbar,
  Switch,
  Text,
  useTheme
} from 'react-native-paper'

import { Category } from '../../../../libs/frontend-types/src/category.type'
import { View } from '../components/common/View'
import { useActionSheet } from '../hooks/use-action-sheet.hook'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const TransactionScreen: React.FC<RootStackScreenProps<'Transaction'>> = ({ route, navigation }) => {
  const { transactionId } = route.params

  const showActionSheet = useActionSheet()
  const queryClient = useQueryClient()
  const { colors } = useTheme()

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [deleteDialogVisible, setDeleteDialogVisible] = React.useState(false)
  const [updatedCategory, setUpdatedCategory] = useState<Category | null>(null)

  const [notes, setNotes] = useState('')
  const [notesParam, setNotesParam] = useDebounce('')
  const isLoaded = useRef(false)

  const [attachmentFiles, setAttachmentFiles] = useState<string[]>([])

  const { data: transaction } = useQuery({
    queryKey: [ApiQuery.Transaction, transactionId],
    queryFn: async () => {
      const res = await getTransaction(transactionId)
      if (res.ok && res.parsedBody?.payload) {
        setNotes(res.parsedBody.payload.notes)
        return res.parsedBody.payload
      }
      return null
    },
    placeholderData: keepPreviousData
  })

  const { mutate } = useMutation({
    mutationFn: async (request: EditTransactionRequest) => {
      const res = await editTransaction(transactionId, request)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Transactions] })
      }
    }
  })

  const { mutate: deleteMutation, isPending: loadingDelete } = useMutation({
    mutationFn: async () => {
      const res = await deleteTransaction(transactionId)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Transactions] })
        navigation.pop()
      }
    }
  })

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            showActionSheet([
              ...(transaction?.splitTransactionId
                ? [
                    {
                      label: 'Edit transaction splits',
                      onSelected: () => {
                        navigation.navigate('SplitTransaction', { transactionId: transaction.splitTransactionId })
                      }
                    }
                  ]
                : [
                    {
                      label: 'Split transaction',
                      onSelected: () => {
                        navigation.navigate('SplitTransaction', { transactionId })
                      }
                    }
                  ]),
              {
                label: 'Delete transaction',
                onSelected: () => {
                  setDeleteDialogVisible(true)
                },
                isDestructive: true
              }
            ])
          }}
        >
          <Ionicons name="ellipsis-horizontal" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      ),
      title: transaction?.merchant?.name ?? 'Loading...'
    })
  }, [colors.onSurface, navigation, showActionSheet, transaction, transactionId])

  useEffect(() => {
    if (transaction) {
      const onCategorySelected = (category: Category) => {
        transaction.category = category
        transaction.needsReview = false
        mutate({ categoryId: category.id, needsReview: false })
        setUpdatedCategory(category)
      }
      eventEmitter.on('onCategorySelected', onCategorySelected)

      const onTagSelected = (tag: Tag) => {
        transaction.tags = transaction.tags.find((c) => c.id === tag.id)
          ? transaction.tags.filter((c) => c.id !== tag.id)
          : [...transaction.tags, tag]
        transaction.needsReview = false
        mutate({ tagIds: transaction.tags.map((t) => t.id), needsReview: false })
      }
      eventEmitter.on('onTagSelected', onTagSelected)

      const onRecurringTransactionSelected = (recurringTransaction: RecurringTransaction) => {
        transaction.recurringTransaction = recurringTransaction
        transaction.needsReview = false
        mutate({ recurringTransactionId: recurringTransaction.id, needsReview: false })
      }
      eventEmitter.on('onRecurringTransactionSelected', onRecurringTransactionSelected)

      return () => {
        eventEmitter.off('onCategorySelected', onCategorySelected)
        eventEmitter.off('onTagSelected', onTagSelected)
        eventEmitter.off('onRecurringTransactionSelected', onRecurringTransactionSelected)
      }
    }
  }, [mutate, transaction])

  useEffect(() => {
    if (isLoaded.current) {
      mutate({ notes: notesParam, needsReview: false })
    }
    isLoaded.current = true
  }, [mutate, notesParam])

  const styles = StyleSheet.create({
    infoView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20
    }
  })

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1
    })
    if (!result.canceled && result.assets[0]?.uri) {
      mutateAttachment(result.assets)
      setAttachmentFiles((files) => [...files, ...result.assets.map((asset) => asset.uri)])
    }
  }

  const { mutate: mutateAttachment } = useMutation({
    mutationFn: async (assets: ImagePicker.ImagePickerAsset[]) => {
      const data = new FormData()
      for (const asset of assets) {
        data.append('files', {
          uri: asset.uri,
          type: asset.mimeType,
          name: asset.fileName
        } as any)
      }
      const res = await uploadAttachment(transactionId, data)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Transaction] })
        const uris = assets.map((a) => a.uri)
        setAttachmentFiles((attachmentFiles) => attachmentFiles.filter((a) => !uris.includes(a)))
      }
    }
  })

  if (!transaction || loadingDelete) {
    return <ProgressBar indeterminate />
  }

  return (
    <View style={{ flex: 1 }}>
      <Snackbar
        visible={updatedCategory !== null}
        onDismiss={() => {
          setUpdatedCategory(null)
        }}
        action={{
          label: 'CREATE',
          onPress: () => {
            if (updatedCategory) {
              navigation.navigate('AddRule', {
                merchantName: transaction.merchant.name,
                newCategory: {
                  id: updatedCategory.id,
                  name: updatedCategory.name,
                  icon: updatedCategory.icon
                } as Category
              })
            }
            setUpdatedCategory(null)
          }
        }}
        wrapperStyle={{ position: 'absolute', top: 0, zIndex: 100 }}
      >
        <View>
          <Text variant="bodyLarge" style={{ fontWeight: 'bold', color: colors.inverseOnSurface }}>
            Updated to {updatedCategory?.icon} {updatedCategory?.name}
          </Text>
          <Text variant="bodyMedium" style={{ color: colors.inverseOnSurface }}>
            Create a rule to do this automatically
          </Text>
        </View>
      </Snackbar>
      <ScrollView>
        <Portal>
          <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
            <Dialog.Title>Delete Transaction</Dialog.Title>
            <Dialog.Content>
              <Text>Are you sure you want to delete this transaction?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
              <Button onPress={() => deleteMutation()}>Ok</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <View>
          <Text variant="headlineLarge" style={{ textAlign: 'center', marginVertical: 25, fontWeight: 'bold' }}>
            {formatDollars(transaction.amount)}
          </Text>
        </View>
        <Divider />
        <TouchableOpacity
          style={styles.infoView}
          onPress={() =>
            navigation.navigate('Merchant', {
              merchantId: transaction.merchantId,
              date: transaction.date.toISOString()
            })
          }
        >
          <Text
            variant="bodyMedium"
            style={{ textAlign: 'center', marginVertical: 25, color: colors.outline, marginRight: 5 }}
          >
            Merchant
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {!_.isEmpty(transaction.merchant.icon) && (
              <Avatar.Image size={32} source={{ uri: transaction.merchant.icon }} style={{ marginEnd: 8 }} />
            )}
            <Text variant="bodyLarge" style={{ textAlign: 'center', marginVertical: 25 }}>
              {transaction.merchant.name}
            </Text>
          </View>
        </TouchableOpacity>
        <Divider />
        <View style={styles.infoView}>
          <Text
            variant="bodyMedium"
            style={{ textAlign: 'center', marginVertical: 25, color: colors.outline, marginRight: 5 }}
          >
            Original Statement
          </Text>
          <Text variant="bodyLarge" style={{ textAlign: 'right', marginVertical: 25, flex: 1 }}>
            {transaction.name}
          </Text>
        </View>
        <Divider />
        <TouchableOpacity
          style={styles.infoView}
          onPress={() =>
            navigation.navigate('Merchant', {
              merchantId: transaction.merchantId,
              date: transaction.date.toISOString()
            })
          }
        >
          <Text variant="bodyMedium" style={{ textAlign: 'center', marginVertical: 25, color: colors.outline }}>
            History
          </Text>
          <Text variant="bodyLarge" style={{ textAlign: 'center', marginVertical: 25 }}>
            {transaction.historyCount} transactions
          </Text>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity
          style={styles.infoView}
          onPress={() =>
            navigation.navigate('Account', {
              accountId: transaction.accountId
            })
          }
        >
          <Text variant="bodyMedium" style={{ textAlign: 'center', marginVertical: 25, color: colors.outline }}>
            Account
          </Text>
          <Text variant="bodyLarge" style={{ textAlign: 'center', marginVertical: 25 }}>
            {formatAccountName(transaction.account)}
          </Text>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('SelectCategory', { categoryIds: [], eventName: 'onCategorySelected', multiple: false })
          }
        >
          <View style={styles.infoView}>
            <Text variant="bodyMedium" style={{ textAlign: 'center', marginVertical: 25, color: colors.outline }}>
              Category
            </Text>
            <Text
              variant="bodyLarge"
              style={{ textAlign: 'right', marginVertical: 25, marginLeft: 10, flex: 1, flexWrap: 'wrap' }}
            >
              {transaction.category.icon} {transaction.category.name}
            </Text>
          </View>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <View style={styles.infoView}>
            <Text variant="bodyMedium" style={{ textAlign: 'center', marginVertical: 25, color: colors.outline }}>
              Date
            </Text>
            <Text variant="bodyLarge" style={{ textAlign: 'center', marginVertical: 25 }}>
              {formatDateInUtc(transaction.date, 'MMMM d, yyyy')}
            </Text>
          </View>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={showDatePicker}
          date={dateToLocal(transaction.date)}
          mode="date"
          display="inline"
          onConfirm={(date) => {
            setShowDatePicker(false)
            transaction.date = date
            transaction.needsReview = false
            mutate({ date, needsReview: false })
          }}
          onCancel={() => {
            setShowDatePicker(false)
          }}
        />
        <Divider />
        <View style={styles.infoView}>
          <Text variant="bodyMedium" style={{ textAlign: 'center', marginVertical: 25, color: colors.outline }}>
            Notes
          </Text>
          <TextInput
            placeholder="Add notes..."
            onChangeText={(value) => {
              setNotes(value)
              setNotesParam(value)
            }}
            multiline
            style={{
              color: colors.onSurface,
              flex: 1,
              textAlign: 'right',
              marginVertical: 25,
              fontSize: 16,
              fontWeight: '400',
              fontFamily: 'Barlow-Regular'
            }}
            value={notes}
            placeholderTextColor={colors.outline}
          />
        </View>
        <Divider />
        <TouchableOpacity
          style={styles.infoView}
          onPress={() =>
            navigation.navigate('SelectTag', { tagIds: transaction.tags.map((t) => t.id), eventName: 'onTagSelected' })
          }
        >
          <Text variant="bodyMedium" style={{ textAlign: 'center', marginVertical: 25, color: colors.outline }}>
            Tags
          </Text>
          {transaction.tags.length === 0 ? (
            <Text variant="bodyLarge" style={{ textAlign: 'center', marginVertical: 25, color: colors.outline }}>
              Add tags...
            </Text>
          ) : (
            <View style={{ flexDirection: 'row', gap: 5 }}>
              {transaction.tags.map((tag) => (
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
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity
          style={styles.infoView}
          onPress={() => navigation.navigate('TransactionRules', { transactionId })}
        >
          <Text variant="bodyMedium" style={{ textAlign: 'center', marginVertical: 25, color: colors.outline }}>
            Rules
          </Text>
          <Text variant="bodyLarge" style={{ textAlign: 'center', marginVertical: 25 }}>
            {transaction.matchingRules?.length} {transaction.matchingRules?.length === 1 ? 'rule' : 'rules'}
          </Text>
        </TouchableOpacity>
        <Divider />
        <View style={styles.infoView}>
          <Text variant="bodyMedium" style={{ textAlign: 'center', marginVertical: 25, color: colors.outline }}>
            Needs Review
          </Text>
          <Switch
            value={transaction.needsReview}
            onValueChange={(value) => {
              transaction.needsReview = value
              mutate({ needsReview: value })
            }}
          />
        </View>
        <Divider />
        <View style={styles.infoView}>
          <Text variant="bodyMedium" style={{ textAlign: 'center', marginVertical: 25, color: colors.outline }}>
            Hide
          </Text>
          <Switch
            value={transaction.hidden}
            onValueChange={(value) => {
              transaction.hidden = value
              transaction.needsReview = false
              mutate({ hidden: value, needsReview: false })
            }}
          />
        </View>
        <Divider />
        <View style={styles.infoView}>
          <Text variant="bodyMedium" style={{ textAlign: 'center', marginVertical: 25, color: colors.outline }}>
            Attachments
          </Text>
          {transaction.attachments.length === 0 && attachmentFiles.length === 0 && (
            <TouchableOpacity onPress={pickImage}>
              <Text variant="bodyLarge" style={{ textAlign: 'center', marginVertical: 25, color: colors.outline }}>
                Add attachments...
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10,
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingBottom: 20,
            marginTop: -10
          }}
        >
          {transaction.attachments.map((attachment) => (
            <TouchableOpacity
              key={attachment}
              onPress={() => navigation.navigate('Photo', { transactionId: transaction.id, attachment })}
            >
              <Image
                style={{ width: 100, height: 100, borderRadius: 5, objectFit: 'contain', backgroundColor: '#222' }}
                source={{ uri: attachment }}
              />
            </TouchableOpacity>
          ))}
          {attachmentFiles.map((attachment) => (
            <TouchableOpacity key={attachment} style={{ position: 'relative' }}>
              <Image
                style={{ width: 100, height: 100, borderRadius: 5, objectFit: 'contain', backgroundColor: '#222' }}
                source={{ uri: attachment }}
              />
              <ActivityIndicator style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} />
            </TouchableOpacity>
          ))}
          {transaction.attachments.length > 0 && (
            <TouchableOpacity
              style={{
                width: 100,
                height: 100,
                borderRadius: 5,
                backgroundColor: '#222',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              onPress={pickImage}
            >
              <FontAwesome name="camera" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>
        <Divider />
        <TouchableOpacity
          onPress={() =>
            showActionSheet([
              {
                label: 'Select recurring transaction',
                onSelected: () =>
                  navigation.navigate('SelectRecurringTransaction', {
                    recurringTransactionIds: [],
                    eventName: 'onRecurringTransactionSelected',
                    multiple: false
                  })
              },
              ...(transaction.recurringTransaction
                ? [
                    {
                      label: 'Clear recurring transaction',
                      onSelected: () => {
                        transaction.recurringTransaction = null
                        transaction.needsReview = false
                        mutate({ recurringTransactionId: null, needsReview: false })
                      },
                      isDestructive: true
                    }
                  ]
                : [
                    {
                      label: 'Create recurring transaction',
                      onSelected: () =>
                        navigation.navigate('AddRecurringTransaction', {
                          transactionId,
                          startDate: dateToLocal(transaction.date).toISOString(),
                          amount: transaction.amount,
                          type: transaction.category.group.type,
                          account: {
                            id: transaction.account.id,
                            name: transaction.account.name,
                            mask: transaction.account.mask
                          } as Account,
                          merchant: {
                            id: transaction.merchant.id,
                            name: transaction.merchant.name
                          } as Merchant
                        })
                    }
                  ])
            ])
          }
        >
          <View style={styles.infoView}>
            <Text
              variant="bodyMedium"
              style={{ textAlign: 'center', marginVertical: 25, color: colors.outline, marginRight: 10 }}
            >
              Recurring
            </Text>
            {transaction.recurringTransaction ? (
              <View style={{ alignItems: 'flex-end' }}>
                <Text variant="titleMedium" numberOfLines={1}>
                  {formatRecurringTransaction(transaction.recurringTransaction)}
                </Text>
                <Text variant="bodyMedium" style={{ color: colors.outline }} numberOfLines={1}>
                  {formatFrequency(
                    transaction.recurringTransaction.startDate,
                    transaction.recurringTransaction.frequency,
                    transaction.recurringTransaction.interval
                  )}
                </Text>
              </View>
            ) : (
              <Text
                variant="bodyLarge"
                style={{ textAlign: 'right', marginVertical: 25, marginLeft: 10, flex: 1, flexWrap: 'wrap' }}
              >
                No
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}
