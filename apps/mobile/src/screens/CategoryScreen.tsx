import { Entypo, Ionicons } from '@expo/vector-icons'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, editCategory, getBudgets, getCategory, getTransactions } from 'frontend-api'
import { mapReportDateFilter } from 'frontend-utils'
import * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { ProgressBar, useTheme } from 'react-native-paper'
import { ReportDateFilter } from 'shared-types'

import { CategoryReport } from '../components/category/CategoryReport'
import { View } from '../components/common/View'
import { useActionSheet } from '../hooks/use-action-sheet.hook'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const CategoryScreen = ({ navigation, route }: RootStackScreenProps<'Category'>) => {
  const { categoryId, date, dateFilter: dateFilterParam } = route.params

  const showActionSheet = useActionSheet()
  const { colors } = useTheme()
  const queryClient = useQueryClient()

  const [dateFilter, setDateFilter] = useState(dateFilterParam)

  const { data: category } = useQuery({
    queryKey: [ApiQuery.Category, categoryId],
    queryFn: async () => {
      const res = await getCategory(categoryId)
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
    }
  })

  const { data: transactions = [], isFetching: fetchingTransactions } = useQuery({
    queryKey: [ApiQuery.CategoryTransactions, categoryId],
    queryFn: async () => {
      const res = await getTransactions({ categoryIds: [categoryId] })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    }
  })

  const { data: budgets = [] } = useQuery({
    queryKey: [ApiQuery.Budgets],
    queryFn: async () => {
      const res = await getBudgets()
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  const { mutate: editMutation } = useMutation({
    mutationFn: async () => {
      const res = await editCategory(categoryId, { mapToCategoryId: null })
      if (res.ok && res.parsedBody?.payload) {
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.Categories] })
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.Groups] })
        navigation.pop()
      }
    }
  })

  const categoryBudget = useMemo(() => budgets.find((b) => b.categoryId === categoryId), [budgets, categoryId])

  useEffect(() => {
    navigation.setOptions({
      title: category ? `${category.icon} ${category.name}` : 'Loading...',
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
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
          <TouchableOpacity
            onPress={() => {
              showActionSheet(
                category
                  ? [
                      {
                        label: 'Edit category',
                        onSelected: () => navigation.navigate('EditCategory', { categoryId: category.id })
                      },
                      category.mapToCategoryId
                        ? {
                            label: 'Enable category',
                            onSelected: () => editMutation()
                          }
                        : {
                            label: `${category.systemCategory ? 'Disable' : 'Delete'} category`,
                            onSelected: () =>
                              navigation.navigate('ReassignCategory', {
                                categoryId: category.id,
                                categoryIcon: category.icon,
                                categoryName: category.name
                              })
                          }
                    ]
                  : []
              )
            }}
          >
            <Ionicons name="ellipsis-horizontal" size={24} color={colors.onSurface} />
          </TouchableOpacity>
        </View>
      )
    })
  }, [category, colors.onSurface, editMutation, navigation, showActionSheet])

  if (!category) {
    return <ProgressBar indeterminate visible />
  }

  return (
    <View style={{ flex: 1 }}>
      <ProgressBar indeterminate visible={fetchingTransactions} />
      <CategoryReport
        transactions={transactions}
        date={date ? new Date(date) : null}
        budgetAmount={categoryBudget?.amount}
        type={category.group.type}
        dateFilter={dateFilter}
      />
    </View>
  )
}
