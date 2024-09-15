import { ThemeProvider, createTheme } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import queryString from 'query-string'
import { useEffect } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'

import { UserTokenProvider } from './contexts/user-token.context'
import { Home } from './routes/home'

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
                  <Route path="/" element={<Home />} />
                </Routes>
              </QueryParamProvider>
            </QueryClientProvider>
          </HelmetProvider>
        </UserTokenProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
