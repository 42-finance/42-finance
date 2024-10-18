import React from 'react'

type SkeletonSubComponent = {
  width?: string
  height?: string
  className?: string
}

type SkeletonSubComponents = {
  Input: React.FC<SkeletonSubComponent>
  Button: React.FC<SkeletonSubComponent>
}

export const Skeleton: SkeletonSubComponents = {
  Input: ({ className, width = 'w-full', height = 'h-10' }) => {
    return (
      <div
        className={`skeleton skeleton-input bg-gray-300 animate-pulse ${width} ${height} ${className}`}
      />
    )
  },
  Button: ({ className, width = 'w-full', height = 'h-10' }) => {
    return (
      <div
        className={`skeleton skeleton-button bg-gray-300 rounded-sm animate-pulse ${width} ${height} ${className}`}
      />
    )
  },
}
