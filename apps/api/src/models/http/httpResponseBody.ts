export type HTTPResponseBody<T = any> = {
  errors: (string | null)[]
  payload: T
  metadata?: {
    [key: string]: any
  }
}
