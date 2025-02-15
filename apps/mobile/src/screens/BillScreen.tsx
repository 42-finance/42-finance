import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, deleteBill, getBill } from 'frontend-api'
import { formatAccountName, formatDateInUtc, formatDollars } from 'frontend-utils'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { Button, Dialog, Divider, Portal, ProgressBar, Text, useTheme } from 'react-native-paper'

import { Ionicons } from '@expo/vector-icons'
import { View } from '../components/common/View'
import { expenseColor, incomeColor } from '../constants/theme'
import { useUserTokenContext } from '../contexts/user-token.context'
import { useActionSheet } from '../hooks/use-action-sheet.hook'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const BillScreen: React.FC<RootStackScreenProps<'Bill'>> = ({ route, navigation }) => {
  const { billId } = route.params

  const queryClient = useQueryClient()
  const showActionSheet = useActionSheet()
  const { colors } = useTheme()
  const { currencyCode } = useUserTokenContext()

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false)

  const { data: bill } = useQuery({
    queryKey: [ApiQuery.Bill, billId],
    queryFn: async () => {
      const res = await getBill(billId)
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return null
    },
    placeholderData: keepPreviousData
  })

  const { mutate: deleteMutation, isPending: loadingDelete } = useMutation({
    mutationFn: async () => {
      const res = await deleteBill(billId)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Bills] })
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
              {
                label: 'Edit bill',
                onSelected: () => navigation.navigate('EditBill', { billId })
              },
              {
                label: 'Delete bill',
                onSelected: () => setDeleteDialogVisible(true),
                isDestructive: true
              }
            ])
          }}
        >
          <Ionicons name="ellipsis-horizontal" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      ),
      title: bill ? `${formatDateInUtc(bill.issueDate, 'MMMM d, yyyy')}` : 'Loading...'
    })
  }, [navigation, bill, colors, showActionSheet])

  const styles = StyleSheet.create({
    infoView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20
    }
  })

  if (!bill || loadingDelete) {
    return <ProgressBar indeterminate />
  }

  return (
    <View style={{ flex: 1 }}>
      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>Delete Bill</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this bill?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button onPress={() => deleteMutation()}>Ok</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <ScrollView>
        <View>
          <Text
            variant="headlineLarge"
            style={{
              textAlign: 'center',
              marginVertical: 25,
              fontWeight: 'bold',
              color: bill.isPaid ? incomeColor : bill.isOverdue ? expenseColor : colors.onSurface
            }}
          >
            {formatDollars(bill.balance, currencyCode)}
            {bill.account.currencyCode === currencyCode ? '' : ` ${bill.account.currencyCode}`}
          </Text>
        </View>
        <Divider />
        <View style={styles.infoView}>
          <Text variant="bodyMedium" style={{ textAlign: 'center', marginVertical: 25, color: colors.outline }}>
            Status
          </Text>
          {bill.isPaid ? (
            <Text variant="bodyLarge" style={{ textAlign: 'center', marginVertical: 25, color: incomeColor }}>
              Paid
            </Text>
          ) : bill.isOverdue ? (
            <Text variant="bodyLarge" style={{ textAlign: 'center', marginVertical: 25, color: expenseColor }}>
              Overdue
            </Text>
          ) : (
            <Text variant="bodyLarge" style={{ textAlign: 'center', marginVertical: 25 }}>
              No Payment
            </Text>
          )}
        </View>
        <Divider />
        <TouchableOpacity
          style={styles.infoView}
          onPress={() =>
            navigation.navigate('Account', {
              accountId: bill.accountId
            })
          }
        >
          <Text variant="bodyMedium" style={{ textAlign: 'center', marginVertical: 25, color: colors.outline }}>
            Account
          </Text>
          <Text variant="bodyLarge" style={{ textAlign: 'center', marginVertical: 25 }}>
            {formatAccountName(bill.account)}
          </Text>
        </TouchableOpacity>
        <Divider />
        <View style={styles.infoView}>
          <Text variant="bodyMedium" style={{ textAlign: 'center', marginVertical: 25, color: colors.outline }}>
            Date
          </Text>
          <Text variant="bodyLarge" style={{ textAlign: 'center', marginVertical: 25 }}>
            {formatDateInUtc(bill.issueDate, 'MMMM d, yyyy')}
          </Text>
        </View>
        {bill.dueDate && (
          <>
            <Divider />
            <View style={styles.infoView}>
              <Text variant="bodyMedium" style={{ textAlign: 'center', marginVertical: 25, color: colors.outline }}>
                Due Date
              </Text>
              <Text variant="bodyLarge" style={{ textAlign: 'center', marginVertical: 25 }}>
                {formatDateInUtc(bill.dueDate, 'MMMM d, yyyy')}
              </Text>
            </View>
          </>
        )}
        {bill.minimumPaymentAmount != null && (
          <>
            <Divider />
            <View style={styles.infoView}>
              <Text variant="bodyMedium" style={{ textAlign: 'center', marginVertical: 25, color: colors.outline }}>
                Minimum Payment
              </Text>
              <Text variant="bodyLarge" style={{ textAlign: 'center', marginVertical: 25 }}>
                {formatDollars(bill.minimumPaymentAmount, currencyCode)}
                {bill.account.currencyCode === currencyCode ? '' : ` ${bill.account.currencyCode}`}
              </Text>
            </View>
          </>
        )}
        <Divider />
        <View style={styles.infoView}>
          <Text variant="bodyMedium" style={{ textAlign: 'center', marginVertical: 25, color: colors.outline }}>
            Payments
          </Text>
          <Text variant="bodyLarge" style={{ textAlign: 'center', marginVertical: 25 }}>
            {bill.billPayments.length}
          </Text>
        </View>
        <Divider />
        {bill.billPayments.map((payment) => (
          <View key={payment.id}>
            <View style={styles.infoView}>
              <Text variant="bodyMedium" style={{ textAlign: 'center', marginVertical: 25, color: colors.outline }}>
                {formatDateInUtc(payment.date, 'MMMM dd, yyyy')}
              </Text>
              <Text variant="bodyLarge" style={{ textAlign: 'center', marginVertical: 25 }}>
                {formatDollars(payment.amount, currencyCode)}
                {payment.account.currencyCode === currencyCode ? '' : ` ${payment.account.currencyCode}`}
              </Text>
            </View>
            <Divider />
          </View>
        ))}
      </ScrollView>
    </View>
  )
}
