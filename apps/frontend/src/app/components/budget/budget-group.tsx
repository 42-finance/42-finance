import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, EditBudgetRequest, editBudget } from 'frontend-api'
import { Budget, Category, Group, Transaction } from 'frontend-types'
import { formatDollars, formatDollarsSigned, lightColors } from 'frontend-utils'
import _ from 'lodash'
import { useCallback, useMemo, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa6'
import { IoEyeOutline } from 'react-icons/io5'
import { CategoryType } from 'shared-types'

import { BudgetCategory } from './budget-category'

type Props = {
  group: Group
  budgets: Budget[]
  transactions: Transaction[]
  editingCategoryId: number | null
  onCategoryPressed: (category: Category) => void
  onCategoryEdited: (category: Category) => void
}

export const BudgetGroup: React.FC<Props> = ({
  group,
  budgets,
  transactions,
  onCategoryPressed,
  onCategoryEdited,
  editingCategoryId
}) => {
  const queryClient = useQueryClient()

  const [collapsed, setCollapsed] = useState(false)
  const [showUnbudgeted, setShowUnbudgeted] = useState(false)

  const groupBudgets = useMemo(() => budgets.filter((b) => b.category.groupId === group.id), [budgets, group])

  const totalBudget = useMemo(() => _.sumBy(groupBudgets, 'amount'), [groupBudgets])

  const isIncome = useMemo(() => group.type === CategoryType.Income, [group])

  const groupTransactions = useMemo(
    () =>
      transactions
        .filter((t) => t.category.groupId === group.id)
        .map((t) => ({ ...t, convertedAmount: isIncome ? -t.convertedAmount : t.convertedAmount })),
    [transactions, group, isIncome]
  )

  const totalSpent = useMemo(() => _.sumBy(groupTransactions, 'convertedAmount'), [groupTransactions])

  const budgetedCategories = useMemo(
    () => group.categories.filter((c) => !c.hideFromBudget && groupBudgets.find((b) => b.categoryId === c.id)),
    [group, groupBudgets]
  )

  const unbudgetedCategories = useMemo(
    () => group.categories.filter((c) => !c.hideFromBudget && !groupBudgets.find((b) => b.categoryId === c.id)),
    [group, groupBudgets]
  )

  const unbudgetedTransactions = useMemo(
    () =>
      transactions
        .filter((t) => unbudgetedCategories.find((c) => c.id === t.categoryId))
        .map((t) => ({ ...t, convertedAmount: isIncome ? -t.convertedAmount : t.convertedAmount })),
    [transactions, unbudgetedCategories, isIncome]
  )

  const unbudgetedAmount = useMemo(() => _.sumBy(unbudgetedTransactions, 'convertedAmount'), [unbudgetedTransactions])

  const { mutate } = useMutation({
    mutationFn: async (request: EditBudgetRequest) => {
      const res = await editBudget(request)
      if (res.ok && res.parsedBody?.payload) {
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.Budgets] })
      }
    }
  })

  const onPress = useCallback(
    (category: Category) => {
      onCategoryPressed(category)
    },
    [onCategoryPressed]
  )

  const onEdit = useCallback(
    (category: Category, amount: number) => {
      mutate({
        categoryId: category.id,
        amount
      })
      onCategoryEdited(category)
    },
    [mutate, onCategoryEdited]
  )

  return (
    <div className="border-b">
      <div className="flex px-4 py-5 mt-5 items-center border-t">
        <div
          className={`cursor-pointer ${collapsed ? 'mt-[2px]' : 'mb-[2px]'}`}
          onClick={() => setCollapsed((collapsed) => !collapsed)}
        >
          <FaChevronDown className={collapsed ? 'rotate-180' : ''} size={16} color={lightColors.onSurface} />
        </div>
        <div className="" style={{ flex: 1, marginLeft: 8 }}>
          {group.name}
        </div>
        <div className="" style={{ width: 90, textAlign: 'right' }}>
          {formatDollars(totalBudget, 0)}
        </div>
        <div className="" style={{ width: 90, textAlign: 'right' }}>
          {formatDollarsSigned(totalBudget - totalSpent, 0)}
        </div>
      </div>
      {!collapsed && (
        <>
          {budgetedCategories.map((category) => (
            <BudgetCategory
              key={category.id}
              group={group}
              category={category}
              budgets={budgets}
              transactions={transactions}
              onPress={onPress}
              onEdit={onEdit}
              isEditing={editingCategoryId === category.id}
            />
          ))}
          {showUnbudgeted && (
            <>
              {unbudgetedCategories.map((category) => (
                <BudgetCategory
                  key={category.id}
                  group={group}
                  category={category}
                  budgets={budgets}
                  transactions={transactions}
                  onPress={onPress}
                  onEdit={onEdit}
                  isEditing={editingCategoryId === category.id}
                />
              ))}
            </>
          )}
          {unbudgetedCategories.length > 0 && (
            <div
              className="flex items-center px-4 py-5 cursor-pointer border-t"
              onClick={() => setShowUnbudgeted(!showUnbudgeted)}
            >
              <IoEyeOutline size={20} color={lightColors.outline} style={{ marginLeft: 2 }} />
              <div className="" style={{ flex: 1, marginLeft: 10, color: lightColors.outline }}>
                {showUnbudgeted ? 'Hide' : 'Show'} {unbudgetedCategories.length} unbudgeted
              </div>
              <div className="">{formatDollarsSigned(0 - unbudgetedAmount, 0)}</div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
