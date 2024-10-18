import { DashboardWidget, User, dataSource, initializeDatabase } from 'database'
import { DashboardWidgetType } from 'shared-types'

const main = async () => {
  await initializeDatabase()

  const users = await dataSource.getRepository(User).find()

  console.log(users.length)

  for (const user of users) {
    console.log(user.name)

    let order = 0

    for (const type of Object.values(DashboardWidgetType)) {
      await dataSource
        .getRepository(DashboardWidget)
        .createQueryBuilder()
        .insert()
        .values({
          type,
          order,
          isSelected: true,
          userId: user.id
        })
        .orIgnore()
        .execute()
      order++
    }
  }

  console.log('Done')
}

main()
