import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { endOfMonth, startOfMonth } from 'date-fns'
import { ApiQuery, getBudgets, getTransactions } from 'frontend-api'
import {
  calculateBudgetProgress,
  dateToUtc,
  formatDollars,
  formatDollarsSigned,
  mapCategoryType,
  mapCategoryTypeToColor
} from 'frontend-utils'
import _ from 'lodash'
import { useMemo } from 'react'
import { CategoryType } from 'shared-types'

import { useUserTokenContext } from '../../contexts/user-token.context'
import { ProgressBar } from '../common/progress-bar/progress-bar'

type Props = {
  type: CategoryType
  backgroundColor?: string
}

export const BudgetProgress: React.FC<Props> = ({ type, backgroundColor }) => {
  const { currencyCode } = useUserTokenContext()

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

  const { data: transactions = [] } = useQuery({
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

  const typeBudgets = useMemo(() => budgets.filter((b) => b.category.group.type === type), [budgets, type])

  const totalBudget = useMemo(() => _.sumBy(typeBudgets, 'amount'), [typeBudgets])

  const typeTransactions = useMemo(
    () =>
      transactions
        .filter((t) => t.category.group.type === type)
        .map((t) => ({ ...t, convertedAmount: type === CategoryType.Income ? -t.convertedAmount : t.convertedAmount })),
    [transactions, type]
  )

  const total = useMemo(() => _.sumBy(typeTransactions, 'convertedAmount'), [typeTransactions])

  return (
    <div className="px-4 py-5" style={{ backgroundColor }}>
      <div className="text-lg mb-2">{mapCategoryType(type)}</div>
      <ProgressBar
        percentage={calculateBudgetProgress(total, totalBudget)}
        trackColor="bg-outline"
        barColor={mapCategoryTypeToColor(type)}
      />
      <div className="flex mt-2">
        <div className="text-lg" style={{ flex: 1 }}>
          {formatDollarsSigned(total, currencyCode, 0)}
        </div>
        <div className="text-lg">{formatDollars(totalBudget, currencyCode, 0)}</div>
      </div>
    </div>
  )
}
