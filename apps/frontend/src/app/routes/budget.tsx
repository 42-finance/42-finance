import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { endOfMonth, startOfMonth } from 'date-fns'
import { ApiQuery, getBudgets, getGroups, getTransactions } from 'frontend-api'
import { Category } from 'frontend-types'
import { dateToUtc, mapCategoryType } from 'frontend-utils'
import React, { useMemo, useState } from 'react'
import { CategoryType } from 'shared-types'

import { BudgetGroup } from '../components/budget/budget-group'
import { BudgetProgress } from '../components/budget/budget-progress'
import { Card } from '../components/common/card/card'

export const Budget: React.FC = () => {
  const [editCategory, setEditCategory] = useState<Category | null>(null)

  const { data: groups = [], isFetching: fetching } = useQuery({
    queryKey: [ApiQuery.Groups],
    queryFn: async () => {
      const res = await getGroups()
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  const { data: budgets = [], isFetching: fetchingBudgets } = useQuery({
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

  const { data: transactions = [], isFetching: fetchingTransactions } = useQuery({
    queryKey: [ApiQuery.BudgetTransactions],
    queryFn: async () => {
      const startDate = dateToUtc(startOfMonth(new Date()))
      const endDate = dateToUtc(endOfMonth(new Date()))
      const res = await getTransactions({ startDate, endDate, hideFromBudget: false })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  const incomeGroups = useMemo(() => groups.filter((g) => g.type === CategoryType.Income), [groups])

  const expenseGroups = useMemo(() => groups.filter((g) => g.type === CategoryType.Expense), [groups])

  const budgetGroups = useMemo(
    () => [
      { type: CategoryType.Income, groups: incomeGroups },
      { type: CategoryType.Expense, groups: expenseGroups }
    ],
    [incomeGroups, expenseGroups]
  )

  const renderHeader = (title: string) => {
    return (
      <div className="flex items-center mt-10 px-4">
        <div className="text-lg grow">{title}</div>
        <div className="text-outline" style={{ width: 90, textAlign: 'right' }}>
          Budget
        </div>
        <div className="text-outline" style={{ width: 90, textAlign: 'right' }}>
          Remaining
        </div>
      </div>
    )
  }

  return (
    <div className="md:p-4">
      <Card title="Budget">
        <div className="">
          <BudgetProgress type={CategoryType.Income} />
          <div className="border-t" />
          <BudgetProgress type={CategoryType.Expense} />
          <div className="border-t" />
          {budgetGroups.map(({ type, groups }) => (
            <div key={type}>
              {renderHeader(mapCategoryType(type))}
              {groups.map((group) => (
                <BudgetGroup
                  key={group.id}
                  group={group}
                  budgets={budgets}
                  transactions={transactions}
                  onCategoryPressed={(category) => {
                    if (editCategory?.id === category.id) {
                      setEditCategory(null)
                    } else {
                      setEditCategory(category)
                    }
                  }}
                  onCategoryEdited={() => {
                    setEditCategory(null)
                  }}
                  editingCategoryId={editCategory?.id ?? null}
                />
              ))}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
