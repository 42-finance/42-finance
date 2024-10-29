import { Feather, Ionicons } from '@expo/vector-icons'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, deleteAccount, getAccount, getBills, getTransactions, refreshAccount } from 'frontend-api'
import { formatDateDifference, setMessage } from 'frontend-utils'
import { mapAccountSubType } from 'frontend-utils/src/mappers/map-account-sub-type'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import { Button, Dialog, Divider, Portal, ProgressBar, Text, useTheme } from 'react-native-paper'
import { DateRangeFilter } from 'shared-types'

import { DateRangePicker } from '../components/common/DateRangePicker'
import { NoData } from '../components/common/NoData'
import { View } from '../components/common/View'
import { BillItem } from '../components/list-items/BillItem'
import { TransactionItem } from '../components/list-items/TransactionItem'
import { AccountBalanceGraph } from '../components/stats/AccountBalanceGraph'
import { useTransactionsFilterContext } from '../contexts/transactions-filter.context'
import { useActionSheet } from '../hooks/use-action-sheet.hook'
import { usePlaid } from '../hooks/use-plaid.hook'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const AccountScreen = ({ route, navigation }: RootStackScreenProps<'Account'>) => {
  const { accountId } = route.params

  const showActionSheet = useActionSheet()
  const { colors } = useTheme()
  const queryClient = useQueryClient()
  const { createLink, openLink, loading } = usePlaid()
  const { setAccounts, reset } = useTransactionsFilterContext()

  const [showPlaid, setShowPlaid] = useState(false)
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false)
  const [selectedDateRangeFilter, setSelectedDateRangeFilter] = useState<DateRangeFilter>(DateRangeFilter.OneMonth)

  const { data: account, isFetching: fetching } = useQuery({
    queryKey: [ApiQuery.Account, accountId],
    queryFn: async () => {
      const res = await getAccount(accountId)
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
    },
    placeholderData: keepPreviousData
  })

  const { data: transactions = [], isFetching: fetchingTransactions } = useQuery({
    queryKey: [ApiQuery.AccountTransactions, account],
    queryFn: async () => {
      const res = await getTransactions({ limit: 4, accountIds: [account!.id] })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    enabled: account != null,
    placeholderData: keepPreviousData
  })

  const { data: bill } = useQuery({
    queryKey: [ApiQuery.AccountBills, account],
    queryFn: async () => {
      const res = await getBills({ accountId: account!.id })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload[0] ?? null
      }
      return null
    },
    enabled: account != null,
    placeholderData: keepPreviousData
  })

  const { mutate: deleteMutation, isPending: loadingDelete } = useMutation({
    mutationFn: async () => {
      const res = await deleteAccount(accountId)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Accounts] })
        navigation.pop()
      }
    }
  })

  const { mutate: refreshMutation, isPending: loadingRefresh } = useMutation({
    mutationFn: async () => {
      const res = await refreshAccount(accountId)
      if (res.ok) {
        setMessage('Account has been refreshed')
      }
      queryClient.invalidateQueries({ queryKey: [ApiQuery.Accounts] })
      queryClient.invalidateQueries({ queryKey: [ApiQuery.Account] })
      queryClient.invalidateQueries({ queryKey: [ApiQuery.AccountTransactions] })
      queryClient.invalidateQueries({ queryKey: [ApiQuery.Transactions] })
      queryClient.invalidateQueries({ queryKey: [ApiQuery.ReviewTransactions] })
      queryClient.invalidateQueries({ queryKey: [ApiQuery.AccountBills] })
    }
  })

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            showActionSheet([
              ...(account?.connection
                ? [
                    {
                      label: 'Refresh account',
                      onSelected: () => refreshMutation()
                    }
                  ]
                : []),
              {
                label: 'Edit account',
                onSelected: () => navigation.navigate('EditAccount', { accountId })
              },
              {
                label: 'Edit balance history',
                onSelected: () => navigation.navigate('EditBalanceHistory', { accountId })
              },
              {
                label: 'Delete account',
                onSelected: () => setDeleteDialogVisible(true),
                isDestructive: true
              }
            ])
          }}
        >
          <Ionicons name="ellipsis-horizontal" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      ),
      title: account?.name ?? 'Loading...'
    })
  }, [account, accountId, colors, navigation, refreshMutation, showActionSheet])

  useEffect(() => {
    if (!showPlaid && account?.connection?.needsTokenRefresh) {
      createLink(account.connection.id)
    }
  }, [account, createLink, showPlaid])

  if (!account || loadingDelete) {
    return <ProgressBar indeterminate />
  }

  return (
    <View style={{ flex: 1 }}>
      <ProgressBar indeterminate visible={fetching || fetchingTransactions || loadingRefresh} />
      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>Delete Account</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this account? All transaction data will be removed.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button onPress={() => deleteMutation()}>Ok</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <ScrollView>
        {account.connection?.needsTokenRefresh && (
          <>
            <View style={{ flexDirection: 'row', padding: 15 }}>
              <Feather name="alert-triangle" size={26} color="#ee5a81" style={{ marginEnd: 10 }} />
              <View style={{ flex: 1 }}>
                <Text variant="bodyMedium" style={{ color: '#ee5a81', fontWeight: 'bold' }}>
                  {account.connection.institutionName} is no longer syncing due to outdated credentials. Update the
                  connection to resume syncing.
                </Text>
                <Button
                  mode="contained"
                  style={{ width: 100, marginTop: 10 }}
                  onPress={() => {
                    setShowPlaid(true)
                    openLink(
                      () => {
                        setShowPlaid(false)
                      },
                      () => {
                        queryClient.invalidateQueries({ queryKey: [ApiQuery.Accounts] })
                        queryClient.invalidateQueries({ queryKey: [ApiQuery.Account] })
                        queryClient.invalidateQueries({ queryKey: [ApiQuery.Transactions] })
                        setShowPlaid(false)
                      },
                      account.connection?.id
                    )
                  }}
                  loading={showPlaid || loading}
                  disabled={showPlaid || loading}
                >
                  Update
                </Button>
              </View>
            </View>
            <Divider />
          </>
        )}
        <AccountBalanceGraph account={account} dateRangeFilter={selectedDateRangeFilter} />
        <DateRangePicker
          selectedDateRangeFilter={selectedDateRangeFilter}
          onSelected={(type) => setSelectedDateRangeFilter(type)}
        />
        <View
          style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.elevation.level2, padding: 10 }}
        >
          <Text
            variant="titleMedium"
            style={{
              fontWeight: 'bold',
              flex: 1
            }}
          >
            Recent Transactions
          </Text>
          <Button
            mode="text"
            style={{}}
            onPress={() => {
              reset()
              setAccounts([account.id])
              navigation.navigate('TransactionsTab')
            }}
          >
            View all
          </Button>
        </View>
        <Divider />
        {transactions.length === 0 && (
          <View style={{ backgroundColor: colors.elevation.level2 }}>
            <NoData text="No transactions" />
          </View>
        )}
        {transactions.map((transaction) => (
          <View key={transaction.id}>
            <Divider />
            <View style={{ backgroundColor: colors.elevation.level2 }}>
              <TransactionItem
                transaction={transaction}
                showDate
                onSelected={() => navigation.navigate('Transaction', { transactionId: transaction.id })}
              />
            </View>
          </View>
        ))}
        {bill ? (
          <View style={{ marginVertical: 20 }}>
            <View>
              <Text
                variant="titleMedium"
                style={{
                  fontWeight: 'bold',
                  padding: 15,
                  backgroundColor: colors.elevation.level2
                }}
              >
                Upcoming Bill
              </Text>
            </View>
            <BillItem
              bill={bill}
              onSelected={() => navigation.navigate('Bill', { billId: bill.id })}
              backgroundColor={colors.elevation.level2}
            />
            <Divider />
          </View>
        ) : (
          <View style={{ marginBottom: 20 }} />
        )}
        <Divider />
        {account.connection && (
          <>
            <View style={{ flexDirection: 'row', padding: 15, backgroundColor: colors.elevation.level2 }}>
              <Text
                variant="titleMedium"
                style={{
                  flex: 1
                }}
              >
                Institution
              </Text>
              <Text variant="titleMedium">{account.connection.institutionName}</Text>
            </View>
            <Divider />
          </>
        )}
        <View style={{ flexDirection: 'row', padding: 15, backgroundColor: colors.elevation.level2 }}>
          <Text
            variant="titleMedium"
            style={{
              flex: 1
            }}
          >
            Account type
          </Text>
          <Text variant="titleMedium">{mapAccountSubType(account.subType)}</Text>
        </View>
        <Divider />
        <View style={{ flexDirection: 'row', padding: 15, backgroundColor: colors.elevation.level2 }}>
          <Text
            variant="titleMedium"
            style={{
              flex: 1
            }}
          >
            Currency
          </Text>
          <Text variant="titleMedium">{account.currencyCode}</Text>
        </View>
        <Divider />
        <View style={{ flexDirection: 'row', padding: 15, backgroundColor: colors.elevation.level2 }}>
          <Text
            variant="titleMedium"
            style={{
              flex: 1
            }}
          >
            Total transactions
          </Text>
          <Text variant="titleMedium">{account.transactionCount}</Text>
        </View>
        <Divider />
        <View style={{ flexDirection: 'row', padding: 15, backgroundColor: colors.elevation.level2, marginBottom: 20 }}>
          <Text
            variant="titleMedium"
            style={{
              flex: 1
            }}
          >
            Last update
          </Text>
          <Text variant="titleMedium">{formatDateDifference(account.updatedAt)}</Text>
        </View>
      </ScrollView>
    </View>
  )
}
