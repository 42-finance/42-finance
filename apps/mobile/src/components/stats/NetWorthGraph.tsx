import { Feather } from '@expo/vector-icons'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getAccounts, getBalanceHistory } from 'frontend-api'
import { AccountGroup } from 'frontend-types'
import { mapDateRangeFilterFull, mapDateRangeToDate } from 'frontend-utils'
import { getMonthlyValueChange, getNetWorth, getNetWorthHistory } from 'frontend-utils/src/account/account.utils'
import { valueChangeColor, valueChangeIcon } from 'frontend-utils/src/color/color.utils'
import { formatDateInUtc, todayInUtc } from 'frontend-utils/src/date/date.utils'
import { formatDollars, formatDollarsSigned, formatPercentage } from 'frontend-utils/src/invoice/invoice.utils'
import { useMemo, useState } from 'react'
import { Dimensions } from 'react-native'
import { LineChart } from 'react-native-gifted-charts'
import { customText, useTheme } from 'react-native-paper'
import { AccountGroupType, AccountType, DateRangeFilter } from 'shared-types'

import { useUserTokenContext } from '../../contexts/user-token.context'
import { useRefetchOnFocus } from '../../hooks/use-refetch-on-focus.hook'
import { View } from '../common/View'

type Props = {
  accountGroup?: AccountGroup | null
  dateRangeFilter?: DateRangeFilter
  widthReduction?: number
  onlyVisibleAccounts?: boolean
}

export const NetWorthGraph: React.FC<Props> = ({
  accountGroup = null,
  dateRangeFilter = DateRangeFilter.AllTime,
  widthReduction = 0,
  onlyVisibleAccounts = false
}) => {
  const { dark, colors } = useTheme()
  const { currencyCode } = useUserTokenContext()

  const [today] = useState(todayInUtc())
  const [netWorthOverride, setNetWorthOverride] = useState<number | null>(null)
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null)

  const filterStartDate = useMemo(() => mapDateRangeToDate(dateRangeFilter), [dateRangeFilter])

  const { data: accounts = [], refetch } = useQuery({
    queryKey: [ApiQuery.NetWorthAccounts, onlyVisibleAccounts],
    queryFn: async () => {
      const res = await getAccounts(onlyVisibleAccounts ? { hideFromNetWorth: false } : {})
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  useRefetchOnFocus(refetch)

  const { data: balanceHistory = [], refetch: refetchBalanceHistory } = useQuery({
    queryKey: [ApiQuery.NetWorthBalanceHistory, onlyVisibleAccounts],
    queryFn: async () => {
      const res = await getBalanceHistory(onlyVisibleAccounts ? { hideFromNetWorth: false } : {})
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  useRefetchOnFocus(refetchBalanceHistory)

  const netWorth = useMemo(
    () => getNetWorth(accounts, accountGroup, true, accountGroup == null),
    [accounts, accountGroup]
  )

  const netWorthHistory = useMemo(() => {
    const history = getNetWorthHistory(balanceHistory, accountGroup, true, accountGroup == null, filterStartDate)
    if (history.length === 0) {
      history.push({ date: today, value: netWorth })
    }
    if (history.length === 1) {
      history.push(history[0])
    }
    return history
  }, [balanceHistory, accountGroup, filterStartDate])

  const startDate = useMemo(() => netWorthHistory[0].date, [netWorthHistory])

  const netWorthChange = useMemo(
    () =>
      getMonthlyValueChange(
        balanceHistory,
        accountGroup,
        dateRangeFilter === DateRangeFilter.AllTime ? startDate : filterStartDate,
        selectedEndDate ?? today,
        true,
        accountGroup == null
      ),
    [balanceHistory, filterStartDate, selectedEndDate, accountGroup]
  )

  const netWorthData = useMemo(
    () => netWorthHistory.map(({ value }) => ({ value: Math.abs(value) })),
    [netWorthHistory]
  )

  const netWorthValue = useMemo(() => netWorthOverride ?? netWorth, [netWorth, netWorthOverride])

  const type = useMemo(
    () =>
      accountGroup?.type === AccountGroupType.CreditCards || accountGroup?.type === AccountGroupType.Loans
        ? AccountType.Liability
        : AccountType.Asset,
    [accountGroup]
  )

  const width = Dimensions.get('window').width

  const color = dark ? '#FFF' : colors.primary

  const Text = customText<'headlineMediumBold'>()

  return (
    <>
      <Text variant="headlineMedium" style={{ textAlign: 'center', marginTop: 15 }}>
        {formatDollarsSigned(netWorthValue, currencyCode)}
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
          color={valueChangeColor(netWorthChange.value, type, colors.outline)}
          style={{ marginTop: 1, marginRight: 2 }}
        />
        <Text
          variant="bodyMedium"
          style={{
            color: valueChangeColor(netWorthChange.value, type, colors.outline)
          }}
          numberOfLines={1}
        >
          {formatDollars(netWorthChange.value, currencyCode)} ({formatPercentage(netWorthChange.percentage)})
        </Text>
        <Text variant="bodyMedium" style={{ marginLeft: 5, color: colors.outline }}>
          {selectedEndDate == null
            ? mapDateRangeFilterFull(dateRangeFilter)
            : `${formatDateInUtc(filterStartDate, 'MMM d, yyyy')} - ${formatDateInUtc(selectedEndDate, 'MMM d, yyyy')}`}
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
          width={width - widthReduction}
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
              setNetWorthOverride(netWorthHistory[pointerIndex].value)
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
