import { dataSource, RentalUnit } from 'database'
import { Request, Response } from 'express'

export default async (request: Request, response: Response) => {
  const { id } = request.params
  const userId = request.userId

  const rentalUnitRepo = dataSource.getRepository(RentalUnit)
  const rentalUnit = await rentalUnitRepo
    .createQueryBuilder('rentalUnit')
    .leftJoin('property', 'property', 'property.id = rentalUnit.propertyId')
    .where('rentalUnit.id = :id', { id })
    .andWhere('property.landlordId = :userId', { userId })
    .getOne()

  if (!rentalUnit) {
    return response.status(404).send(`Tenant group with id: ${id} was not found`)
  }

  try {
    const result = await rentalUnitRepo.remove(rentalUnit)
    return response.send(result)
  } catch (error: any) {
    return response.status(500).send(error)
  }
}
