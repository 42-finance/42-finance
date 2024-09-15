export type HTTPResponseBody<T> = {
  errors: string[]
  metadata: {
    total: number
  }
  payload: T
}
