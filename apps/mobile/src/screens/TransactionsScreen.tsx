import { Feather, FontAwesome6, Ionicons } from '@expo/vector-icons'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { endOfDay, startOfDay } from 'date-fns'
import { ApiQuery, exportTransactions, getTransactions, getTransactionsStats } from 'frontend-api'
import { dateToUtc, formatDollars, setMessage } from 'frontend-utils'
import { useTransactionsFilterContext } from 'frontend-utils/src/contexts/transactions-filter.context'
import { useDebounce } from 'frontend-utils/src/hooks/use-debounce.hook'
import _ from 'lodash'
import * as React from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Avatar, Button, Divider, ProgressBar, Searchbar, Text, useTheme } from 'react-native-paper'

import { Transaction } from '../../../../libs/frontend-types/src/transaction.type'
import { ActivityIndicator } from '../components/common/ActivityIndicator'
import { BottomActionView } from '../components/common/BottomActionView'
import { View } from '../components/common/View'
import { TransactionsList } from '../components/list/TransactionsList'
import { incomeColor } from '../constants/theme'
import { useUserTokenContext } from '../contexts/user-token.context'
import { useActionSheet } from '../hooks/use-action-sheet.hook'
import { useRefetchOnFocus } from '../hooks/use-refetch-on-focus.hook'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const TransactionsScreen = ({ navigation }: RootStackScreenProps<'Transactions'>) => {
  const showActionSheet = useActionSheet()
  const { colors } = useTheme()
  const { currencyCode } = useUserTokenContext()
  const {
    amountType,
    amountFilter,
    amountValue,
    amountValue2,
    accounts,
    startDate,
    endDate,
    categories,
    merchants,
    hidden,
    needsReview,
    tags
  } = useTransactionsFilterContext()

  const [limit, setLimit] = useState<number>(25)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isSelecting, setIsSelecting] = useState<boolean>(false)
  const [search, setSearch] = useState('')
  const [searchParam, setSearchParam] = useDebounce('', 500)

  const isSelectingRef = useRef(false)

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{ marginRight: 15 }}>
          <Feather name="settings" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      )
    })
  }, [colors.onSurface, navigation])

  const { mutate: exportMutation, isPending: isLoadingExport } = useMutation({
    mutationFn: async () => {
      const accountIds = accounts.length > 0 ? accounts.map((c) => c.id) : null
      const categoryIds = categories.length > 0 ? categories.map((c) => c.id) : null
      const merchantIds = merchants.length > 0 ? merchants.map((c) => c.id) : null
      const tagIds = tags.length > 0 ? tags.map((c) => c.id) : null
      const res = await exportTransactions({
        startDate,
        endDate,
        limit,
        search: searchParam,
        accountIds,
        categoryIds,
        merchantIds,
        hidden,
        needsReview,
        amountType,
        amountFilter,
        amountValue,
        amountValue2,
        tagIds
      })
      if (res.ok && res.parsedBody?.payload) {
        setMessage(res.parsedBody.payload)
      }
    }
  })

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        isSelecting ? (
          <Button
            mode="text"
            style={{ marginRight: -15 }}
            onPress={() => {
              setIsSelecting(false)
              setSelectedIds([])
            }}
            textColor={colors.onSurface}
          >
            CANCEL
          </Button>
        ) : isLoadingExport ? (
          <ActivityIndicator />
        ) : (
          <TouchableOpacity
            onPress={() => {
              showActionSheet([
                {
                  label: 'Add transaction',
                  onSelected: () => navigation.navigate('AddTransaction')
                },
                {
                  label: 'Edit multiple',
                  onSelected: () => setIsSelecting(true)
                },
                {
                  label: 'Export transactions',
                  onSelected: () => exportMutation()
                }
              ])
            }}
          >
            <Ionicons name="ellipsis-horizontal" size={24} color={colors.onSurface} />
          </TouchableOpacity>
        )
    })
  }, [colors, exportMutation, isLoadingExport, isSelecting, navigation, showActionSheet])

  const {
    data: transactions = [],
    isFetching: fetching,
    refetch
  } = useQuery({
    queryKey: [
      ApiQuery.Transactions,
      limit,
      searchParam,
      startDate,
      endDate,
      accounts,
      categories,
      merchants,
      hidden,
      needsReview,
      amountType,
      amountFilter,
      amountValue,
      amountValue2,
      tags
    ],
    queryFn: async () => {
      const accountIds = accounts.length > 0 ? accounts.map((c) => c.id) : null
      const categoryIds = categories.length > 0 ? categories.map((c) => c.id) : null
      const merchantIds = merchants.length > 0 ? merchants.map((c) => c.id) : null
      const tagIds = tags.length > 0 ? tags.map((c) => c.id) : null
      const res = await getTransactions({
        startDate: startDate ? dateToUtc(startOfDay(startDate)) : undefined,
        endDate: endDate ? dateToUtc(endOfDay(endDate)) : undefined,
        limit,
        search: searchParam,
        accountIds,
        categoryIds,
        merchantIds,
        hidden,
        needsReview,
        amountType,
        amountFilter,
        amountValue,
        amountValue2,
        tagIds
      })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  const filterCount = useMemo(() => {
    let count = 0
    if (amountFilter && amountValue) {
      count++
    }
    if (startDate) {
      count++
    }
    if (endDate) {
      count++
    }
    if (hidden != null) {
      count++
    }
    if (needsReview != null) {
      count++
    }
    count += accounts.length
    count += categories.length
    count += merchants.length
    count += tags.length
    return count
  }, [
    accounts.length,
    amountFilter,
    amountValue,
    categories.length,
    endDate,
    hidden,
    merchants.length,
    needsReview,
    startDate,
    tags
  ])

  const { data: transactionStats, refetch: refetchStats } = useQuery({
    queryKey: [
      ApiQuery.TransactionsStats,
      searchParam,
      startDate,
      endDate,
      accounts,
      categories,
      merchants,
      hidden,
      needsReview,
      amountType,
      amountFilter,
      amountValue,
      amountValue2,
      tags,
      filterCount
    ],
    queryFn: async () => {
      if (filterCount === 0 && _.isEmpty(searchParam)) {
        return null
      }
      const accountIds = accounts.length > 0 ? accounts.map((c) => c.id) : null
      const categoryIds = categories.length > 0 ? categories.map((c) => c.id) : null
      const merchantIds = merchants.length > 0 ? merchants.map((c) => c.id) : null
      const tagIds = tags.length > 0 ? tags.map((c) => c.id) : null
      const res = await getTransactionsStats({
        startDate: startDate ? dateToUtc(startOfDay(startDate)) : undefined,
        endDate: endDate ? dateToUtc(endOfDay(endDate)) : undefined,
        search: searchParam,
        accountIds,
        categoryIds,
        merchantIds,
        hidden,
        needsReview,
        amountType,
        amountFilter,
        amountValue,
        amountValue2,
        tagIds
      })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return null
    },
    placeholderData: keepPreviousData
  })

  useRefetchOnFocus(refetch)

  useRefetchOnFocus(refetchStats)

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent'
    }
  })

  useEffect(() => {
    isSelectingRef.current = isSelecting
  }, [isSelecting])

  const onSelected = useCallback(
    (transaction: Transaction) => {
      if (isSelectingRef.current) {
        setSelectedIds((ids) =>
          ids.includes(transaction.id) ? ids.filter((id) => id !== transaction.id) : [...ids, transaction.id]
        )
      } else {
        navigation.navigate('Transaction', { transactionId: transaction.id })
      }
    },
    [navigation]
  )

  const onEndReached = useCallback(() => {
    setLimit((limit) => limit + 25)
  }, [])

  return (
    <View style={styles.container}>
      <ProgressBar indeterminate visible={fetching} />
      <Searchbar
        placeholder="Search"
        onChangeText={(value) => {
          setSearch(value)
          setSearchParam(value)
        }}
        value={search}
        style={{ margin: 10, backgroundColor: colors.elevation.level2 }}
        traileringIcon={() => (
          <View style={{ position: 'relative' }}>
            <FontAwesome6 name="sliders" size={18} color={colors.onSurface} />
            {filterCount > 0 && (
              <Avatar.Text size={18} label={`${filterCount}`} style={{ position: 'absolute', top: -8, left: -8 }} />
            )}
          </View>
        )}
        onTraileringIconPress={() => {
          navigation.navigate('TransactionsFilter')
        }}
      />
      {(filterCount > 0 || !_.isEmpty(searchParam)) && transactionStats && (
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
              Total amount
            </Text>
            <Text
              variant="titleMedium"
              style={{ color: transactionStats.totalAmount < 0 ? incomeColor : colors.onSurface }}
            >
              {transactionStats.totalAmount < 0 ? '+' : ''}
              {formatDollars(transactionStats.totalAmount, currencyCode)}
            </Text>
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
            <Text
              variant="titleMedium"
              style={{ color: transactionStats.averageTransaction < 0 ? incomeColor : colors.onSurface }}
            >
              {transactionStats.averageTransaction < 0 ? '+' : ''}
              {formatDollars(transactionStats.averageTransaction, currencyCode)}
            </Text>
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
              Total transactions
            </Text>
            <Text variant="titleMedium">{transactionStats.totalTransactions}</Text>
          </View>
          <Divider style={{ marginBottom: 10 }} />
        </>
      )}
      <TransactionsList
        transactions={transactions}
        isSelecting={isSelecting}
        selectedIds={selectedIds}
        onSelected={onSelected}
        onEndReached={onEndReached}
      />
      {isSelecting ? (
        <BottomActionView
          applyText={`Edit ${selectedIds.length}`}
          onClear={() => {
            setSelectedIds([])
          }}
          onApply={() => {
            navigation.navigate('EditTransactions', {
              transactions: transactions
                .filter((t) => selectedIds.includes(t.id))
                .map(
                  (t) =>
                    ({
                      id: t.id,
                      account: { id: t.accountId, name: t.account.name, mask: t.account.mask }
                    }) as Transaction
                )
            })
            setIsSelecting(false)
            setSelectedIds([])
          }}
          disabled={selectedIds.length === 0}
        />
      ) : null}
    </View>
  )
}
