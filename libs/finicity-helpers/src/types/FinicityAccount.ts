import { CurrencyCode } from 'shared-types'

import { FinicityAccountType } from './FinicityAccountType'

export type FinicityAccount = {
  id: string
  number: string
  realAccountNumberLast4: string
  accountNumberDisplay: string
  name: string
  balance: number
  type: FinicityAccountType
  aggregationStatusCode: 0
  status: string
  customerId: string
  institutionId: string
  balanceDate: number
  aggregationSuccessDate: number
  aggregationAttemptDate: number
  createdDate: number
  lastUpdatedDate: number
  currency: CurrencyCode
  lastTransactionDate: number
  institutionLoginId: number
  detail: {
    marginBalance: number
    availableCashBalance: number
    currentBalance: number
    vestedBalance: number
    currentLoanBalance: number
  }
  displayPosition: number
  accountNickname: string
  oldestTransactionDate: number
  marketSegment: string
}
