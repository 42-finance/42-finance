import './index.css'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import 'react-toastify/dist/ReactToastify.css'

import 'chartjs-adapter-date-fns'
import { initializeApi } from 'frontend-api'
import 'intersection-observer'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { ToastContainer, toast } from 'react-toastify'

import packageJson from '../package.json'
import { App } from './app/app'
import { API_URL, GOOGLE_API_KEY } from './app/common/config'

initializeApi({
  apiUrl: API_URL,
  googleMapsApiKey: GOOGLE_API_KEY,
  getToken: async () => JSON.parse(localStorage.getItem('token') ?? '{}'),
  onMessage: (message) =>
    toast.error(message, {
      autoClose: 5000,
      toastId: message
    }),
  getAppVersion: () => packageJson.version
})

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(
  <React.StrictMode>
    <App />
    <ToastContainer autoClose={2000} position="top-right" />
  </React.StrictMode>
)
