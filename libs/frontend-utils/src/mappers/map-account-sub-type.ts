import { AccountSubType } from 'shared-types'

export const mapAccountSubType = (accountSubType: AccountSubType) => {
  switch (accountSubType) {
    case AccountSubType._401a:
      return '401(a)'
    case AccountSubType._401k:
      return '401(k)'
    case AccountSubType._403B:
      return '403(b)'
    case AccountSubType._457b:
      return '457(b)'
    case AccountSubType._529:
      return '529'
    case AccountSubType.Brokerage:
      return 'Brokerage'
    case AccountSubType.CashIsa:
      return 'Cash ISA'
    case AccountSubType.CryptoExchange:
      return 'Cryptocurrency'
    case AccountSubType.EducationSavingsAccount:
      return 'Education Savings Account'
    case AccountSubType.Ebt:
      return 'EBT'
    case AccountSubType.FixedAnnuity:
      return 'Fixed Annuity'
    case AccountSubType.Gic:
      return 'GIC'
    case AccountSubType.HealthReimbursementArrangement:
      return 'Health Reimbursement Arrangement'
    case AccountSubType.Hsa:
      return 'HSA'
    case AccountSubType.Isa:
      return 'ISA'
    case AccountSubType.Ira:
      return 'IRA'
    case AccountSubType.Lif:
      return 'LIF'
    case AccountSubType.LifeInsurance:
      return 'Life Insurance'
    case AccountSubType.Lira:
      return 'LIRA'
    case AccountSubType.Lrif:
      return 'LRIF'
    case AccountSubType.Lrsp:
      return 'LRSP'
    case AccountSubType.NonCustodialWallet:
      return 'Non Custodial Wallet'
    case AccountSubType.NonTaxableBrokerageAccount:
      return 'Non Taxable Brokerage Account'
    case AccountSubType.Other:
      return 'Other'
    case AccountSubType.OtherInsurance:
      return 'Other Insurance'
    case AccountSubType.OtherAnnuity:
      return 'Other Annuity'
    case AccountSubType.Prif:
      return 'PRIF'
    case AccountSubType.Rdsp:
      return 'RDSP'
    case AccountSubType.Resp:
      return 'RESP'
    case AccountSubType.Rlif:
      return 'RLIF'
    case AccountSubType.Rrif:
      return 'RRIF'
    case AccountSubType.Pension:
      return 'Pension'
    case AccountSubType.ProfitSharingPlan:
      return 'Profit Sharing Plan'
    case AccountSubType.Retirement:
      return 'Retirement'
    case AccountSubType.Roth:
      return 'Roth'
    case AccountSubType.Roth401k:
      return 'Roth 401(k)'
    case AccountSubType.Rrsp:
      return 'RRSP'
    case AccountSubType.SepIra:
      return 'SEP IRA'
    case AccountSubType.SimpleIra:
      return 'Simple IRA'
    case AccountSubType.Sipp:
      return 'SIPP'
    case AccountSubType.StockPlan:
      return 'Stock Plan'
    case AccountSubType.ThriftSavingsPlan:
      return 'Thrift Savings Plan'
    case AccountSubType.Tfsa:
      return 'TFSA'
    case AccountSubType.Trust:
      return 'Trust'
    case AccountSubType.Ugma:
      return 'UGMA'
    case AccountSubType.Utma:
      return 'UTMA'
    case AccountSubType.VariableAnnuity:
      return 'Variable Annuity'
    case AccountSubType.CreditCard:
      return 'Credit Card'
    case AccountSubType.Paypal:
      return 'Paypal'
    case AccountSubType.CD:
      return 'Certificate of Deposit'
    case AccountSubType.Checking:
      return 'Checking'
    case AccountSubType.Savings:
      return 'Savings'
    case AccountSubType.MoneyMarket:
      return 'Money Market'
    case AccountSubType.Prepaid:
      return 'Prepaid'
    case AccountSubType.Auto:
      return 'Auto Loan'
    case AccountSubType.Business:
      return 'Business Loan'
    case AccountSubType.Commercial:
      return 'Commercial Loan'
    case AccountSubType.Construction:
      return 'Construction Loan'
    case AccountSubType.Consumer:
      return 'Consumer Loan'
    case AccountSubType.HomeEquity:
      return 'Home Equity Loan'
    case AccountSubType.Loan:
      return 'Loan'
    case AccountSubType.Mortgage:
      return 'Mortgage'
    case AccountSubType.Overdraft:
      return 'Overdraft'
    case AccountSubType.LineOfCredit:
      return 'Line Of Credit'
    case AccountSubType.Student:
      return 'Student Loan'
    case AccountSubType.CashManagement:
      return 'Cash Management'
    case AccountSubType.Keogh:
      return 'Keogh'
    case AccountSubType.MutualFund:
      return 'Mutual Fund'
    case AccountSubType.Recurring:
      return 'Recurring'
    case AccountSubType.Rewards:
      return 'Rewards'
    case AccountSubType.SafeDeposit:
      return 'Safe Deposit'
    case AccountSubType.Sarsep:
      return 'SARSEP'
    case AccountSubType.Payroll:
      return 'Payroll'
    case AccountSubType.Vehicle:
      return 'Vehicle'
    case AccountSubType.Investment:
      return 'Investment'
    case AccountSubType.Cash:
      return 'Cash'
    case AccountSubType.Property:
      return 'Property'
  }
}
