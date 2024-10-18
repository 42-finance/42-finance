import React, { useMemo } from 'react'
import { Controller } from 'react-hook-form'
import { AiFillCloseCircle, AiOutlineQuestionCircle } from 'react-icons/ai'
import Select, { SingleValue, createFilter } from 'react-select'

import { Tooltip } from '../tooltip/tooltip'

type OptionValue = string | number | boolean

type Props<T extends OptionValue> = {
  allowClear?: boolean
  control: any
  disabled?: boolean
  errors?: string
  help?: string
  label: React.ReactNode
  loading?: boolean
  name: string
  onChange?: (value: T | null) => void
  options?: SelectOption<T>[]
  placeholder?: string
  sortOptions?: boolean
}

type SelectOption<T extends OptionValue> = {
  value: T
  label: string
}

export function FormSelect<T extends OptionValue>(props: Props<T>) {
  const {
    allowClear,
    control,
    disabled,
    errors,
    help,
    label,
    loading,
    name,
    onChange,
    options,
    placeholder,
    sortOptions = true
  } = props

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

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange: onControllerChange, onBlur, value, name: inputName, ref } }) => {
        const handleChange = (option: SingleValue<SelectOption<T>>) => {
          onControllerChange(option ? option.value : null)
          onChange?.(option ? option.value : null)
        }

        return (
          <div data-testid={`form-item-${inputName}`}>
            <div className="sr-only" data-testid={`${name}-loading-${loading}`} />
            <label htmlFor={name} className="relative mb-1 flex items-center">
              {label}
              {help && (
                <Tooltip className="ml-1 text-base text-gray-400" color="bg-midnight-blue" body={help}>
                  <span>
                    <AiOutlineQuestionCircle />
                  </span>
                </Tooltip>
              )}
            </label>
            <div className={`relative form-select ${errors ? 'form-select-errors' : ''}`}>
              <Select<SelectOption<T>>
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
                name={name}
                onBlur={onBlur}
                onChange={handleChange}
                options={sortedOptions}
                placeholder={placeholder}
                ref={ref}
                value={sortedOptions?.filter((o) => o.value === value) || null}
              />
              {errors && (
                <div className="text-red-600 text-base absolute inline-block right-9 top-3">
                  <AiFillCloseCircle />
                </div>
              )}
            </div>
            <div className="text-red-600 text-xs min-h-[30px] mt-1">{errors}</div>
          </div>
        )
      }}
    />
  )
}
