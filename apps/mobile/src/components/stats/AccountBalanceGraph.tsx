import { Feather } from '@expo/vector-icons'
import { useQuery } from '@tanstack/react-query'
import { ApiQuery, getBalanceHistory } from 'frontend-api'
import { mapDateRangeFilterFull, mapDateRangeToDate } from 'frontend-utils'
import { getMonthlyValueChange, getNetWorth, getNetWorthHistory } from 'frontend-utils/src/account/account.utils'
import { valueChangeColor, valueChangeIcon } from 'frontend-utils/src/color/color.utils'
import { formatDateInUtc, todayInUtc } from 'frontend-utils/src/date/date.utils'
import { formatDollars, formatPercentage } from 'frontend-utils/src/invoice/invoice.utils'
import { useMemo, useState } from 'react'
import { Dimensions } from 'react-native'
import { LineChart } from 'react-native-gifted-charts'
import { Text, useTheme } from 'react-native-paper'
import { AccountSubType, DateRangeFilter } from 'shared-types'

import { Account } from '../../../../../libs/frontend-types/src/account.type'
import { useUserTokenContext } from '../../contexts/user-token.context'
import { View } from '../common/View'

type Props = {
  account: Account
  dateRangeFilter?: DateRangeFilter
}

export const AccountBalanceGraph: React.FC<Props> = ({ account, dateRangeFilter = DateRangeFilter.AllTime }) => {
  const { dark, colors } = useTheme()
  const { currencyCode } = useUserTokenContext()

  const [today] = useState(todayInUtc())
  const [netWorthOverride, setNetWorthOverride] = useState<number | null>(null)
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null)

  const filterStartDate = useMemo(() => mapDateRangeToDate(dateRangeFilter), [dateRangeFilter])

  const { data: balanceHistory = [] } = useQuery({
    queryKey: [ApiQuery.AccountBalanceHistory, account.id],
    queryFn: async () => {
      const res = await getBalanceHistory({ accountIds: [account.id] })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    }
  })

  const accountTypes = useMemo(() => Object.values(AccountSubType), [])

  const convertBalance = useMemo(
    () => account.subType === AccountSubType.CryptoExchange || account.subType === AccountSubType.Vehicle,
    [account]
  )

  const netWorth = useMemo(
    () => getNetWorth([account], accountTypes, convertBalance, false),
    [account, accountTypes, convertBalance]
  )

  const netWorthHistory = useMemo(() => {
    const history = getNetWorthHistory(balanceHistory, accountTypes, convertBalance, false, filterStartDate)
    if (history.length === 0) {
      history.push({ date: today, value: netWorth })
    }
    if (history.length === 1) {
      history.push(history[0])
    }
    return history
  }, [balanceHistory, accountTypes, convertBalance, filterStartDate])

  const startDate = useMemo(() => netWorthHistory[0]?.date, [netWorthHistory])

  const netWorthChange = useMemo(
    () =>
      getMonthlyValueChange(balanceHistory, accountTypes, startDate, selectedEndDate ?? today, convertBalance, false),
    [balanceHistory, accountTypes, selectedEndDate, startDate, convertBalance]
  )

  const netWorthData = useMemo(
    () => netWorthHistory.map(({ value }) => ({ value: Math.abs(value) })),
    [netWorthHistory]
  )

  const width = Dimensions.get('window').width

  const color = dark ? '#FFF' : colors.primary

  return (
    <>
      <Text variant="headlineMedium" style={{ textAlign: 'center', marginLeft: 15, marginTop: 10 }}>
        {formatDollars(netWorthOverride ?? netWorth, account.currencyCode)}
        {account.currencyCode === currencyCode || convertBalance ? '' : ` ${account.currencyCode}`}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 5,
          marginBottom: 15
        }}
      >
        <Feather
          name={valueChangeIcon(netWorthChange.value)}
          size={20}
          color={valueChangeColor(netWorthChange.value, account.type)}
          style={{ marginTop: 1, marginRight: 2 }}
        />
        <Text
          variant="bodyMedium"
          style={{ color: valueChangeColor(netWorthChange.value, account.type) }}
          numberOfLines={1}
        >
          {formatDollars(netWorthChange.value, account.currencyCode)} ({formatPercentage(netWorthChange.percentage)})
        </Text>
        <Text variant="bodyMedium" style={{ marginLeft: 5, color: colors.outline }}>
          {selectedEndDate == null
            ? mapDateRangeFilterFull(dateRangeFilter)
            : `${formatDateInUtc(startDate, 'MMM d, yyyy')} - ${formatDateInUtc(selectedEndDate, 'MMM d, yyyy')}`}
        </Text>
      </View>
      <View style={{ marginLeft: -10 }}>
        <LineChart
          initialSpacing={0}
          data={netWorthData}
          hideDataPoints
          thickness={3}
          hideRules
          hideYAxisText
          hideAxesAndRules
          adjustToWidth
          width={width}
          color={color}
          startFillColor={color}
          endFillColor={color}
          startOpacity={0.5}
          endOpacity={0}
          areaChart
          pointerConfig={{
            radius: 10,
            pointerColor: color,
            pointerStripColor: color,
            pointerStripWidth: 3,
            pointerStripUptoDataPoint: true
          }}
          getPointerProps={({ pointerIndex }) => {
            if (pointerIndex === -1) {
              setNetWorthOverride(null)
              setSelectedEndDate(null)
            } else {
              setNetWorthOverride(netWorthData[pointerIndex].value)
              setSelectedEndDate(netWorthHistory[pointerIndex].date)
            }
          }}
          curved
          curveType={1}
        />
      </View>
    </>
  )
}
