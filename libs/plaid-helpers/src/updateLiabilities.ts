import { Bill, BillPayment, Connection, dataSource } from 'database'
import { LiabilitiesObject } from 'plaid'

import { plaidClient } from './createPlaidClient'

export const updateLiabilities = async (connectionId: string) => {
  const connection = await dataSource.getRepository(Connection).findOneOrFail({ where: { id: connectionId } })
  if (connection.accessToken == null) {
    return
  }

  let liabilities: LiabilitiesObject

  try {
    const response = await plaidClient.liabilitiesGet({
      access_token: connection.accessToken
    })
    liabilities = response.data.liabilities
  } catch (error: any) {
    console.error(`Error fetching liabilities: ${error.message}`)
    return
  }

  if (liabilities.credit) {
    for (const credit of liabilities.credit) {
      if (credit.account_id == null) {
        continue
      }

      if (credit.last_statement_issue_date != null) {
        await dataSource
          .createQueryBuilder()
          .insert()
          .into(Bill)
          .values({
            balance: credit.last_statement_balance,
            issueDate: credit.last_statement_issue_date,
            dueDate: credit.next_payment_due_date,
            minimumPaymentAmount: credit.minimum_payment_amount,
            isOverdue: credit.is_overdue,
            accountId: credit.account_id,
            householdId: connection.householdId
          })
          .orIgnore()
          .execute()
      }

      if (credit.last_payment_amount != null && credit.last_payment_date != null) {
        await dataSource
          .createQueryBuilder()
          .insert()
          .into(BillPayment)
          .values({
            amount: credit.last_payment_amount,
            date: credit.last_payment_date,
            accountId: credit.account_id,
            householdId: connection.householdId
          })
          .orIgnore()
          .execute()
      }
    }
  }
}
