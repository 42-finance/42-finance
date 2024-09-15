import { ThemeProvider, createTheme } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TransactionsFilterProvider } from 'frontend-utils'
import queryString from 'query-string'
import { useEffect } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'

import { Layout } from './components/common/layout'
import { DisplayProvider } from './contexts/dark-mode.context'
import { UserTokenProvider } from './contexts/user-token.context'
import { ConfirmEmail } from './routes/confirm-email'
import { ForgotPassword } from './routes/forgot-password'
import { Invitation } from './routes/invitation'
import { Login } from './routes/login'
import { Privacy } from './routes/privacy'
import { Register } from './routes/register'
import { ResetPassword } from './routes/reset-password'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false
    }
  }
})

export const App = () => {
  useEffect(() => {
    window.addEventListener('error', (e) => {
      if (
        e.message === 'ResizeObserver loop limit exceeded' ||
        e.message === 'ResizeObserver loop completed with undelivered notifications.'
      ) {
        const resizeObserverErrDiv = document.getElementById('webpack-dev-server-client-overlay-div')
        const resizeObserverErr = document.getElementById('webpack-dev-server-client-overlay')
        if (resizeObserverErr) {
          resizeObserverErr.setAttribute('style', 'display: none')
        }
        if (resizeObserverErrDiv) {
          resizeObserverErrDiv.setAttribute('style', 'display: none')
        }
      }
    })
  }, [])

  const theme = createTheme({
    typography: {
      fontFamily: 'Barlow'
    }
  })

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <UserTokenProvider>
          <DisplayProvider>
            <TransactionsFilterProvider>
              <HelmetProvider>
                <QueryClientProvider client={queryClient}>
                  <QueryParamProvider
                    adapter={ReactRouter6Adapter}
                    options={{
                      searchStringToObject: queryString.parse,
                      objectToSearchString: queryString.stringify
                    }}
                  >
                    <Routes>
                      <Route path="/login" element={<Login />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/invitation" element={<Invitation />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
                      <Route path="/confirm-email" element={<ConfirmEmail />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="*" element={<Layout />} />
                    </Routes>
                  </QueryParamProvider>
                </QueryClientProvider>
              </HelmetProvider>
            </TransactionsFilterProvider>
          </DisplayProvider>
        </UserTokenProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
