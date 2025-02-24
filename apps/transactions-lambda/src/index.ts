import { Account, Household, Rule, Transaction, dataSource } from 'database'
import { updateWalletTransactions } from 'database/src/utils/ethplorer.utils'
import { sendNewTransactionNotifications } from 'notifications'
import { WalletType } from 'shared-types'

export const handler = async () => {
  await dataSource.initialize()

  const households = await dataSource
    .getRepository(Household)
    .createQueryBuilder('household')
    .addOrderBy('household.updatedAt')
    .getMany()

  for (const household of households) {
    console.log(`Fetching crypto transactions for household ${household.id} - ${household.name}`)

    const rules = await dataSource
      .getRepository(Rule)
      .createQueryBuilder('rule')
      .where('rule.householdId = :householdId', { householdId: household.id })
      .getMany()

    const cryptoAccounts = await dataSource
      .getRepository(Account)
      .createQueryBuilder('account')
      .where('account.householdId = :householdId', { householdId: household.id })
      .andWhere('account.walletType = :walletType', { walletType: WalletType.Ethereum })
      .andWhere('account.walletAddress IS NOT NULL')
      .getMany()

    const allTransactions: Transaction[] = []

    for (const cryptoAccount of cryptoAccounts) {
      if (cryptoAccount.walletAddress && cryptoAccount.walletType) {
        const newTransactions = await updateWalletTransactions(cryptoAccount, rules, household.id)
        if (newTransactions.length > 0) {
          allTransactions.push(...newTransactions)
        }
        console.log(
          `Found ${newTransactions.length} new transactions for account ${cryptoAccount.name} for household ${household.id} - ${household.name}`
        )
      }
    }

    await sendNewTransactionNotifications(cryptoAccounts, allTransactions)
  }

  console.log(`Transactions lambda complete`)
}
