import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Card, Divider, Text, useTheme } from 'react-native-paper'
import { DateRangeFilter } from 'shared-types'

import { useActionSheet } from '../../hooks/use-action-sheet.hook'
import { View } from '../common/View'
import { SpendingGraph } from '../stats/SpendingGraph'

export const DateSpendingWidget = () => {
  const showActionSheet = useActionSheet()
  const { colors } = useTheme()

  const [selectedDateRange, setSelectedDateRange] = useState(DateRangeFilter.OneMonth)

  return (
    <Card mode="elevated" theme={{ roundness: 5 }} style={{ marginBottom: 15, marginHorizontal: 10 }}>
      <Card.Content style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}>
        <View
          style={{
            marginHorizontal: 15,
            marginTop: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Text variant="titleLarge">Spending By Date</Text>
          <TouchableOpacity
            onPress={() =>
              showActionSheet([
                {
                  label: '1 week',
                  onSelected: () => setSelectedDateRange(DateRangeFilter.OneWeek)
                },
                {
                  label: '2 weeks',
                  onSelected: () => setSelectedDateRange(DateRangeFilter.TwoWeek)
                },
                {
                  label: '1 month',
                  onSelected: () => setSelectedDateRange(DateRangeFilter.OneMonth)
                },
                {
                  label: '3 months',
                  onSelected: () => setSelectedDateRange(DateRangeFilter.ThreeMonth)
                },
                {
                  label: '6 months',
                  onSelected: () => setSelectedDateRange(DateRangeFilter.SixMonth)
                },
                {
                  label: '1 year',
                  onSelected: () => setSelectedDateRange(DateRangeFilter.OneYear)
                }
              ])
            }
          >
            <Ionicons name="ellipsis-horizontal" size={24} color={colors.onSurface} />
          </TouchableOpacity>
        </View>

        <Divider style={{ marginTop: 15 }} />
        <SpendingGraph widthReduction={20} dateRangeFilter={selectedDateRange} />
      </Card.Content>
    </Card>
  )
}
