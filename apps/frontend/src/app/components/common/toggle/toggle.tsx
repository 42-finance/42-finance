import { Switch } from '@headlessui/react'
import React, { useState } from 'react'

type Props = {
  children?: React.ReactNode | React.ReactNode[]
  checked?: boolean
  disabled?: boolean
  onChange: (checked: boolean) => void
  small?: boolean
}

export const Toggle: React.FC<Props> = ({
  checked = false,
  children,
  disabled = false,
  onChange,
  small = false,
}) => {
  const [enabled, setEnabled] = useState(false)

  React.useMemo(() => {
    setEnabled(checked)
  }, [checked])

  const handleChange = (c: boolean) => {
    onChange(c)
  }

  const cursor = disabled ? 'default' : 'pointer'
  const bgColorEnabled = disabled ? 'bg-lighter-green/30' : 'bg-lighter-green'
  const bgColorNotEnabled = disabled ? 'bg-gray-200' : 'bg-gray-300'
  const height = small ? 'h-[16px]' : 'h-[22px]'
  const width = small ? 'w-[28px]' : 'w-[44px]'
  const switchSize = small ? 'h-[12px] w-[12px]' : 'h-[18px] w-[18px]'
  const switchTransform = small ? 'translate-x-[12px]' : 'translate-x-[22px]'
  const marginRight = small ? 'mr-1' : 'mr-3'

  return (
    <Switch
      checked={checked}
      disabled={disabled}
      onChange={handleChange}
      className={`${enabled ? bgColorEnabled : bgColorNotEnabled}
          relative flex ${height} ${width} ${marginRight} shrink-0 ${cursor} rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus-visible:ring-2 focus-visible:ring-midnight-blue/30`}
    >
      <span className="sr-only">{children}</span>
      <span
        aria-hidden="true"
        className={`${
          enabled ? switchTransform : 'translate-x-0'
        } pointer-events-none inline-block ${switchSize} transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
      />
    </Switch>
  )
}
