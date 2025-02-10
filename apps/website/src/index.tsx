import './index.css'

import { createBrowserHistory } from 'history'
import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Route, Router, Routes } from 'react-router-dom'

import { App } from './app/app'

export const MainRouter = () => {
  const [history] = useState(createBrowserHistory())
  const [state] = useState({
    action: history.action,
    location: history.location
  })

  return (
    <Router navigator={history} location={state.location}>
      <Routes>
        <Route path="*" element={<App />} />
      </Routes>
    </Router>
  )
}

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
