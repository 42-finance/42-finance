import { Ionicons } from '@expo/vector-icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { startOfDay, startOfMonth, subMonths } from 'date-fns'
import { ApiQuery, deleteRecurringTransaction, getRecurringTransaction } from 'frontend-api'
import {
  dateToUtc,
  formatDateInUtc,
  formatDollarsSigned,
  formatFrequency,
  formatRecurringTransaction,
  getNextRecurringDate,
  groupTransactionsByMonth,
  mapCategoryTypeToColor
} from 'frontend-utils'
import _ from 'lodash'
import * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import { Button, Dialog, Divider, Portal, ProgressBar, Text, useTheme } from 'react-native-paper'
import { CategoryType } from 'shared-types'

import { MonthlyBarChart } from '../components/charts/MonthlyBarChart'
import { View } from '../components/common/View'
import { TransactionItem } from '../components/list-items/TransactionItem'
import { useActionSheet } from '../hooks/use-action-sheet.hook'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const RecurringTransactionScreen = ({ navigation, route }: RootStackScreenProps<'RecurringTransaction'>) => {
  const { recurringTransactionId } = route.params

  const showActionSheet = useActionSheet()
  const { colors } = useTheme()
  const queryClient = useQueryClient()

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const { data: recurringTransaction, isFetching } = useQuery({
    queryKey: [ApiQuery.RecurringTransaction, recurringTransactionId],
    queryFn: async () => {
      const res = await getRecurringTransaction(recurringTransactionId)
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
    }
  })

  const { mutate: deleteMutation } = useMutation({
    mutationFn: async () => {
      const res = await deleteRecurringTransaction(recurringTransactionId)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.RecurringTransactions] })
        navigation.pop()
      }
    }
  })

  useEffect(() => {
    navigation.setOptions({
      title: recurringTransaction ? formatRecurringTransaction(recurringTransaction) : 'Loading...',
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            showActionSheet([
              {
                label: 'Edit recurring transaction',
                onSelected: () => {
                  navigation.navigate('EditRecurringTransaction', { recurringTransactionId })
                }
              },
              {
                label: 'Delete recurring transaction',
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
      )
    })
  }, [colors.onSurface, navigation, recurringTransaction, recurringTransactionId, showActionSheet])

  const lastSixMonthsDate = useMemo(() => dateToUtc(subMonths(startOfMonth(dateToUtc(startOfDay(new Date()))), 5)), [])

  const filteredTransactions = useMemo(
    () =>
      recurringTransaction?.transactions.filter((t) => {
        return !selectedDate
          ? t.date.getTime() >= lastSixMonthsDate.getTime()
          : t.date.getUTCMonth() === selectedDate.getUTCMonth() &&
              t.date.getUTCFullYear() === selectedDate.getUTCFullYear()
      }) ?? [],
    [recurringTransaction, selectedDate, lastSixMonthsDate]
  )

  const totalValue = useMemo(
    () =>
      recurringTransaction == null || filteredTransactions.length === 0
        ? 0
        : _.sumBy(
            filteredTransactions.map((t) => ({
              ...t,
              convertedAmount:
                recurringTransaction.type === CategoryType.Income ? -t.convertedAmount : t.convertedAmount
            })),
            'convertedAmount'
          ),
    [filteredTransactions, recurringTransaction]
  )

  const averageTransaction = useMemo(
    () =>
      recurringTransaction == null || filteredTransactions.length === 0
        ? 0
        : _.meanBy(
            filteredTransactions.map((t) => ({
              ...t,
              convertedAmount:
                recurringTransaction.type === CategoryType.Income ? -t.convertedAmount : t.convertedAmount
            })),
            'convertedAmount'
          ),
    [filteredTransactions, recurringTransaction]
  )

  const monthTransactions = useMemo(
    () =>
      groupTransactionsByMonth(
        recurringTransaction?.transactions.filter((t) => t.date.getTime() >= lastSixMonthsDate.getTime()) ?? []
      ),
    [lastSixMonthsDate, recurringTransaction]
  )

  const monthlyData = useMemo(
    () =>
      monthTransactions.map(({ key, transactions }) => ({
        value: Math.abs(_.sumBy(transactions, 'convertedAmount')),
        frontColor:
          key.getTime() === selectedDate?.getTime()
            ? colors.outline
            : mapCategoryTypeToColor(recurringTransaction?.type ?? CategoryType.Income),
        label: formatDateInUtc(key, 'MMM').toUpperCase(),
        date: key
      })),
    [colors.outline, monthTransactions, recurringTransaction, selectedDate]
  )

  const nextRecurringDate = useMemo(
    () =>
      recurringTransaction
        ? getNextRecurringDate(
            recurringTransaction.startDate,
            recurringTransaction.frequency,
            recurringTransaction.interval
          )
        : null,
    [recurringTransaction]
  )

  if (!recurringTransaction) {
    return <ProgressBar indeterminate visible />
  }

  return (
    <ScrollView style={{ marginTop: 5 }}>
      <View style={{ alignSelf: 'center', marginTop: 20, marginBottom: 20 }}>
        <MonthlyBarChart
          data={monthlyData}
          onSelected={(date) => setSelectedDate((oldDate) => (oldDate?.getTime() === date.getTime() ? null : date))}
          loading={isFetching}
        />
      </View>
      {nextRecurringDate && (
        <>
          <View
            style={{
              backgroundColor: colors.elevation.level2,
              paddingHorizontal: 15,
              paddingVertical: 15,
              flexDirection: 'row'
            }}
          >
            <Text variant="titleMedium" style={{ flex: 1 }}>
              Next Occurence
            </Text>
            <Text variant="titleMedium">{formatDateInUtc(nextRecurringDate, 'MMMM dd, yyyy')}</Text>
          </View>
          <Divider />
        </>
      )}
      <View
        style={{
          backgroundColor: colors.elevation.level2,
          paddingHorizontal: 15,
          paddingVertical: 15,
          flexDirection: 'row'
        }}
      >
        <Text variant="titleMedium" style={{ flex: 1 }}>
          Frequency
        </Text>
        <Text variant="titleMedium">
          {formatFrequency(
            recurringTransaction.startDate,
            recurringTransaction.frequency,
            recurringTransaction.interval
          )}
        </Text>
      </View>
      <Divider />
      <View
        style={{
          backgroundColor: colors.elevation.level2,
          paddingHorizontal: 15,
          paddingVertical: 15,
          marginTop: 15
        }}
      >
        <Text variant="titleMedium">{selectedDate ? formatDateInUtc(selectedDate, 'MMMM yyyy') : 'Last 6 months'}</Text>
      </View>
      <Divider />
      <View
        style={{
          backgroundColor: colors.elevation.level2,
          paddingHorizontal: 15,
          paddingVertical: 15,
          flexDirection: 'row'
        }}
      >
        <Text variant="titleMedium" style={{ flex: 1 }}>
          Total amount
        </Text>
        <Text variant="titleMedium">{formatDollarsSigned(totalValue)}</Text>
      </View>
      <Divider />
      <View
        style={{
          backgroundColor: colors.elevation.level2,
          paddingHorizontal: 15,
          paddingVertical: 15,
          flexDirection: 'row'
        }}
      >
        <Text variant="titleMedium" style={{ flex: 1 }}>
          Average transaction
        </Text>
        <Text variant="titleMedium">{formatDollarsSigned(averageTransaction)}</Text>
      </View>
      <Divider />
      <View
        style={{
          backgroundColor: colors.elevation.level2,
          paddingHorizontal: 15,
          paddingVertical: 15,
          flexDirection: 'row',
          marginBottom: 15
        }}
      >
        <Text variant="titleMedium" style={{ flex: 1 }}>
          Transactions
        </Text>
        <Text variant="titleMedium">{filteredTransactions.length}</Text>
      </View>
      {filteredTransactions.map((transaction) => (
        <View key={transaction.id} style={{ backgroundColor: colors.elevation.level2 }}>
          <Divider />
          <TransactionItem
            transaction={transaction}
            onSelected={() => {
              navigation.navigate('Transaction', { transactionId: transaction.id })
            }}
            showDate
          />
        </View>
      ))}
      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>Delete Transaction</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this recurring transaction?</Text>
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
