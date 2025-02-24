import {
  Account,
  BalanceHistory,
  Connection,
  Household,
  dataSource,
  getBitcoinBalance,
  getEthereumBalance
} from 'database'
import { startOfDay } from 'date-fns'
import { AccountBase } from 'plaid'
import { createOrUpdateAccounts, plaidClient, setConnectionNeedsRefresh } from 'plaid-helpers'
import { WalletType } from 'shared-types'

export const handler = async () => {
  await dataSource.initialize()

  const households = await dataSource
    .getRepository(Household)
    .createQueryBuilder('household')
    .addOrderBy('household.updatedAt')
    .getMany()

  for (const household of households) {
    console.log(`Fetching connections for household ${household.id} - ${household.name}`)

    const connections = await dataSource
      .getRepository(Connection)
      .createQueryBuilder('connection')
      .where('connection.householdId = :householdId', { householdId: household.id })
      .andWhere('connection.isValid = true')
      .getMany()

    for (const connection of connections) {
      console.log(`Fetching accounts balance for connection ${connection.id}`)

      if (connection.accessToken) {
        let accounts: AccountBase[] = []
        let needsTokenRefresh = false

        try {
          const { data } = await plaidClient.accountsGet({ access_token: connection.accessToken })
          accounts = data.accounts
        } catch (e) {
          console.log(`Failed to fetch accounts for connection ${connection.id}`, e)
          needsTokenRefresh = true
        }

        try {
          await createOrUpdateAccounts(connection, accounts)
        } catch (e) {
          console.log(`Failed to update accounts for connection ${connection.id}`, e)
        }

        if (needsTokenRefresh) {
          await setConnectionNeedsRefresh(connection.id)
        }
      }
    }

    const cryptoAccounts = await dataSource
      .getRepository(Account)
      .createQueryBuilder('account')
      .where('account.householdId = :householdId', { householdId: household.id })
      .andWhere('account.walletType IS NOT NULL')
      .andWhere('account.walletAddress IS NOT NULL')
      .getMany()

    for (const cryptoAccount of cryptoAccounts) {
      if (cryptoAccount.walletAddress && cryptoAccount.walletType) {
        console.log(`Fetching accounts balance for crypto account ${cryptoAccount.walletAddress}`)

        try {
          let currentBalance: number | null = null
          let walletTokenBalance: number | null = null

          if (cryptoAccount.walletType === WalletType.Bitcoin) {
            const result = await getBitcoinBalance(cryptoAccount.walletAddress, cryptoAccount.currencyCode)
            currentBalance = result.currentBalance
            walletTokenBalance = result.walletTokenBalance
          } else if (cryptoAccount.walletType === WalletType.Ethereum) {
            const result = await getEthereumBalance(cryptoAccount.walletAddress, cryptoAccount.currencyCode)
            currentBalance = result.currentBalance
            walletTokenBalance = result.walletTokenBalance
          }

          if (currentBalance != null && walletTokenBalance != null) {
            await dataSource.getRepository(Account).update(cryptoAccount.id, {
              currentBalance,
              walletTokenBalance
            })

            await dataSource
              .createQueryBuilder()
              .insert()
              .into(BalanceHistory)
              .values({
                date: startOfDay(new Date()),
                currentBalance,
                walletTokenBalance,
                accountId: cryptoAccount.id,
                householdId: household.id
              })
              .orIgnore()
              .execute()
          }
        } catch (e) {
          console.log(`Failed to update crypto account ${cryptoAccount.id}`, e)
        }
      }
    }

    await dataSource.getRepository(Household).update(household.id, {})
  }

  console.log(`Balance lambda complete`)
}
