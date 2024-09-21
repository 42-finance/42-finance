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

  if (liabilities.mortgage) {
    for (const mortgage of liabilities.mortgage) {
      if (mortgage.account_id == null) {
        continue
      }

      if (mortgage.next_payment_due_date != null) {
        await dataSource
          .createQueryBuilder()
          .insert()
          .into(Bill)
          .values({
            balance: mortgage.next_monthly_payment,
            issueDate: mortgage.next_payment_due_date,
            dueDate: mortgage.next_payment_due_date,
            minimumPaymentAmount: null,
            isOverdue: false,
            accountId: mortgage.account_id,
            householdId: connection.householdId
          })
          .orIgnore()
          .execute()
      }

      if (mortgage.last_payment_amount != null && mortgage.last_payment_date != null) {
        await dataSource
          .createQueryBuilder()
          .insert()
          .into(BillPayment)
          .values({
            amount: mortgage.last_payment_amount,
            date: mortgage.last_payment_date,
            accountId: mortgage.account_id,
            householdId: connection.householdId
          })
          .orIgnore()
          .execute()
      }
    }
  }

  if (liabilities.student) {
    for (const student of liabilities.student) {
      if (student.account_id == null) {
        continue
      }

      if (student.next_payment_due_date != null) {
        await dataSource
          .createQueryBuilder()
          .insert()
          .into(Bill)
          .values({
            balance: student.minimum_payment_amount,
            issueDate: student.last_statement_issue_date ?? student.next_payment_due_date,
            dueDate: student.next_payment_due_date,
            minimumPaymentAmount: student.minimum_payment_amount,
            isOverdue: student.is_overdue,
            accountId: student.account_id,
            householdId: connection.householdId
          })
          .orIgnore()
          .execute()
      }

      if (student.last_payment_amount != null && student.last_payment_date != null) {
        await dataSource
          .createQueryBuilder()
          .insert()
          .into(BillPayment)
          .values({
            amount: student.last_payment_amount,
            date: student.last_payment_date,
            accountId: student.account_id,
            householdId: connection.householdId
          })
          .orIgnore()
          .execute()
      }
    }
  }
}
