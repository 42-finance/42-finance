import { CategoryType } from 'shared-types'

export const mapCategoryType = (categoryType: CategoryType) => {
  switch (categoryType) {
    case CategoryType.Expense:
      return 'Expense'
    case CategoryType.Income:
      return 'Income'
    case CategoryType.Transfer:
      return 'Transfer'
  }
}

export const mapCategoryTypeToColor = (categoryType: CategoryType) => {
  switch (categoryType) {
    case CategoryType.Income:
      return '#19d2a5'
    default:
      return '#f0648c'
  }
}
