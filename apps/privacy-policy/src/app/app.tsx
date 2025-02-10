import { ThemeProvider, createTheme } from '@mui/material'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Privacy } from './routes/privacy'

export const App = () => {
  const theme = createTheme({
    typography: {
      fontFamily: 'Barlow'
    }
  })

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/" element={<Privacy />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  )
}
