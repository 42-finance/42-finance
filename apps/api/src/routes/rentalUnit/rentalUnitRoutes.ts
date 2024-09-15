import { Router } from 'express'

import createRentalUnit from './createRentalUnit'
import deleteRentalUnit from './deleteRentalUnit'
import getRentalUnit from './getRentalUnit'
import getRentalUnits from './getRentalUnits'
import updateRentalUnit from './updateRentalUnit'

const rentalUnitRouter = Router()
rentalUnitRouter.get('/', getRentalUnits)
rentalUnitRouter.get('/:id', getRentalUnit)
rentalUnitRouter.post('/', createRentalUnit)
rentalUnitRouter.patch('/:id', updateRentalUnit)
rentalUnitRouter.delete('/:id', deleteRentalUnit)
export default rentalUnitRouter
