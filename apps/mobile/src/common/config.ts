export const config = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL as string,
  appUrl: process.env.EXPO_PUBLIC_APP_URL as string,
  googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  mixPanelKey: process.env.EXPO_PUBLIC_MIXPANEL_KEY as string,
  sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN as string
}
