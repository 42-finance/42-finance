import { Boom } from '@hapi/boom'
import jwt from 'jsonwebtoken'

export const verifyJwt = <T extends object>(token: string, secretKey: string) => {
  let decodedToken

  try {
    decodedToken = jwt.verify(token, secretKey) as T
  } catch (error: any) {
    if (error.message === 'jwt expired') {
      throw new Boom('Authorization token expired', { statusCode: 401 })
    }
    if (error.message === 'jwt malformed') {
      throw new Boom('Unauthorized access', { statusCode: 401 })
    }
    if (error.message === 'jwt must be provided') {
      throw new Boom('Unauthorized access, token not provided', { statusCode: 401 })
    }
    throw new Boom('Unauthorized access, invalid token', { statusCode: 401 })
  }

  if (decodedToken == null) {
    throw new Boom('Unauthorized access, invalid token', { statusCode: 401 })
  }

  return decodedToken
}
