import React from 'react'
import { Navigate } from 'react-router-dom'

export const Unauthorized: React.FC = () => {
  React.useEffect(() => {
    localStorage.clear()
  }, [])

  return <Navigate to="/login" />
}
