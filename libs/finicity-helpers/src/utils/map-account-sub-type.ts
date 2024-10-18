import { AccountSubType } from 'shared-types'

import { FinicityAccountType } from '../types/FinicityAccountType'

export const mapAccountSubType = (accountType: FinicityAccountType | null) => {
  switch (accountType) {
    case FinicityAccountType.Checking:
      return AccountSubType.Checking
    case FinicityAccountType.Savings:
      return AccountSubType.Savings
    case FinicityAccountType.CD:
      return AccountSubType.CD
    case FinicityAccountType.MoneyMarket:
      return AccountSubType.MoneyMarket
    case FinicityAccountType.CreditCard:
      return AccountSubType.CreditCard
    case FinicityAccountType.LineOfCredit:
      return AccountSubType.LineOfCredit
    case FinicityAccountType.Investment:
      return AccountSubType.OtherAnnuity
    case FinicityAccountType.InvestmentTaxDeferred:
      return AccountSubType.OtherAnnuity
    case FinicityAccountType.EmployeeStockPurchasePlan:
      return AccountSubType.StockPlan
    case FinicityAccountType.Ira:
      return AccountSubType.Ira
    case FinicityAccountType._401k:
      return AccountSubType._401k
    case FinicityAccountType.Roth:
      return AccountSubType.Roth
    case FinicityAccountType._403b:
      return AccountSubType._403B
    case FinicityAccountType._529plan:
      return AccountSubType._529
    case FinicityAccountType.Rollover:
      return AccountSubType.Ira
    case FinicityAccountType.Ugma:
      return AccountSubType.Ugma
    case FinicityAccountType.Utma:
      return AccountSubType.Utma
    case FinicityAccountType.Keogh:
      return AccountSubType.Keogh
    case FinicityAccountType._457plan:
      return AccountSubType._457b
    case FinicityAccountType._401a:
      return AccountSubType._401a
    case FinicityAccountType.BrokerageAccount:
      return AccountSubType.Brokerage
    case FinicityAccountType.EducationSavings:
      return AccountSubType.EducationSavingsAccount
    case FinicityAccountType.HealthSavingsAccount:
      return AccountSubType.Hsa
    case FinicityAccountType.Pension:
      return AccountSubType.Pension
    case FinicityAccountType.ProfitSharingPlan:
      return AccountSubType.ProfitSharingPlan
    case FinicityAccountType.Roth401k:
      return AccountSubType.Roth401k
    case FinicityAccountType.SepIRA:
      return AccountSubType.SepIra
    case FinicityAccountType.SimpleIRA:
      return AccountSubType.SimpleIra
    case FinicityAccountType.ThriftSavingsPlan:
      return AccountSubType.ThriftSavingsPlan
    case FinicityAccountType.VariableAnnuity:
      return AccountSubType.VariableAnnuity
    case FinicityAccountType.Cryptocurrency:
      return AccountSubType.CryptoExchange
    case FinicityAccountType.Mortgage:
      return AccountSubType.Mortgage
    case FinicityAccountType.Loan:
      return AccountSubType.Loan
    case FinicityAccountType.StudentLoan:
      return AccountSubType.Student
    case FinicityAccountType.StudentLoanGroup:
      return AccountSubType.Student
    case FinicityAccountType.StudentLoanAccount:
      return AccountSubType.Student
    default:
      return AccountSubType.Other
  }
}
