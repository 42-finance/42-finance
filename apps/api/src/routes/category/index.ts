import { createCategory } from './createCategory'
import { deleteCategory } from './deleteCategory'
import { getCategories } from './getCategories'
import { getCategory } from './getCategory'
import { updateCategory } from './updateCategory'
import { Router } from 'express'

const categoryRouter = Router()
categoryRouter.get('/', getCategories)
categoryRouter.get('/:id', getCategory)
categoryRouter.post('/', createCategory)
categoryRouter.patch('/:id', updateCategory)
categoryRouter.delete('/:id', deleteCategory)
export { categoryRouter }
