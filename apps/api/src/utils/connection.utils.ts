import { Account, Connection, Transaction } from 'database'
import { plaidClient } from 'plaid-helpers'
import { EntityManager } from 'typeorm'

export const deletePlaidConnection = async (
  connection: Connection,
  keepData: boolean,
  entityManager: EntityManager
) => {
  const result = await entityManager.getRepository(Connection).softDelete(connection.id)

  if (!keepData) {
    const accounts = await entityManager
      .getRepository(Account)
      .createQueryBuilder('account')
      .where('account.connectionId = :connectionId', { connectionId: connection.id })
      .getMany()

    const accountIds = accounts.map((a) => a.id)

    if (accountIds.length > 0) {
      await entityManager.getRepository(Account).delete(accountIds)

      await entityManager
        .getRepository(Transaction)
        .createQueryBuilder()
        .where('accountId IN (:...accountIds)', { accountIds })
        .delete()
        .execute()
    }
  }

  if (connection.accessToken) {
    try {
      const plaidResult = await plaidClient.itemRemove({ access_token: connection.accessToken })
      if (plaidResult.status !== 200) {
        console.log(
          `Failed to remove plaid connection ${connection.accessToken}. `,
          plaidResult.status,
          plaidResult.statusText
        )
      }
    } catch (e: any) {
      console.log(`Failed to remove plaid connection ${connection.accessToken}. `, e.response.data)
    }
  }

  return result
}
