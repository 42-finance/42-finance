import { TagColor } from 'frontend-types'
import React from 'react'

type Props = {
  children?: React.ReactNode | React.ReactNode[]
  color: TagColor
  className?: string
}

export const Badge: React.FC<Props> = ({ children, color, className }) => {
  const getColor = (col: TagColor) => {
    switch (col) {
      case TagColor.White:
        return 'bg-gray-200 text-gray-900'
      case TagColor.Black:
        return 'bg-gray-900 text-white'
      case TagColor.Grey:
        return 'bg-gray-500 text-white'
      case TagColor.Brown:
        return 'bg-amber-900 text-white'
      case TagColor.Red:
        return 'bg-red-600 text-white'
      case TagColor.Orange:
        return 'bg-orange-600 text-white'
      case TagColor.Yellow:
        return 'bg-yellow-500 text-white'
      case TagColor.Green:
        return 'bg-green-600 text-white'
      case TagColor.Teal:
        return 'bg-teal-600 text-white'
      case TagColor.Blue:
        return 'bg-blue-600 text-white'
      case TagColor.Indigo:
        return 'bg-indigo-600 text-white'
      case TagColor.Violet:
        return 'bg-violet-600 text-white'
      case TagColor.Purple:
        return 'bg-purple-600 text-white'
      case TagColor.Pink:
        return 'bg-pink-600 text-white'
      default:
        return 'bg-gray-600 text-white'
    }
  }

  return (
    <div
      className={`badge inline-flex items-center justify-center text-xs rounded-full ${getColor(color)} ${
        children != null ? 'min-w-[20px] min-h-[20px] leading-none' : 'p-1'
      } ${className || ''}`}
    >
      {children}
    </div>
  )
}
