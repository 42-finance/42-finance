import { CashFlowFilter } from 'shared-types'

export const mapCashFlowFilter = (cashFlowFilter: CashFlowFilter) => {
  switch (cashFlowFilter) {
    case CashFlowFilter.Category:
      return 'Category'
    case CashFlowFilter.Group:
      return 'Group'
    case CashFlowFilter.Merchant:
      return 'Merchant'
  }
}
