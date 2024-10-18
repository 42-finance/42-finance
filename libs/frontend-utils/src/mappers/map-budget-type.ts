import { BudgetType } from 'shared-types'

export const mapBudgetType = (budgetType: BudgetType) => {
  switch (budgetType) {
    case BudgetType.Category:
      return 'Category'
    case BudgetType.Group:
      return 'Group'
  }
}
