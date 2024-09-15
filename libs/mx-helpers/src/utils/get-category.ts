import { getCategory as getSystemCategory } from 'database'
import { TransactionResponse } from 'mx-platform-node'
import { SystemCategory } from 'shared-types'

import { MxCategory } from '../types/mx-category'
import { mapCategory } from './map-category'

export const getCategory = async (transaction: TransactionResponse, householdId: number) => {
  let systemCategory: SystemCategory

  if (transaction.category) {
    systemCategory = mapCategory(transaction.category as MxCategory)
  } else {
    systemCategory = transaction.type === 'CREDIT' ? SystemCategory.OtherIncome : SystemCategory.Miscellaneous
  }

  return getSystemCategory(systemCategory, householdId)
}
