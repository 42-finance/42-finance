import { Boom } from '@hapi/boom'

export const finicityRequest = async (url: string, method: 'POST' | 'GET', body: any, token?: string) => {
  const response = await fetch(`${process.env.FINICITY_API_URL}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Finicity-App-Key': process.env.FINICITY_APP_KEY as string,
      ...(token ? { 'Finicity-App-Token': token } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  })

  const data = await response.json()

  if (data.status) {
    throw new Boom(data.user_message, { statusCode: Number(data.status) })
  }

  return data
}
