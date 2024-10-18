import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { endOfDay, endOfMonth, startOfMonth, subMonths } from 'date-fns'
import { ApiQuery, getTransactions } from 'frontend-api'
import { getDailySpending } from 'frontend-utils/src/account/account.utils'
import { dateToUtc } from 'frontend-utils/src/date/date.utils'
import { formatDollars, formatDollarsSigned } from 'frontend-utils/src/invoice/invoice.utils'
import _ from 'lodash'
import { useMemo } from 'react'
import { Dimensions } from 'react-native'
import { LineChart } from 'react-native-gifted-charts'
import { Card, Divider, Text, useTheme } from 'react-native-paper'

import { useUserTokenContext } from '../../contexts/user-token.context'
import { useRefetchOnFocus } from '../../hooks/use-refetch-on-focus.hook'
import { View } from '../common/View'

export const MonthlySpendingWidget: React.FC = () => {
  const { colors } = useTheme()
  const { currencyCode } = useUserTokenContext()

  const today = new Date()
  const startOflastMonth = dateToUtc(startOfMonth(subMonths(today, 1)))
  const endOflastMonth = dateToUtc(endOfMonth(subMonths(today, 1)))
  const startOfThisMonth = dateToUtc(startOfMonth(today))

  const { data: transactions = [], refetch } = useQuery({
    queryKey: [ApiQuery.SpendingTransactions],
    queryFn: async () => {
      const res = await getTransactions({ startDate: startOflastMonth })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  useRefetchOnFocus(refetch)

  const lastMonthTransactions = useMemo(
    () => transactions.filter((t) => t.date.getUTCMonth() === startOflastMonth.getUTCMonth()),
    [transactions]
  )

  const thisMonthTransactions = useMemo(
    () => transactions.filter((t) => t.date.getUTCMonth() === startOfThisMonth.getUTCMonth()),
    [transactions]
  )

  const lastMonthSpending = useMemo(
    () => getDailySpending(lastMonthTransactions, startOflastMonth, endOflastMonth),
    [lastMonthTransactions]
  )

  const thisMonthSpending = useMemo(
    () => getDailySpending(thisMonthTransactions, startOfThisMonth, dateToUtc(endOfDay(today))),
    [thisMonthTransactions]
  )

  const lastMonthSpendingData = useMemo(() => {
    const data = lastMonthSpending.map((v) => Math.max(0, v))
    if (data.length === 1) {
      data.push(data[0])
    }
    return data.map((value) => ({ value }))
  }, [lastMonthSpending])

  const thisMonthSpendingData = useMemo(() => {
    const data = thisMonthSpending.map((v) => Math.max(0, v))
    if (data.length === 1) {
      data.push(data[0])
    }
    const lastValue = data.length > 0 ? data[data.length - 1] : null
    const lastValueText = formatDollars(lastValue, currencyCode)
    const lastValueTextLength = lastValueText.length

    return data.map((value, index) => ({
      value,
      dataPointText: index === data.length - 1 ? formatDollars(value, currencyCode) : undefined,
      hideDataPoint: index !== data.length - 1,
      textColor: colors.primary,
      textShiftY: -10,
      textShiftX: -4.5 * lastValueTextLength
    }))
  }, [thisMonthSpending])

  const maxValue = useMemo(
    () => Math.max(_.max(thisMonthSpending) ?? 0, _.max(lastMonthSpending) ?? 0),
    [thisMonthSpending, lastMonthSpending]
  )

  const spendingData = useMemo(() => {
    const data: any[] = []
    if (lastMonthSpendingData?.length > 0) {
      data.push({
        data: lastMonthSpendingData,
        color: '#555',
        hideDataPoints: true
      })
    }
    if (thisMonthSpendingData?.length > 0) {
      data.push({
        data: thisMonthSpendingData,
        color: colors.primary,
        dataPointsColor: colors.primary
      })
    }
    return data
  }, [lastMonthSpendingData, thisMonthSpendingData])

  const width = Dimensions.get('window').width

  const formatYLabel = (value: string) => {
    const num = Number(value)
    if (num < 1000) {
      return `${formatDollarsSigned(num, currencyCode, 0)}`
    }
    return `${formatDollarsSigned(num / 1000, currencyCode, 0)}K`
  }

  return (
    <Card mode="elevated" theme={{ roundness: 5 }} style={{ marginBottom: 15, marginHorizontal: 10 }}>
      <Card.Content style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}>
        <Text variant="titleLarge" style={{ marginLeft: 15, marginTop: 5 }}>
          Spending By Month
        </Text>
        <Divider style={{ marginVertical: 15 }} />
        <View style={{}}>
          <LineChart
            dataSet={spendingData}
            thickness={3}
            rulesColor={colors.outline}
            rulesThickness={1}
            adjustToWidth
            width={width - 90}
            yAxisTextStyle={{
              color: colors.outline
            }}
            xAxisColor="#FFFFFF00"
            yAxisColor="#FFFFFF00"
            formatYLabel={formatYLabel}
            hideOrigin
            yAxisLabelContainerStyle={{
              marginStart: 15,
              marginEnd: 5
            }}
            noOfSections={7}
            disableScroll
            maxValue={Math.max(maxValue + 1000, 1000)}
            endSpacing={0}
            curved
            curveType={1}
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 15 }}>
          <View style={{ backgroundColor: '#555', height: 2, width: 20, marginEnd: 8 }} />
          <Text variant="labelSmall" style={{ fontWeight: 'bold', color: colors.outline, fontSize: 10 }}>
            SPENDING LAST MONTH
          </Text>
          <View style={{ backgroundColor: colors.primary, height: 2, width: 20, marginStart: 20, marginEnd: 8 }} />
          <Text variant="labelSmall" style={{ fontWeight: 'bold', color: colors.outline, fontSize: 10 }}>
            SPENDING THIS MONTH
          </Text>
        </View>
      </Card.Content>
    </Card>
  )
}
