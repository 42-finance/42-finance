import { Boom } from '@hapi/boom'
import { NextFunction, Request, Response } from 'express'

export const errorHandler = (error: any, request: Request, response: Response, next: NextFunction) => {
  console.log(error)

  if (error.name === 'PlaidError') {
    error = new Boom(error.error_message, { statusCode: error.status_code })
  }

  if (!error.isBoom) {
    error = new Boom(error.message, { statusCode: 500 })
  }

  const { statusCode, payload } = error.output

  try {
    response.status(statusCode).json({
      errors: [payload.message],
      payload: {}
    })
  } catch {}
}
