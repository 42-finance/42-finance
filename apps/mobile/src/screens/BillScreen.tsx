import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getBill } from 'frontend-api'
import { formatAccountName, formatDateInUtc, formatDollars } from 'frontend-utils'
import React, { useEffect } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { Divider, ProgressBar, Text, useTheme } from 'react-native-paper'

import { View } from '../components/common/View'
import { expenseColor, incomeColor } from '../constants/theme'
import { useUserTokenContext } from '../contexts/user-token.context'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const BillScreen: React.FC<RootStackScreenProps<'Bill'>> = ({ route, navigation }) => {
  const { billId } = route.params

  const { colors } = useTheme()
  const { currencyCode } = useUserTokenContext()

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

  useEffect(() => {
    navigation.setOptions({
      title: bill ? `${bill.account.name} - ${formatDateInUtc(bill.issueDate, 'MMM dd, yyyy')}` : 'Loading...'
    })
  }, [navigation, bill])

  const styles = StyleSheet.create({
    infoView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20
    }
  })

  if (!bill) {
    return <ProgressBar indeterminate />
  }

  return (
    <View style={{ flex: 1 }}>
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
