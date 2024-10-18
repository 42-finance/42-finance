import { AmountFilter, TransactionAmountType } from 'shared-types'

import { formatDollars } from '../invoice/invoice.utils'

export const mapAmount = (
  amountType: TransactionAmountType | null,
  amountFilterType: AmountFilter | null,
  amountValue: number | null,
  amountValue2: number | null,
  defaultValue: string = ''
) => {
  if (amountType == null || amountFilterType == null) {
    return defaultValue
  }

  const type = mapTransactionAmountType(amountType)
  const filter = mapAmountFilter(amountFilterType)

  if (amountFilterType === AmountFilter.Between) {
    return `${type} ${filter.toLowerCase()} ${formatDollars(amountValue)} and ${formatDollars(amountValue2)}`
  }

  return `${type} ${filter.toLowerCase()} ${formatDollars(amountValue)}`
}

export const mapAmountFilter = (amountFilter: AmountFilter) => {
  switch (amountFilter) {
    case AmountFilter.LessThan:
      return 'Less than'
    case AmountFilter.Equal:
      return 'Equal to'
    case AmountFilter.GreaterThan:
      return 'Greater than'
    case AmountFilter.Between:
      return 'Between'
  }
}

export const mapTransactionAmountType = (amountType: TransactionAmountType) => {
  switch (amountType) {
    case TransactionAmountType.Credit:
      return 'Credit'
    case TransactionAmountType.Debit:
      return 'Debit'
  }
}
