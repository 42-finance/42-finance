import { AccountType as PlaidAccountType } from 'plaid'
import { AccountType } from 'shared-types'

export const mapPlaidAccountType = (accountType: PlaidAccountType) => {
  switch (accountType) {
    case PlaidAccountType.Credit:
    case PlaidAccountType.Loan:
      return AccountType.Liability
    case PlaidAccountType.Investment:
    case PlaidAccountType.Depository:
    case PlaidAccountType.Brokerage:
    case PlaidAccountType.Other:
      return AccountType.Asset
    default:
      return AccountType.Asset
  }
}
