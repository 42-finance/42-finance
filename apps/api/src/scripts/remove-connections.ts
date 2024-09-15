import { Connection, Household, HouseholdUser, User, dataSource, initializeDatabase } from 'database'
import fs from 'fs/promises'
import { plaidClient } from 'plaid-helpers'

const main = async () => {
  await initializeDatabase()

  const connections = await dataSource
    .getRepository(Connection)
    .createQueryBuilder('connection')
    .leftJoinAndMapOne('connection.household', Household, 'household', 'household.id = connection.householdId')
    .leftJoinAndMapMany(
      'household.householdUsers',
      HouseholdUser,
      'householdUser',
      'householdUser.householdId = household.id'
    )
    .leftJoinAndMapOne('householdUser.user', User, 'user', 'householdUser.userId = user.id')
    .getMany()

  const connectionsToDelete = []

  for (const connection of connections) {
    const users = connection.household.householdUsers.map((u) => u.user)
    const hasLoggedIn = users.some((u) => u.lastLoginTime)
    if (hasLoggedIn || connection.accessToken == null) {
      continue
    }
    connectionsToDelete.push(connection)
  }

  console.log(`${connectionsToDelete.length} connections to delete`)

  await fs.writeFile('./connections.ts', JSON.stringify(connectionsToDelete))

  for (const connection of connectionsToDelete) {
    try {
      const plaidResult = await plaidClient.itemRemove({ access_token: connection.accessToken! })
      if (plaidResult.status !== 200) {
        console.log(
          `Failed to remove plaid connection ${connection.accessToken}. `,
          plaidResult.status,
          plaidResult.statusText
        )
      } else {
        console.log(`Removed plaid connection ${connection.accessToken}.`)
      }
    } catch (e: any) {
      console.log(`Failed to remove plaid connection ${connection.accessToken}. `, e.response.data)
    }
  }
}

main()
