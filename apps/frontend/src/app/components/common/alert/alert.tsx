import React from 'react'
import { FiAlertCircle, FiAlertTriangle, FiCheckCircle, FiInfo } from 'react-icons/fi'

type Props = {
  className?: string
  closable?: boolean
  message: React.ReactNode
  onClose?: () => void
  showIcon?: boolean
  type?: 'success' | 'error' | 'warning' | 'info'
}

export const Alert: React.FC<Props> = ({ className, closable, message, onClose, showIcon, type = 'info' }) => {
  let textColor = 'text-midnight-blue'
  let bgColor = 'bg-midnight-blue/10'
  let borderColor = 'border-midnight-blue'
  let icon: React.ReactNode | null = null

  switch (type) {
    case 'success':
      textColor = 'text-green-600'
      bgColor = 'bg-green-600/20'
      borderColor = 'border-green-600'
      if (showIcon) {
        icon = <FiCheckCircle />
      }
      break
    case 'error':
      textColor = 'text-red-600'
      bgColor = 'bg-red-600/20'
      borderColor = 'border-red-600'
      if (showIcon) {
        icon = <FiAlertTriangle />
      }
      break
    case 'warning':
      textColor = 'text-capstone-orange'
      bgColor = 'bg-capstone-orange/20'
      borderColor = 'border-capstone-orange'
      if (showIcon) {
        icon = <FiAlertCircle />
      }
      break
    case 'info':
      textColor = 'text-midnight-blue'
      bgColor = 'bg-midnight-blue/20'
      borderColor = 'border-midnight-blue'
      if (showIcon) {
        icon = <FiInfo />
      }
      break
  }

  return (
    <div
      className={`relative alert px-3 py-2 mb-5 text-sm ${textColor} ${bgColor} border ${borderColor} rounded-xs ${className}`}
      role="alert"
    >
      <div className="flex items-center">
        {icon && <div className="mr-2 text-2xl">{icon}</div>}
        {message}
      </div>
      {closable && (
        <button className="absolute top-0 right-0 mr-2" onClick={onClose} type="button" aria-label="Close">
          <span className={`${textColor} text-2xl`}>&times;</span>
        </button>
      )}
    </div>
  )
}
