import { AccountGroupType, AccountSubType, AccountType } from 'shared-types'

export const mapAccountGroupType = (accountGroupType: AccountGroupType | null) => {
  switch (accountGroupType) {
    case null:
      return 'Net Worth'
    case AccountGroupType.Cash:
      return 'Cash'
    case AccountGroupType.CreditCards:
      return 'Credit Cards'
    case AccountGroupType.Investments:
      return 'Investments'
    case AccountGroupType.Loans:
      return 'Loans'
    case AccountGroupType.Other:
      return 'Other'
    case AccountGroupType.Vehicles:
      return 'Vehicles'
  }
}

export const mapAccountGroupTypeToAccountSubTypes = (accountGroupType: AccountGroupType | null) => {
  const allTypes = Object.values(AccountSubType)
  if (accountGroupType == null) {
    return allTypes
  }
  return allTypes.filter((s) => mapAccountSubTypeToAccountGroupType(s) === accountGroupType)
}

export const mapAccountSubTypeToAccountGroupType = (accountSubType: AccountSubType) => {
  switch (accountSubType) {
    case AccountSubType.Paypal:
    case AccountSubType.CD:
    case AccountSubType.Checking:
    case AccountSubType.Savings:
    case AccountSubType.MoneyMarket:
    case AccountSubType.Prepaid:
    case AccountSubType.Cash:
      return AccountGroupType.Cash

    case AccountSubType.CreditCard:
      return AccountGroupType.CreditCards

    case AccountSubType._401a:
    case AccountSubType._401k:
    case AccountSubType._403B:
    case AccountSubType._457b:
    case AccountSubType._529:
    case AccountSubType.Brokerage:
    case AccountSubType.CashIsa:
    case AccountSubType.CryptoExchange:
    case AccountSubType.EducationSavingsAccount:
    case AccountSubType.Ebt:
    case AccountSubType.FixedAnnuity:
    case AccountSubType.Gic:
    case AccountSubType.HealthReimbursementArrangement:
    case AccountSubType.Hsa:
    case AccountSubType.Isa:
    case AccountSubType.Ira:
    case AccountSubType.Lif:
    case AccountSubType.LifeInsurance:
    case AccountSubType.Lira:
    case AccountSubType.Lrif:
    case AccountSubType.Lrsp:
    case AccountSubType.NonCustodialWallet:
    case AccountSubType.NonTaxableBrokerageAccount:
    case AccountSubType.OtherInsurance:
    case AccountSubType.OtherAnnuity:
    case AccountSubType.Prif:
    case AccountSubType.Rdsp:
    case AccountSubType.Resp:
    case AccountSubType.Rlif:
    case AccountSubType.Rrif:
    case AccountSubType.Pension:
    case AccountSubType.ProfitSharingPlan:
    case AccountSubType.Retirement:
    case AccountSubType.Roth:
    case AccountSubType.Roth401k:
    case AccountSubType.Rrsp:
    case AccountSubType.SepIra:
    case AccountSubType.SimpleIra:
    case AccountSubType.Sipp:
    case AccountSubType.StockPlan:
    case AccountSubType.ThriftSavingsPlan:
    case AccountSubType.Tfsa:
    case AccountSubType.Trust:
    case AccountSubType.Ugma:
    case AccountSubType.Utma:
    case AccountSubType.VariableAnnuity:
    case AccountSubType.Investment:
    case AccountSubType.Property:
      return AccountGroupType.Investments

    case AccountSubType.Auto:
    case AccountSubType.Business:
    case AccountSubType.Commercial:
    case AccountSubType.Construction:
    case AccountSubType.Consumer:
    case AccountSubType.HomeEquity:
    case AccountSubType.Loan:
    case AccountSubType.Mortgage:
    case AccountSubType.Overdraft:
    case AccountSubType.LineOfCredit:
    case AccountSubType.Student:
    case AccountSubType.CashManagement:
    case AccountSubType.Keogh:
    case AccountSubType.MutualFund:
    case AccountSubType.Recurring:
    case AccountSubType.Rewards:
    case AccountSubType.SafeDeposit:
    case AccountSubType.Sarsep:
    case AccountSubType.Payroll:
      return AccountGroupType.Loans

    case AccountSubType.Other:
      return AccountGroupType.Other

    case AccountSubType.Vehicle:
      return AccountGroupType.Vehicles
  }
}

export const mapAccountTypeToAccountGroupTypes = (accountType: AccountType) => {
  switch (accountType) {
    case AccountType.Asset:
      return [AccountGroupType.Cash, AccountGroupType.Investments, AccountGroupType.Other, AccountGroupType.Vehicles]
    case AccountType.Liability:
      return [AccountGroupType.CreditCards, AccountGroupType.Loans]
  }
}

export const mapAccountTypeToAccountSubTypes = (accountType: AccountType) => {
  const subTypes: AccountSubType[] = []
  const groupTypes = mapAccountTypeToAccountGroupTypes(accountType)
  for (const groupType of groupTypes) {
    subTypes.push(...mapAccountGroupTypeToAccountSubTypes(groupType))
  }
  return subTypes
}
