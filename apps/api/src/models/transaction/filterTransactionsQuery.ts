import { Transaction } from 'database'
import { AmountFilter, NameFilter, TransactionAmountType } from 'shared-types'
import { SelectQueryBuilder } from 'typeorm'

import { TransactionQueryParams } from './transactionQueryParams'

export const filterTransactionsQuery = (
  queryBuilder: SelectQueryBuilder<Transaction>,
  query: TransactionQueryParams
) => {
  const {
    startDate,
    endDate,
    limit,
    search,
    categoryIds,
    merchantIds,
    groupIds,
    accountIds,
    hidden,
    needsReview,
    merchantValueFilter,
    merchantName,
    merchantOriginalStatement,
    amountType,
    amountFilter,
    amountValue,
    amountValue2,
    tagIds,
    hideFromBudget
  } = query

  if (startDate) {
    queryBuilder = queryBuilder.andWhere('transaction.date >= :startDate', { startDate })
  }

  if (endDate) {
    queryBuilder = queryBuilder.andWhere('transaction.date <= :endDate', { endDate })
  }

  if (search) {
    queryBuilder = queryBuilder.andWhere(`transaction.name ILIKE :search`, { search: `%${search}%` })
  }

  if (categoryIds) {
    queryBuilder = queryBuilder.andWhere('transaction.categoryId IN (:...categoryIds)', {
      categoryIds: categoryIds.split(',')
    })
  }

  if (merchantIds) {
    queryBuilder = queryBuilder.andWhere('transaction.merchantId IN (:...merchantIds)', {
      merchantIds: merchantIds.split(',')
    })
  }

  if (groupIds) {
    queryBuilder = queryBuilder.andWhere('category.groupId IN (:...groupIds)', {
      groupIds: groupIds.split(',')
    })
  }

  if (accountIds) {
    queryBuilder = queryBuilder.andWhere('transaction.accountId IN (:...accountIds)', {
      accountIds: accountIds.split(',')
    })
  }

  if (tagIds) {
    queryBuilder = queryBuilder.andWhere('tag.id IN (:...tagIds)', {
      tagIds: tagIds.split(',')
    })
  }

  if (amountType) {
    if (amountFilter === AmountFilter.Between && amountValue != null && amountValue2 != null) {
      queryBuilder = queryBuilder.andWhere('transaction.amount BETWEEN :amountValue AND :amountValue2', {
        amountValue: amountType === TransactionAmountType.Debit ? amountValue : -amountValue2,
        amountValue2: amountType === TransactionAmountType.Debit ? amountValue2 : -amountValue
      })
    } else if (amountFilter === AmountFilter.Equal && amountValue != null) {
      queryBuilder = queryBuilder.andWhere('transaction.amount = :amountValue', {
        amountValue: amountType === TransactionAmountType.Debit ? amountValue : -amountValue
      })
    } else if (amountFilter === AmountFilter.GreaterThan && amountValue != null) {
      queryBuilder = queryBuilder.andWhere(
        `transaction.amount ${amountType === TransactionAmountType.Debit ? '>=' : '<='} :amountValue`,
        {
          amountValue: amountType === TransactionAmountType.Debit ? amountValue : -amountValue
        }
      )
    } else if (amountFilter === AmountFilter.LessThan && amountValue != null) {
      queryBuilder = queryBuilder.andWhere(
        `transaction.amount ${amountType === TransactionAmountType.Debit ? '<=' : '>='} :amountValue`,
        {
          amountValue: amountType === TransactionAmountType.Debit ? amountValue : -amountValue
        }
      )
    }
  }

  if (merchantValueFilter && merchantName) {
    if (merchantValueFilter === NameFilter.Matches) {
      queryBuilder = queryBuilder.andWhere('LOWER(merchant.name) = :merchantName', {
        merchantName: merchantName.toLowerCase()
      })
    } else if (merchantValueFilter === NameFilter.Contains) {
      queryBuilder = queryBuilder.andWhere('LOWER(merchant.name) ILIKE :merchantName', {
        merchantName: `%${merchantName.toLowerCase()}%`
      })
    }
  } else if (merchantValueFilter && merchantOriginalStatement) {
    if (merchantValueFilter === NameFilter.Matches) {
      queryBuilder = queryBuilder.andWhere('LOWER(transaction.name) = :merchantOriginalStatement', {
        merchantOriginalStatement: merchantOriginalStatement.toLowerCase()
      })
    } else if (merchantValueFilter === NameFilter.Contains) {
      queryBuilder = queryBuilder.andWhere('LOWER(transaction.name) ILIKE :merchantOriginalStatement', {
        merchantOriginalStatement: `%${merchantOriginalStatement.toLowerCase()}%`
      })
    }
  }

  if (hidden == null) {
    queryBuilder = queryBuilder.andWhere('transaction.hidden = FALSE')
  } else {
    queryBuilder = queryBuilder.andWhere('transaction.hidden = :hidden', { hidden })
  }

  if (needsReview != null) {
    queryBuilder = queryBuilder.andWhere('transaction.needsReview = :needsReview', { needsReview })
  }

  if (hideFromBudget != null) {
    queryBuilder = queryBuilder.andWhere('account.hideFromBudget = :hideFromBudget', { hideFromBudget })
  }

  if (limit) {
    queryBuilder = queryBuilder.take(limit)
  }

  return queryBuilder
}
