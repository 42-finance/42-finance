import { Account, User, dataSource } from 'database'
import { format } from 'date-fns'
import { Request, Response } from 'express'
import { json2csv } from 'json-2-csv'
import { EmailType } from 'shared-types'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import { fetchTransactions } from '../../models/transaction/fetchTransactions'
import { TransactionQueryParams } from '../../models/transaction/transactionQueryParams'
import { sendEmail } from '../../services/email/emailService'
import { roundDollars } from '../../utils/number.utils'

export const exportTransactions = async (
  request: Request<object, object, object, TransactionQueryParams>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId, userId } = request

  const transactions = await fetchTransactions(householdId, request.query)

  const user = await dataSource
    .getRepository(User)
    .createQueryBuilder('user')
    .where('user.id = :userId', { userId })
    .getOneOrFail()

  const formatAccount = (account: Account) => {
    if (account.mask) {
      return `${account.name} (...${account.mask})`
    }
    return account.name
  }

  const mappedTransactions = transactions
    .filter((t) => t.account)
    .map((t) => ({
      Date: format(t.date, 'yyyy-MM-dd'),
      Merchant: t.merchant.name,
      Category: t.category.name,
      Account: formatAccount(t.account),
      'Original Statement': t.name,
      Amount: roundDollars(t.amount)
    }))

  const csv = json2csv(mappedTransactions)

  await sendEmail(
    user.email,
    'Transactions - Report',
    EmailType.Export,
    { name: user.name, report: 'Transactions' },
    [],
    {
      filename: `transactions_${format(new Date(), 'yyyy-MM-dd-HH-mm-ss')}.csv`,
      data: Buffer.from(csv),
      contentType: 'text/csv'
    }
  )

  return response.send({
    errors: [],
    payload: 'Check your email to download your report'
  })
}
