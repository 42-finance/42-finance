import { Account, AccountGroup, Household, dataSource, initializeDatabase } from 'database'
import { mapAccountGroupType, mapAccountSubTypeToAccountGroupType } from 'frontend-utils'
import { AccountGroupType } from 'shared-types'

const main = async () => {
  await initializeDatabase()

  const households = await dataSource
    .getRepository(Household)
    .find({ order: { id: 'ASC' }, relations: ['accounts'], withDeleted: true })

  console.log(households.length)

  let index = 0

  for (const household of households) {
    console.log(index)

    const groups: AccountGroup[] = []

    for (const type of Object.values(AccountGroupType)) {
      const group = await dataSource.getRepository(AccountGroup).save({
        name: mapAccountGroupType(type),
        type,
        householdId: household.id
      })
      groups.push(group)
    }

    for (const account of household.accounts) {
      const groupType = mapAccountSubTypeToAccountGroupType(account.subType, account.type)
      const group = groups.find((g) => g.type === groupType)
      await dataSource.getRepository(Account).update(account.id, { accountGroupId: group!.id })
    }

    index++
  }

  console.log('Done')
}

main()
