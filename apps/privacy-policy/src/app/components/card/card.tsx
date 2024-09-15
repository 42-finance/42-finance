import React from 'react'

type Props = {
  children?: React.ReactNode | React.ReactNode[]
  bodyStyle?: React.CSSProperties
  className?: string
  headerClassName?: string
  extra?: React.ReactNode
  hoverable?: boolean
  id?: string
  onClick?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  title?: React.ReactNode
  titleTextSize?: string
}

export const Card: React.FC<Props> = ({
  bodyStyle,
  children,
  className = '',
  headerClassName = '',
  extra,
  hoverable,
  id,
  onClick,
  onMouseEnter,
  onMouseLeave,
  title,
  titleTextSize = 'text-xl'
}) => {
  const renderHeader = () => {
    if (!title && !extra) {
      return null
    }

    return (
      <div className={`flex flex-wrap justify-between items-center border-b border-grey-200 ${headerClassName}`}>
        {renderTitle()}
        {renderExtra()}
      </div>
    )
  }

  const renderTitle = () => {
    if (!title) {
      return null
    }

    return (
      <div className={`px-6 py-3 font-semibold ${titleTextSize} mt-[2px]`} data-testid="card-title">
        {title}
      </div>
    )
  }

  const renderExtra = () => {
    if (!extra) {
      return null
    }

    return <div className="px-6 py-3">{extra}</div>
  }

  const renderChildren = () => {
    return (
      <div className="" style={bodyStyle}>
        {children}
      </div>
    )
  }

  const hoverClass = hoverable ? 'hover:shadow-black/20 cursor-pointer duration-300' : ''

  const wrapperClass = `bg-white dark:bg-[#222] border border-gray-200 dark:border-neutral-700 rounded-[4px] shadow-md shadow-black/8 relative transition-shadow ${hoverClass} ${className}`

  return (
    <div id={id} className={wrapperClass} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {renderHeader()}
      {renderChildren()}
    </div>
  )
}
