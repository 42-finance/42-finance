import { Router } from 'express'

import { getConnectUrl } from './getConnectUrl'
import { refreshData } from './refreshData'

const finicityRouter = Router()
finicityRouter.get('/connect', getConnectUrl)
finicityRouter.post('/refresh', refreshData)

export { finicityRouter }
