import { AccountType } from 'shared-types'

import { FinicityAccountType } from '../types/FinicityAccountType'

export const mapAccountType = (accountType: FinicityAccountType) => {
  switch (accountType) {
    case FinicityAccountType.Checking:
    case FinicityAccountType.Savings:
    case FinicityAccountType.CD:
    case FinicityAccountType.MoneyMarket:
    case FinicityAccountType.Investment:
    case FinicityAccountType.InvestmentTaxDeferred:
    case FinicityAccountType.EmployeeStockPurchasePlan:
    case FinicityAccountType.Ira:
    case FinicityAccountType._401k:
    case FinicityAccountType.Roth:
    case FinicityAccountType._403b:
    case FinicityAccountType._529plan:
    case FinicityAccountType.Rollover:
    case FinicityAccountType.Ugma:
    case FinicityAccountType.Utma:
    case FinicityAccountType.Keogh:
    case FinicityAccountType._457plan:
    case FinicityAccountType._401a:
    case FinicityAccountType.BrokerageAccount:
    case FinicityAccountType.EducationSavings:
    case FinicityAccountType.HealthSavingsAccount:
    case FinicityAccountType.Pension:
    case FinicityAccountType.ProfitSharingPlan:
    case FinicityAccountType.Roth401k:
    case FinicityAccountType.SepIRA:
    case FinicityAccountType.SimpleIRA:
    case FinicityAccountType.ThriftSavingsPlan:
    case FinicityAccountType.VariableAnnuity:
    case FinicityAccountType.Cryptocurrency:
      return AccountType.Asset
    case FinicityAccountType.CreditCard:
    case FinicityAccountType.LineOfCredit:
    case FinicityAccountType.Mortgage:
    case FinicityAccountType.Loan:
    case FinicityAccountType.StudentLoan:
    case FinicityAccountType.StudentLoanGroup:
    case FinicityAccountType.StudentLoanAccount:
      return AccountType.Liability
    default:
      return AccountType.Asset
  }
}
