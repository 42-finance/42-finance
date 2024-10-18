import { startOfMonth } from 'date-fns'
import { Transaction } from 'frontend-types'
import {
  calculateBudgetProgress,
  dateToLocal,
  dateToUtc,
  formatDateInUtc,
  formatDollars,
  formatDollarsSigned,
  groupTransactionsByMonth,
  lightColors,
  mapCategoryTypeToColor
} from 'frontend-utils'
import _ from 'lodash'
import { useMemo, useState } from 'react'
import { CategoryType } from 'shared-types'

import { Card } from '../common/card/card'
import { ProgressBar } from '../common/progress-bar/progress-bar'
import { Statistic } from '../common/statistic'
import { MonthlyBarChart } from '../reports/monthly-bar-chart'
import { TransactionItem } from '../transaction/transaction-item'

type Props = {
  transactions: Transaction[]
  date: Date | null
  budgetAmount?: number
  type: CategoryType
}

export const CategoryReport: React.FC<Props> = ({ transactions, date, budgetAmount, type }) => {
  const [selectedDate, setSelectedDate] = useState(date ? dateToUtc(startOfMonth(dateToLocal(date))) : null)

  const filteredTransactions = useMemo(
    () => transactions.filter((t) => !selectedDate || t.date.getUTCMonth() === selectedDate.getUTCMonth()),
    [transactions, selectedDate]
  )

  const totalValue = useMemo(
    () =>
      filteredTransactions.length === 0
        ? 0
        : _.sumBy(
            filteredTransactions.map((t) => ({
              ...t,
              convertedAmount: type === CategoryType.Income ? -t.convertedAmount : t.convertedAmount
            })),
            'convertedAmount'
          ),
    [filteredTransactions, type]
  )

  const averageTransaction = useMemo(
    () =>
      filteredTransactions.length === 0
        ? 0
        : _.meanBy(
            filteredTransactions.map((t) => ({
              ...t,
              convertedAmount: type === CategoryType.Income ? -t.convertedAmount : t.convertedAmount
            })),
            'convertedAmount'
          ),
    [filteredTransactions, type]
  )

  const monthTransactions = useMemo(() => groupTransactionsByMonth(transactions), [transactions])

  const monthlyData = useMemo(
    () =>
      monthTransactions.map(({ key, transactions }) => ({
        value: Math.abs(_.sumBy(transactions, 'convertedAmount')),
        color:
          key.getTime() === selectedDate?.getTime()
            ? lightColors.outline
            : mapCategoryTypeToColor(type ?? CategoryType.Income),
        label: formatDateInUtc(key, 'MMM').toUpperCase(),
        date: key
      })),
    [monthTransactions, type, selectedDate, lightColors.outline]
  )

  const transactionGroups = useMemo(
    () =>
      _.chain(filteredTransactions)
        .groupBy('date')
        .map((value, key) => ({ title: key, data: value }))
        .value(),
    [filteredTransactions]
  )

  return (
    <div style={{ marginTop: 5 }}>
      <div style={{ alignSelf: 'center', marginTop: 20 }}>
        <MonthlyBarChart
          data={monthlyData}
          onSelected={(date) => setSelectedDate((oldDate) => (oldDate?.getTime() === date.getTime() ? null : date))}
          isLoading={false}
        />
      </div>
      <div className="px-4 py-6 mt-4 border-y bg-background md:bg-transparent">
        <div className="text-base">{selectedDate ? formatDateInUtc(selectedDate, 'MMMM yyyy') : 'Last 6 months'}</div>
      </div>
      {budgetAmount != null && (
        <div className="px-4 py-5" style={{ backgroundColor: lightColors.elevation.level2 }}>
          <div className="flex mb-2">
            <div className="text-base" style={{ flex: 1 }}>
              Remaining budget
            </div>
            <div className="text-base">{formatDollarsSigned(budgetAmount - totalValue)}</div>
          </div>
          <ProgressBar
            percentage={calculateBudgetProgress(totalValue, budgetAmount)}
            barColor={mapCategoryTypeToColor(type)}
            trackColor="bg-outline"
          />
          <div className="mt-2" style={{ color: lightColors.outline }}>
            {formatDollars(budgetAmount, 0)} budget
          </div>
        </div>
      )}
      <div className="grid md:gap-3 md:m-3 md:grid-cols-3">
        <Card className="p-4 flex justify-center">
          <Statistic title="Total amount" value={formatDollarsSigned(totalValue)} className="border-b" />
        </Card>
        <Card className="p-4 flex justify-center">
          <Statistic title="Average transaction" value={formatDollarsSigned(averageTransaction)} className="border-b" />
        </Card>
        <Card className="p-4 flex justify-center">
          <Statistic title="Transactions" value={filteredTransactions.length} className="border-b" />
        </Card>
      </div>
      <Card title="Transactions" className="m-3">
        {transactionGroups.map((transactionGroup) => (
          <div key={transactionGroup.title}>
            {transactionGroup.data.map((transaction) => (
              <div key={transaction.id}>
                <div className="border-t first:border-0" />
                <TransactionItem transaction={transaction} onSelected={() => {}} />
              </div>
            ))}
          </div>
        ))}
      </Card>
    </div>
  )
}
