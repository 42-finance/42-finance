import { getCategory as getSystemCategory } from 'database'
import { Transaction as PlaidTransaction } from 'plaid'
import { SystemCategory } from 'shared-types'

import { PlaidCategory } from '../types/PlaidCategory'
import { mapCategory } from './mapCategory'

export const getCategory = async (transaction: PlaidTransaction, householdId: number) => {
  let systemCategory: SystemCategory

  if (transaction.personal_finance_category) {
    systemCategory = mapCategory(transaction.personal_finance_category.detailed as PlaidCategory)
  } else {
    systemCategory = transaction.amount < 0 ? SystemCategory.OtherIncome : SystemCategory.Miscellaneous
  }

  return getSystemCategory(systemCategory, householdId)
}
