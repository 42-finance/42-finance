import { Ionicons } from '@expo/vector-icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ApiQuery,
  SplitTransactionRequest,
  deleteSplitTransactions,
  getTransaction,
  splitTransaction
} from 'frontend-api'
import { eventEmitter, formatDollarsSigned, roundToTwoDecimals } from 'frontend-utils'
import React, { useEffect, useMemo, useState } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import { Button, ProgressBar, Text, useTheme } from 'react-native-paper'
import uuid from 'react-native-uuid'

import { Category } from '../../../../libs/frontend-types/src/category.type'
import { Transaction } from '../../../../libs/frontend-types/src/transaction.type'
import { View } from '../components/common/View'
import { TransactionItem } from '../components/list-items/TransactionItem'
import { SplitTransaction } from '../components/transaction/SplitTransaction'
import { useActionSheet } from '../hooks/use-action-sheet.hook'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const SplitTransactionScreen: React.FC<RootStackScreenProps<'SplitTransaction'>> = ({ route, navigation }) => {
  const { transactionId } = route.params

  const showActionSheet = useActionSheet()
  const queryClient = useQueryClient()
  const { colors } = useTheme()

  const [splitTransactions, setSplitTransactions] = useState<Transaction[]>([])
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null)

  const { data: transaction } = useQuery({
    queryKey: [ApiQuery.Transaction, transactionId],
    queryFn: async () => {
      const res = await getTransaction(transactionId)
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return null
    }
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async (request: SplitTransactionRequest) => {
      const res = await splitTransaction(transactionId, request)
      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Transactions] })
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Transaction] })
        navigation.navigate('Transactions')
      }
    }
  })

  const { mutate: deleteMutation, isPending: loadingDelete } = useMutation({
    mutationFn: async () => {
      const res = await deleteSplitTransactions(transactionId)
      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Transactions] })
        navigation.navigate('Transactions')
      }
    }
  })

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        transaction?.splitTransactions?.length ? (
          <TouchableOpacity
            onPress={() => {
              showActionSheet([
                {
                  label: 'Delete transaction splits',
                  onSelected: () => deleteMutation(),
                  isDestructive: true
                }
              ])
            }}
          >
            <Ionicons name="ellipsis-horizontal" size={24} color={colors.onSurface} />
          </TouchableOpacity>
        ) : null
    })
  }, [transaction])

  useEffect(() => {
    if (transaction) {
      if (transaction.splitTransactions?.length) {
        setSplitTransactions(transaction.splitTransactions.map((t) => ({ ...t, amount: Math.abs(t.amount) })))
      } else {
        setSplitTransactions([{ ...transaction, amount: Math.abs(transaction.amount), id: uuid.v4() as string }])
      }
    }
  }, [transaction])

  useEffect(() => {
    if (transaction) {
      const onCategorySelected = (category: Category) => {
        setSplitTransactions((s) => [
          ...s,
          {
            ...transaction,
            id: uuid.v4() as string,
            amount: 0,
            category,
            categoryId: category.id
          }
        ])
      }

      eventEmitter.on('onSplitCategorySelected', onCategorySelected)

      return () => {
        eventEmitter.off('onSplitCategorySelected', onCategorySelected)
      }
    }
  }, [transaction])

  const leftToSplit = useMemo(() => {
    if (!transaction) return 0
    let splitValue = 0
    for (const splitTransaction of splitTransactions) {
      splitValue += splitTransaction.amount
    }
    return roundToTwoDecimals(Math.abs(transaction.amount) - splitValue)
  }, [transaction, splitTransactions, editTransaction])

  if (!transaction) {
    return <ProgressBar indeterminate />
  }

  const onSubmit = () => {
    mutate({
      splitTransactions: splitTransactions.map((t) => ({
        id: t.id,
        amount: transaction.amount < 0 ? -t.amount : t.amount,
        categoryId: t.categoryId
      }))
    })
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <Text variant="bodyMedium" style={{ padding: 20 }}>
          Splitting a transaction will create individual transactions that you can categorize and manage separately.
        </Text>

        <View style={{ paddingHorizontal: 20, paddingVertical: 12, backgroundColor: colors.elevation.level2 }}>
          <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>
            Original transaction
          </Text>
        </View>
        <TransactionItem transaction={transaction} />
        <View style={{ paddingHorizontal: 20, paddingVertical: 12, backgroundColor: colors.elevation.level2 }}>
          <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>
            Split transactions
          </Text>
        </View>
        {splitTransactions.map((splitTransaction) => (
          <SplitTransaction
            key={splitTransaction.id}
            transaction={splitTransaction}
            onPress={(transaction) => {
              if (editTransaction?.id === transaction.id) {
                setEditTransaction(null)
              } else {
                setEditTransaction(transaction)
              }
            }}
            onEdit={() => {
              setEditTransaction(null)
            }}
            isEditing={editTransaction?.id === splitTransaction.id}
          />
        ))}
        <Button
          icon={() => <Ionicons name="add-circle-outline" size={18} color={colors.primary} />}
          style={{ marginTop: 10 }}
          onPress={() =>
            navigation.navigate('SelectCategory', {
              categoryIds: [],
              eventName: 'onSplitCategorySelected',
              multiple: false
            })
          }
        >
          Add a split
        </Button>
      </ScrollView>
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <Text variant="bodySmall" style={{ fontWeight: 'bold', flex: 1, color: colors.outline }}>
            LEFT TO SPLIT
          </Text>
          <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>
            {formatDollarsSigned(leftToSplit, transaction.account.currencyCode)}
          </Text>
        </View>
        <Button
          mode="contained"
          style={{ marginTop: 10 }}
          onPress={onSubmit}
          disabled={
            isPending ||
            loadingDelete ||
            leftToSplit !== 0 ||
            splitTransactions.length <= 1 ||
            splitTransactions.some((t) => t.amount <= 0)
          }
          loading={isPending}
        >
          Split into {splitTransactions.length} transactions
        </Button>
      </View>
    </View>
  )
}
