import { TagColor } from 'frontend-types'
import React from 'react'

type Props = {
  children: React.ReactNode
  className?: string
  color: TagColor
  onClick?: () => void
  small?: boolean
}

export const Tag: React.FC<Props> = ({ children, className = '', color, onClick, small = false }) => {
  const getColor = (col: TagColor) => {
    switch (col) {
      case TagColor.White:
        return 'bg-gray-200 text-gray-900'
      case TagColor.Black:
        return 'bg-gray-900 text-white'
      case TagColor.Grey:
        return 'bg-gray-100 text-grey-900 border-gray-400'
      case TagColor.Brown:
        return 'bg-amber-900 text-white'
      case TagColor.Red:
        return 'bg-red-100 text-red-700 border-red-500'
      case TagColor.Orange:
        return 'bg-orange-100 text-orange-700 border-orange-500'
      case TagColor.Yellow:
        return 'bg-yellow-100 text-yellow-700 border-yellow-500'
      case TagColor.Green:
        return 'bg-green-100 text-green-700 border-green-500'
      case TagColor.Teal:
        return 'bg-teal-100 text-teal-700 border-teal-500'
      case TagColor.Blue:
        return 'bg-blue-100 text-blue-700 border-blue-500'
      case TagColor.Indigo:
        return 'bg-indigo-100 text-indigo-700 border-indigo-500'
      case TagColor.Violet:
        return 'bg-violet-100 text-violet-700 border-violet-500'
      case TagColor.Purple:
        return 'bg-purple-100 text-purple-700 border-purple-500'
      case TagColor.Pink:
        return 'bg-pink-100 text-pink-700 border-pink-500'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-500'
    }
  }

  const format = small ? 'px-2 py-0.5' : 'px-2 py-1'

  return (
    <div
      className={`mr-1 my-0.5 text-xs ${format} inline-flex items-center leading-sm border rounded-sm ${getColor(
        color
      )} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
