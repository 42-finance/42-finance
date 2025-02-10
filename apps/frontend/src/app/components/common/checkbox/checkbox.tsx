type Props = {
  className?: string
  children?: React.ReactNode
  checked?: boolean
  disabled?: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const Checkbox: React.FC<Props> = ({
  className,
  checked,
  children,
  disabled,
  onChange,
}) => {
  return (
    <label className={`inline-flex items-center ${className}`}>
      <input
        checked={checked}
        className={`w-4 h-4 accent-lighter-green bg-white rounded-sm border-gray-300 focus:outline-hidden focus:ring-offset-0 focus:border-midnight-blue focus:ring-midnight-blue/30`}
        disabled={disabled}
        onChange={onChange}
        type="checkbox"
      />
      {children && <span className="ml-2 select-none">{children}</span>}
    </label>
  )
}
