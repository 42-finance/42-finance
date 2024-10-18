import { TagColor } from 'frontend-types'
import React, { useMemo } from 'react'
import { Controller } from 'react-hook-form'
import { AiFillCloseCircle, AiOutlineClose, AiOutlineQuestionCircle } from 'react-icons/ai'
import Select, { MultiValue, MultiValueProps, createFilter } from 'react-select'

import { Tag } from '../tag/tag'
import { Tooltip } from '../tooltip/tooltip'

type SelectOption = {
  value: string
  label: string
}

type Props = {
  allowClear?: boolean
  control: any
  disabled?: boolean
  errors?: string
  help?: string
  label: React.ReactNode
  loading?: boolean
  name: string
  onChange?: (value: string[] | null) => void
  options?: string[]
  placeholder?: string
}

export const FormMultiSelect: React.FC<Props> = (props) => {
  const { allowClear, control, disabled, errors, help, label, loading, name, onChange, options, placeholder } = props

  const sortedOptions = useMemo(
    () =>
      options
        ?.map((o) => ({ value: o, label: o }))
        .sort((a, b) =>
          a.label && b.label && typeof a.label === 'string' && typeof b.label === 'string'
            ? a.label.toLowerCase().localeCompare(b.label.toLowerCase())
            : 0
        ),
    [options]
  )

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange: onControllerChange, onBlur, value, name: inputName, ref } }) => {
        const handleChange = (values: MultiValue<SelectOption> | undefined) => {
          onControllerChange(values?.map((t) => t.value) ?? null)
          onChange?.(values?.map((t) => t.value) ?? null)
        }

        const MV = (p: MultiValueProps<SelectOption, true>) => {
          const { Remove } = p.components
          return (
            <div>
              <Tag color={TagColor.Blue} small>
                {p.data.label}
                <Remove data={p.data} selectProps={p.selectProps} innerProps={{ ...p.removeProps }}>
                  <div className="ml-1 hover:text-gray-900">
                    <AiOutlineClose />
                  </div>
                </Remove>
              </Tag>
            </div>
          )
        }

        return (
          <div data-testid={`form-item-${inputName}`}>
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
            <div className="relative">
              <Select<SelectOption, true>
                classNamePrefix={'react-select-form'}
                components={{ MultiValue: MV }}
                filterOption={createFilter({
                  ignoreAccents: false,
                  matchFrom: 'any',
                  stringify: (option) => `${option.label}`
                })}
                inputId={name}
                isClearable={allowClear}
                isDisabled={disabled}
                isLoading={loading}
                isMulti
                name={name}
                onBlur={onBlur}
                onChange={handleChange}
                options={sortedOptions}
                placeholder={placeholder}
                ref={ref}
                value={sortedOptions?.filter((t) => value?.includes(t.value)) || null}
              />
              {errors && (
                <span className="text-red-600 text-base absolute inline-block right-11 top-3">
                  <AiFillCloseCircle />
                </span>
              )}
            </div>
            <div className="text-red-600 text-xs min-h-[30px] mt-1">{errors}</div>
          </div>
        )
      }}
    />
  )
}
