import { Merchant, dataSource } from 'database'

export const getOrCreateMerchant = async (
  name: string,
  systemName: string,
  icon: string | null,
  householdId: number
) => {
  let merchant = await dataSource.getRepository(Merchant).findOne({ where: { systemName, householdId } })

  if (merchant == null) {
    merchant = await dataSource.getRepository(Merchant).findOne({ where: { name, householdId } })
  }

  if (merchant == null) {
    merchant = await dataSource.getRepository(Merchant).save({
      name,
      systemName,
      icon,
      householdId
    })
  }

  return merchant
}
