import { formatDollars } from 'frontend-utils'
import _ from 'lodash'
import { useMemo } from 'react'
import { Dimensions } from 'react-native'
import { BarChart, barDataItem } from 'react-native-gifted-charts'
import { useTheme } from 'react-native-paper'

import { useUserTokenContext } from '../../contexts/user-token.context'
import { ActivityIndicator } from '../common/ActivityIndicator'

type Props = {
  data: barDataItem[]
  onSelected: (date: Date) => void
  loading: boolean
}

export const MonthlyBarChart: React.FC<Props> = ({ data, onSelected, loading }) => {
  const { colors } = useTheme()
  const { currencyCode } = useUserTokenContext()

  const formatYLabel = (value: string) => {
    const num = Number(value)
    if (num < 0) {
      if (num > -1000) {
        return `-${formatDollars(num, currencyCode, 0)}`
      }
      return `-${formatDollars(num / 1000, currencyCode, 0)}K`
    } else {
      if (num < 1000) {
        return `${formatDollars(num, currencyCode, 0)}`
      }
      return `${formatDollars(num / 1000, currencyCode, 0)}K`
    }
  }

  const maxValue = useMemo(() => _.maxBy(data, 'value')?.value ?? 0, [data])

  const minValue = useMemo(() => _.minBy(data, 'value')?.value ?? 0, [data])

  const maxAbsValue = useMemo(() => Math.max(Math.abs(maxValue), Math.abs(minValue)), [minValue, maxValue])

  const width = Dimensions.get('window').width

  if (loading && data.length === 0) {
    return <ActivityIndicator />
  }

  if (data.length === 0) {
    return null
  }

  return (
    <BarChart
      height={150}
      barBorderRadius={3}
      barWidth={40}
      data={data}
      xAxisLabelTextStyle={{
        color: colors.outline,
        fontWeight: 'bold'
      }}
      yAxisTextStyle={{
        color: colors.outline
      }}
      yAxisLabelWidth={40}
      onPress={({ date }) => onSelected(date)}
      noOfSections={3}
      xAxisColor="#FFFFFF00"
      yAxisColor="#FFFFFF00"
      hideRules
      formatYLabel={formatYLabel}
      autoShiftLabels
      stepValue={maxAbsValue === 0 ? undefined : maxAbsValue / 3}
      width={width - 45}
      scrollToEnd
    />
  )
}
