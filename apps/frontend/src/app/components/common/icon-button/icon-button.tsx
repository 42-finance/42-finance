import React from 'react'

type Props = {
  'data-testid'?: string
  'aria-label'?: string
  className?: string
  danger?: boolean
  disabled?: boolean
  icon: React.ReactNode
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  shape?: 'circle' | 'square'
}

export const IconButton: React.FC<Props> = ({
  'aria-label': ariaLabel,
  'data-testid': dataTestId,
  className,
  danger,
  disabled,
  icon,
  onClick,
  shape = 'circle',
}) => {
  let color =
    'bg-white border border-gray-300 hover:text-lighter-green hover:border-lighter-green transition-all'

  if (danger) {
    color =
      'bg-white border border-gray-300 hover:text-red-500 hover:border-red-500 transition-all'
  }

  if (disabled) {
    color = 'bg-gray-100 border border-gray-300 text-gray-300'
  }

  return (
    <button
      className={`flex text-base items-center justify-center w-[32px] h-[32px] ${
        shape === 'circle' ? ' rounded-full' : 'rounded-sm'
      } focus:outline-none focus:ring-2 focus:border-midnight-blue focus:ring-midnight-blue/30  ${color} ${
        className || ''
      }`}
      data-testid={dataTestId}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      type="button"
    >
      {icon}
    </button>
  )
}
