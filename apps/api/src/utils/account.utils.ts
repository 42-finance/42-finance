import { Account, BalanceHistory, Transaction, dataSource, getExchangeRate } from 'database'
import { CurrencyCode } from 'shared-types'
import { EntityManager } from 'typeorm'

export const convertAccountCurrency = async (
  accountId: string,
  householdId: number,
  oldCurrencyCode: CurrencyCode,
  newCurrencyCode: CurrencyCode,
  entityManager: EntityManager = dataSource.manager
) => {
  const account = await entityManager
    .getRepository(Account)
    .createQueryBuilder('account')
    .where('account.id = :accountId', { accountId })
    .andWhere('account.householdId = :householdId', { householdId })
    .getOneOrFail()

  const balanceHistory = await entityManager
    .getRepository(BalanceHistory)
    .createQueryBuilder('balanceHistory')
    .where('balanceHistory.accountId = :accountId', { accountId })
    .andWhere('balanceHistory.householdId = :householdId', { householdId })
    .getMany()

  const transactions = await entityManager
    .getRepository(Transaction)
    .createQueryBuilder('transaction')
    .where('transaction.accountId = :accountId', { accountId })
    .andWhere('transaction.householdId = :householdId', { householdId })
    .getMany()

  const exchangeRate = await getExchangeRate(oldCurrencyCode, newCurrencyCode)

  await entityManager.getRepository(Account).update(accountId, {
    currentBalance: account.currentBalance * exchangeRate,
    availableBalance: account.availableBalance ? account.availableBalance * exchangeRate : undefined,
    limit: account.limit ? account.limit * exchangeRate : undefined
  })

  for (const history of balanceHistory) {
    await entityManager.getRepository(BalanceHistory).update(
      {
        date: history.date,
        accountId: history.accountId
      },
      {
        currentBalance: history.currentBalance * exchangeRate,
        availableBalance: history.availableBalance ? history.availableBalance * exchangeRate : undefined,
        limit: history.limit ? history.limit * exchangeRate : undefined
      }
    )
  }

  for (const transaction of transactions) {
    await entityManager.getRepository(Transaction).update(transaction.id, {
      amount: transaction.amount * exchangeRate
    })
  }
}
