import { createRule } from './createRule'
import { deleteRule } from './deleteRule'
import { getRule } from './getRule'
import { getRules } from './getRules'
import { updateRule } from './updateRule'
import { Router } from 'express'

const ruleRouter = Router()
ruleRouter.get('/', getRules)
ruleRouter.get('/:id', getRule)
ruleRouter.post('/', createRule)
ruleRouter.patch('/:id', updateRule)
ruleRouter.delete('/:id', deleteRule)
export { ruleRouter }
