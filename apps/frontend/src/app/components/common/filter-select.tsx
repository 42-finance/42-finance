import Select, { SingleValue, createFilter } from 'react-select'

type OptionValue = string | number

type Props<T extends OptionValue> = {
  addonBefore?: React.ReactNode
  allowClear?: boolean
  allowSearch?: boolean
  data?: SelectOption<T>[]
  disabled?: boolean
  loading?: boolean
  name: string
  onChange: (value: T | undefined) => void
  placeholder?: string
  value?: T | null
  width?: string
}

type SelectOption<T extends OptionValue> = {
  value: T
  label: string
}

export function FilterSelect<T extends OptionValue>({
  addonBefore,
  allowClear = true,
  allowSearch = true,
  data,
  disabled,
  loading,
  name,
  onChange,
  placeholder = '',
  value,
  width = 'min-w-[200px]'
}: Props<T>) {
  if (!data) {
    return null
  }

  const handleChange = (option: SingleValue<SelectOption<T>>) => {
    onChange(option ? option.value : undefined)
  }

  return (
    <div className="flex flex-wrap">
      {addonBefore}
      <div className={width}>
        <label className="sr-only" htmlFor={name}>
          {name}
        </label>
        <Select<SelectOption<T>>
          className={addonBefore ? 'react-select-addon-after' : ''}
          classNamePrefix={'react-select'}
          filterOption={createFilter({
            ignoreAccents: false,
            matchFrom: 'any',
            stringify: (option) => `${option.label}`
          })}
          inputId={name}
          isClearable={allowClear}
          isDisabled={disabled}
          isLoading={loading}
          isSearchable={allowSearch}
          onChange={handleChange}
          options={data}
          placeholder={placeholder}
          value={data.filter((o) => o.value === value) || null}
        />
      </div>
    </div>
  )
}
