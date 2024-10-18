import { config } from './config'
import { convertDateStringsToDate } from './date.utils'
import { HTTPResponseBody } from './http-response-body.type'

export interface HttpResponse<T> extends Response {
  parsedBody?: T
}

export async function http<T>(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  body?: any,
  raw?: boolean
) {
  const token = await config.getToken()

  const args = {
    method,
    headers: {
      ...(raw ? {} : { 'Content-Type': 'application/json' }),
      Authorization: token ? `bearer ${token}` : '',
      'x-app-version': config.getAppVersion()
    },
    body: body ? (raw ? body : JSON.stringify(body)) : undefined
  } as RequestInit

  const response: HttpResponse<T> = await fetch(path, args)

  try {
    // may error if there is no body
    response.parsedBody = await response.json()
    convertDateStringsToDate(response.parsedBody)
  } catch {}

  if (response && !response.ok) {
    const parsedBody = response.parsedBody as HTTPResponseBody<any>
    if (parsedBody?.errors?.length) {
      config.onMessage(parsedBody.errors.join('. '))
    } else if (response.statusText?.length) {
      config.onMessage(response.statusText)
    } else {
      config.onMessage('An unknown error occurred. Please try again.')
    }
  }

  return response
}

export async function get<T>(path: string) {
  return http<T>(path, 'GET')
}

export async function post<T>(path: string, body: any) {
  return http<T>(path, 'POST', body, false)
}

export async function put<T>(path: string, body: any) {
  return http<T>(path, 'PUT', body, false)
}

export async function patch<T>(path: string, body: any) {
  return http<T>(path, 'PATCH', body, false)
}

export async function del<T>(path: string, body?: any) {
  return http<T>(path, 'DELETE', body, false)
}

export async function postMultiPart<T>(path: string, body: FormData): Promise<HttpResponse<T>> {
  return http<T>(path, 'POST', body, true)
}
