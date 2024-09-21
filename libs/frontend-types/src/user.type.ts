import { AccountSetup, CurrencyCode } from 'shared-types'

import { UserInvite } from './user-invite.type'

export type User = {
  id: number
  email: string
  name: string
  phone: string | null
  emailConfirmed: boolean
  currencyCode: CurrencyCode
  bankAccountLinked: boolean
  rotessaLinked: boolean
  rotessaClientVerified: boolean
  rotessaVerificationUrl: string
  isLandlord: boolean
  invitations: UserInvite[]
  accountSetup: AccountSetup
  hasPassword: boolean
  hideGettingStarted: boolean
}
