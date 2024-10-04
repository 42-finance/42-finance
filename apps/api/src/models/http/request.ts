declare namespace Express {
  interface Request {
    userId: number
    householdId: number
    appVersion: string | null
  }
}
