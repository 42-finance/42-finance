import React from 'react'
import { CurrencyCode } from 'shared-types'

import { useLocalStorage } from '../hooks/use-local-storage.hook'

type Props = {
  children: React.ReactNode
}

type UserTokenContextType = {
  token: string | null
  setToken: (token: string | null) => void
  currencyCode: CurrencyCode
  setCurrencyCode: (currencyCode: CurrencyCode) => void
}

const UserTokenContext = React.createContext<UserTokenContextType>({} as UserTokenContextType)

export const useUserTokenContext = () => React.useContext(UserTokenContext)

export const UserTokenProvider = (props: Props) => {
  const [token, setToken] = useLocalStorage<string | null>('token', null)
  const [currencyCode, setCurrencyCode] = useLocalStorage<CurrencyCode>('currencyCode', CurrencyCode.USD)

  const value = { token, setToken, currencyCode, setCurrencyCode }

  return <UserTokenContext.Provider value={value}>{props.children}</UserTokenContext.Provider>
}
