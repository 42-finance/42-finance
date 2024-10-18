import { getCategory as getSystemCategory } from 'database'
import { SystemCategory } from 'shared-types'

import { FinicityTransaction } from '../types/FinicityTransaction'
import { mapCategory } from './map-category'

export const getCategory = async (transaction: FinicityTransaction, householdId: number) => {
  let systemCategory: SystemCategory

  if (transaction.categorization) {
    systemCategory = mapCategory(transaction.categorization.category)
  } else {
    systemCategory = transaction.amount < 0 ? SystemCategory.OtherIncome : SystemCategory.Miscellaneous
  }

  return getSystemCategory(systemCategory, householdId)
}
