import { dataSource, Property } from 'database'
import { Request, Response } from 'express'

export default async (request: Request, response: Response) => {
  const { id } = request.params
  const userId = request.userId

  const propertyRepo = dataSource.getRepository(Property)
  const property = await propertyRepo
    .createQueryBuilder('property')
    .where('property.id = :id', { id })
    .andWhere('property.landlordId = :userId', { userId })
    .getOne()

  if (!property) {
    return response.status(404).send(`Property with id: ${id} was not found`)
  }

  try {
    const result = await propertyRepo.remove(property)
    return response.send(result)
  } catch (error: any) {
    return response.status(500).send(error)
  }
}
