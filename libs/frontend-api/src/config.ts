export type ApiConfig = {
  apiUrl: string
  googleMapsApiKey: string
  getToken: () => Promise<string | null>
  onMessage: (message: string) => void
  getAppVersion: () => string | null
}

export let config: ApiConfig

export const initializeApi = (_config: ApiConfig) => {
  config = _config
}
