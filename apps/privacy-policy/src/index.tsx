import './index.css'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import 'react-toastify/dist/ReactToastify.css'

import 'intersection-observer'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { ToastContainer } from 'react-toastify'

import { App } from './app/app'

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(
  <React.StrictMode>
    <App />
    <ToastContainer autoClose={2000} position="top-right" />
  </React.StrictMode>
)
