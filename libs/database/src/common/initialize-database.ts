import { dataSource } from '..'

export const initializeDatabase = async () => {
  await dataSource.initialize()
}
