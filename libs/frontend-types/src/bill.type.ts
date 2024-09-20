import { Account } from './account.type'
import { BillPayment } from './bill-payment.type'

export type Bill = {
  id: number
  balance: number | null
  issueDate: Date
  dueDate: Date | null
  minimumPaymentAmount: number | null
  isOverdue: boolean | null
  accountId: string
  account: Account
  convertedBalance: number
  isPaid: boolean
  billPayments: BillPayment[]
}
