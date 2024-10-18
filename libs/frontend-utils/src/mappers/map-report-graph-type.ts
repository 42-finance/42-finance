import { Transaction } from 'frontend-types'
import { CategoryType, ReportGraphType } from 'shared-types'

export const mapGraphType = (graphType: ReportGraphType) => {
  switch (graphType) {
    case ReportGraphType.CashFlow:
      return 'Cash Flow'
    case ReportGraphType.Income:
      return 'Income'
    case ReportGraphType.Expense:
      return 'Expense'
  }
}

export const filterByGraphType = (transactions: Transaction[], graphType: ReportGraphType) => {
  switch (graphType) {
    case ReportGraphType.CashFlow:
      return transactions.filter((t) => t.category.group.type !== CategoryType.Transfer)
    case ReportGraphType.Income:
      return transactions.filter((t) => t.category.group.type === CategoryType.Income)
    case ReportGraphType.Expense:
      return transactions.filter((t) => t.category.group.type === CategoryType.Expense)
  }
}
