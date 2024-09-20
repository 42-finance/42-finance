import { Feather } from '@expo/vector-icons'
import { useQuery } from '@tanstack/react-query'
import { ApiQuery, getBalanceHistory } from 'frontend-api'
import { Goal } from 'frontend-types'
import { calculateGoalProgress } from 'frontend-utils'
import { getMonthlyValueChange, getNetWorth, getNetWorthHistory } from 'frontend-utils/src/account/account.utils'
import { valueChangeColor, valueChangeIcon } from 'frontend-utils/src/color/color.utils'
import { formatDateInUtc, todayInUtc } from 'frontend-utils/src/date/date.utils'
import { formatDollars, formatPercentage } from 'frontend-utils/src/invoice/invoice.utils'
import { useMemo, useState } from 'react'
import { Dimensions } from 'react-native'
import { LineChart } from 'react-native-gifted-charts'
import { ProgressBar, Text, useTheme } from 'react-native-paper'
import { AccountSubType, AccountType, GoalType } from 'shared-types'

import { useUserTokenContext } from '../../contexts/user-token.context'
import { View } from '../common/View'

type Props = {
  goal: Goal
}

export const GoalGraph: React.FC<Props> = ({ goal }) => {
  const { dark, colors } = useTheme()
  const { currencyCode } = useUserTokenContext()

  const [today] = useState(todayInUtc())
  const [netWorthOverride, setNetWorthOverride] = useState<number | null>(null)
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null)

  const { data: balanceHistory = [] } = useQuery({
    queryKey: [ApiQuery.GoalBalanceHistory, goal],
    queryFn: async () => {
      const res = await getBalanceHistory({ accountIds: goal.accounts.map((a) => a.id) })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    }
  })

  const accountTypes = useMemo(() => Object.values(AccountSubType), [])

  const netWorth = useMemo(() => getNetWorth(goal.accounts, accountTypes, true, false), [goal, accountTypes])

  const netWorthHistory = useMemo(() => {
    const history = getNetWorthHistory(balanceHistory, accountTypes, true, false, null)
    if (history.length === 1) {
      history.push(history[0])
    }
    return history
  }, [balanceHistory, accountTypes])

  const startDate = useMemo(() => netWorthHistory[0]?.date, [netWorthHistory])

  const netWorthChange = useMemo(
    () => getMonthlyValueChange(balanceHistory, accountTypes, startDate, selectedEndDate ?? today, true, false),
    [balanceHistory, accountTypes, selectedEndDate, startDate]
  )

  const netWorthData = useMemo(
    () => netWorthHistory.map(({ value }) => ({ value: Math.abs(value) })),
    [netWorthHistory]
  )

  const width = Dimensions.get('window').width

  const color = dark ? '#FFF' : colors.primary

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 15
        }}
      >
        <Feather
          name={valueChangeIcon(netWorthChange.value)}
          size={20}
          color={valueChangeColor(
            netWorthChange.value,
            goal.type === GoalType.Savings ? AccountType.Asset : AccountType.Liability
          )}
          style={{}}
        />
        <Text
          variant="bodyMedium"
          style={{
            color: valueChangeColor(
              netWorthChange.value,
              goal.type === GoalType.Savings ? AccountType.Asset : AccountType.Liability
            )
          }}
          numberOfLines={1}
        >
          {formatDollars(netWorthChange.value, currencyCode)} ({formatPercentage(netWorthChange.percentage)})
        </Text>
        <Text variant="bodyMedium" style={{ marginLeft: 5, color: colors.outline }}>
          {selectedEndDate == null
            ? 'This Month'
            : `${formatDateInUtc(startDate, 'MMM d, yyyy')} - ${formatDateInUtc(selectedEndDate, 'MMM d, yyyy')}`}
        </Text>
      </View>
      <View style={{ flex: 1, padding: 15 }}>
        <ProgressBar
          progress={calculateGoalProgress(Math.abs(netWorthOverride ?? netWorth), goal.amount, goal.type)}
          style={{
            borderRadius: 50,
            backgroundColor: colors.outline,
            marginVertical: 10,
            height: 8
          }}
          color="#19d2a5"
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text variant="titleMedium">{formatDollars(netWorthOverride ?? netWorth, currencyCode)}</Text>
          <Text variant="titleMedium">
            {goal.type === GoalType.Savings ? formatDollars(goal.amount, currencyCode) : formatDollars(0, currencyCode)}
          </Text>
        </View>
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
