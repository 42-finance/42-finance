import cors from 'cors'
import { initializeDatabase } from 'database'
import express from 'express'
import 'express-async-errors'

import { config } from './common/config'
import { errorHandler } from './common/errorHandler'
import { router } from './routes/routes'

initializeDatabase().then(() => {
  const app = express()
  app.use(cors())
  app.use(express.json())
  app.use(router)
  app.use(errorHandler)

  const port = config.express.port
  app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })
})
