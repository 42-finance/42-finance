import { useMemo } from 'react'
import Select, { SingleValue, createFilter } from 'react-select'

type OptionValue = string | number | boolean

type Props<T extends OptionValue> = {
  allowClear?: boolean
  disabled?: boolean
  loading?: boolean
  value: T
  onChange?: (value: T | null) => void
  options?: SelectOption<T>[]
  placeholder?: string
  sortOptions?: boolean
}

type SelectOption<T extends OptionValue> = {
  value: T
  label: string
}

export function SelectInput<T extends OptionValue>(props: Props<T>) {
  const { allowClear, disabled, loading, value, onChange, options, placeholder, sortOptions = true } = props

  const sortedOptions = useMemo(
    () =>
      sortOptions
        ? options?.sort((a, b) =>
            a.label && b.label && typeof a.label === 'string' && typeof b.label === 'string'
              ? a.label.toLowerCase().localeCompare(b.label.toLowerCase())
              : 0
          )
        : options,
    [options]
  )

  const handleChange = (option: SingleValue<SelectOption<T>>) => {
    onChange?.(option ? option.value : null)
  }

  return (
    <Select<SelectOption<T>>
      classNamePrefix={'react-select'}
      filterOption={createFilter({
        ignoreAccents: false,
        matchFrom: 'any',
        stringify: (option) => `${option.label}`
      })}
      isClearable={allowClear}
      isDisabled={disabled}
      isLoading={loading}
      onChange={handleChange}
      options={sortedOptions}
      placeholder={placeholder}
      value={sortedOptions?.filter((o) => o.value === value) || null}
      className="min-w-[230px]"
    />
  )
}
