import React from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

type Props = {
  'data-testid'?: string
  'aria-label'?: string
  children?: React.ReactNode | React.ReactNode[]
  block?: boolean
  className?: string
  danger?: boolean
  disabled?: boolean
  download?: boolean
  form?: string
  ghost?: boolean
  htmlType?: 'submit' | 'button'
  href?: string
  icon?: React.ReactNode
  loading?: boolean
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  rel?: string
  target?: string
  type?: 'primary' | 'link' | 'default'
}

export const Button: React.FC<Props> = ({
  'aria-label': ariaLabel,
  'data-testid': dataTestId,
  block,
  children,
  className,
  danger,
  disabled,
  download,
  form,
  ghost,
  htmlType,
  href,
  icon,
  loading,
  onClick,
  rel,
  target,
  type
}) => {
  let color = 'bg-transparent text-primary border border-primary transition-all'
  let rounded = 'px-4 pt-1 pb-1.5 rounded-[4px]'

  if (disabled) {
    color = 'bg-gray-100 border border-gray-300 text-gray-300'
  }

  if (type === 'primary') {
    color = ghost
      ? 'text-primary border border-primary'
      : 'bg-primary dark:bg-primaryDark text-white dark:text-black hover:bg-primary/80 transition-all'

    if (disabled) {
      color = 'bg-gray-100 border border-gray-300 text-gray-300'
    }
  }

  if (danger) {
    if (type === 'primary') {
      color = 'bg-red-500 text-white border border-red-500 hover:bg-red-500/80 transition-all'
    } else {
      color = 'bg-white border border-gray-300 hover:text-red-500 hover:border-red-500 transition-all'
    }

    if (disabled) {
      color = 'bg-gray-100 border border-gray-300 text-gray-300'
    }
  }

  if (type === 'link') {
    color = 'text-primary hover:underline'
    rounded = 'px-0 py-1'

    if (disabled) {
      color = 'text-gray-300'
    }
  }

  const width = block ? 'w-full' : ''

  const renderIcon = () => {
    if (loading) {
      return (
        <div className={children ? 'mr-2 text-base mb-1' : 'flex text-base items-center'}>
          <AiOutlineLoading3Quarters className="icon-spin" />
        </div>
      )
    }
    if (icon) {
      return <div className={children ? 'mr-2 text-base' : 'flex text-base items-center'}>{icon}</div>
    }
    return null
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (htmlType !== 'submit') {
      event.preventDefault()
    }
    if (onClick) {
      onClick(event)
    }
  }

  if (href) {
    return (
      <a
        href={href}
        download={download}
        className={`h-[40px] inline-flex items-center cursor-pointer ${width} ${className} ${color} ${rounded} hover:no-underline`}
        data-testid={dataTestId}
        aria-label={ariaLabel}
        rel={rel}
        target={target}
      >
        {renderIcon()}
        {children}
      </a>
    )
  }

  return (
    <button
      className={`h-[40px] pt-[6px] inline-flex items-center justify-center cursor-pointer drop-shadow-xs whitespace-nowrap ${rounded} ${color} ${width} ${
        className || ''
      }`}
      data-testid={dataTestId}
      aria-label={ariaLabel}
      disabled={loading || disabled}
      form={form}
      onClick={disabled ? undefined : handleClick}
      type={htmlType || 'button'}
    >
      {renderIcon()}
      {children}
    </button>
  )
}
