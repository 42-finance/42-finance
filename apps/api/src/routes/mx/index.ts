import { Router } from 'express'

import { getConnectUrl } from './getConnectUrl'
import { memberCreated } from './memberCreated'

const mxRouter = Router()
mxRouter.get('/connect', getConnectUrl)
mxRouter.post('/member', memberCreated)

export { mxRouter }
