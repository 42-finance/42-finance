import React, { useState } from 'react'
import { CurrencyCode } from 'shared-types'

type Props = {
  token: string | null
  currencyCode: CurrencyCode
  children: React.ReactNode
}

type UserTokenContextType = {
  token: string | null
  setToken: React.Dispatch<React.SetStateAction<string | null>>
  currencyCode: CurrencyCode
  setCurrencyCode: React.Dispatch<React.SetStateAction<CurrencyCode>>
}

const UserTokenContext = React.createContext<UserTokenContextType>({} as UserTokenContextType)

export const useUserTokenContext = () => React.useContext(UserTokenContext)

export const UserTokenProvider = (props: Props) => {
  const [token, setToken] = useState<string | null>(props.token)
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>(props.currencyCode)

  const value = { token, setToken, currencyCode, setCurrencyCode }

  return <UserTokenContext.Provider value={value}>{props.children}</UserTokenContext.Provider>
}
