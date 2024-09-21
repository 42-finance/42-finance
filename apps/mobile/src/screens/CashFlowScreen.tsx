import { Entypo, Feather } from '@expo/vector-icons'
import { mapReportDateFilter } from 'frontend-utils'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import { useTheme } from 'react-native-paper'
import { ReportDateFilter, ReportGraphType } from 'shared-types'

import { View } from '../components/common/View'
import { CashFlowGraph } from '../components/stats/CashFlowGraph'
import { useActionSheet } from '../hooks/use-action-sheet.hook'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const CashFlowScreen = ({ navigation }: RootStackScreenProps<'CashFlow'>) => {
  const { colors } = useTheme()
  const showActionSheet = useActionSheet()

  const [dateFilter, setDateFilter] = useState(ReportDateFilter.Monthly)

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{ marginRight: 15 }}>
          <Feather name="settings" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            showActionSheet(
              Object.values(ReportDateFilter).map((d) => ({
                label: mapReportDateFilter(d),
                onSelected: () => setDateFilter(d)
              }))
            )
          }
        >
          <Entypo name="calendar" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      )
    })
  }, [colors.onSurface, navigation])

  return (
    <View>
      <ScrollView>
        <View style={{ marginTop: 20 }}>
          <CashFlowGraph
            onSelected={(date) => navigation.navigate('MonthlyReport', { date: date.toISOString(), dateFilter })}
            dateFilter={dateFilter}
            graphType={ReportGraphType.CashFlow}
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <CashFlowGraph
            onSelected={(date) => navigation.navigate('MonthlyReport', { date: date.toISOString(), dateFilter })}
            dateFilter={dateFilter}
            graphType={ReportGraphType.Income}
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <CashFlowGraph
            onSelected={(date) => navigation.navigate('MonthlyReport', { date: date.toISOString(), dateFilter })}
            dateFilter={dateFilter}
            graphType={ReportGraphType.Expense}
          />
        </View>
      </ScrollView>
    </View>
  )
}
