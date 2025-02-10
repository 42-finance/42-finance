import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { CurrencyCode } from 'shared-types'
import { useQueryParam } from 'use-query-params'

import { useUserTokenContext } from '../../contexts/user-token.context'
import { useSessionStorage } from '../../hooks/use-session-storage.hook'
import { RoutesContainer } from '../../routes'
import { SideBar } from '../side-bar/side-bar'

export const Layout = () => {
  const [tokenParam, setTokenParam] = useQueryParam<string | undefined>('token')
  const [currencyCodeParam, setCurrencyCodeParam] = useQueryParam<string | undefined>('currencyCode')
  const { token, setToken, currencyCode, setCurrencyCode } = useUserTokenContext()

  const location = useLocation()
  const [, setLastLocation] = useSessionStorage<string | null>('lastLocation', null)

  useEffect(() => {
    const { pathname, search } = location
    if (!['/login', '/', '/unauthorized'].includes(pathname)) {
      setLastLocation(`${pathname}${search}`)
    }
  }, [location])

  useEffect(() => {
    if (tokenParam) {
      setToken(tokenParam)
      setTokenParam(undefined)
    }
  }, [tokenParam])

  useEffect(() => {
    if (currencyCodeParam) {
      setCurrencyCode(currencyCode as CurrencyCode)
      setCurrencyCodeParam(undefined)
    }
  }, [currencyCodeParam])

  if (tokenParam && !token) {
    return null
  }

  if (!token) {
    return <Navigate to="/login" />
  }

  return (
    <div className="relative">
      <SideBar />
      <main className="pt-14 lg:pt-0 lg:pl-[466px]">
        <RoutesContainer />
      </main>
    </div>
  )
}
