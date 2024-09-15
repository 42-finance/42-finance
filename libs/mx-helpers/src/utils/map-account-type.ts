import { AccountType } from 'shared-types'

import { MxAccountType } from '../types/mx-account-type'

export const mapAccountType = (accountType: MxAccountType) => {
  switch (accountType) {
    case MxAccountType.Checking:
    case MxAccountType.Savings:
    case MxAccountType.Investment:
    case MxAccountType.Property:
    case MxAccountType.Cash:
    case MxAccountType.Insurance:
    case MxAccountType.Prepaid:
      return AccountType.Asset
    case MxAccountType.Loan:
    case MxAccountType.CreditCard:
    case MxAccountType.LineOfCredit:
    case MxAccountType.Mortgage:
    case MxAccountType.CheckingLineOfCredit:
      return AccountType.Liability
    default:
      return AccountType.Asset
  }
}
