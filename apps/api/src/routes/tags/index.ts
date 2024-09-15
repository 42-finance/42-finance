import { Router } from 'express'

import { createTag } from './createTag'
import { deleteTag } from './deleteTag'
import { getTag } from './getTag'
import { getTags } from './getTags'
import { updateTag } from './updateTag'

const tagRouter = Router()
tagRouter.get('/', getTags)
tagRouter.get('/:id', getTag)
tagRouter.post('/', createTag)
tagRouter.patch('/:id', updateTag)
tagRouter.delete('/:id', deleteTag)
export { tagRouter }
