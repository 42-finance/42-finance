import { Controller } from 'react-hook-form'
import { AiFillCloseCircle, AiOutlineQuestionCircle } from 'react-icons/ai'
import { NumericFormat } from 'react-number-format'

import { Tooltip } from '../tooltip/tooltip'

type Props = {
  addonAfter?: React.ReactNode
  autoComplete?: boolean
  control: any
  disabled?: boolean
  errors?: string
  help?: string
  label?: React.ReactNode
  name: string
  onChange?: (value: string) => void
  placeholder?: string
  step?: number
  heightClass?: string
}

export const FormCurrencyInput: React.FC<Props> = (props) => {
  const {
    addonAfter,
    autoComplete,
    control,
    disabled,
    errors,
    help,
    label,
    name,
    onChange,
    placeholder,
    step,
    heightClass = ''
  } = props

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange: onControllerChange, onBlur, value, name: inputName, ref } }) => {
        const rounded = addonAfter ? 'rounded-none rounded-l-[4px]' : 'rounded-[4px]'
        const borderColor = errors ? 'border-red-500' : 'border-cool-grey'

        return (
          <div data-testid={`form-item-${inputName}`}>
            {label && (
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
            )}
            <div className="flex">
              <div className="relative w-full">
                <NumericFormat
                  className={`${heightClass} block w-full text-sm p-2 bg-white text-gray-900 placeholder:text-dark-greyish-blue border ${borderColor} ${rounded} focus:outline-hidden focus:border-midnight-blue focus:ring-midnight-blue/30 disabled:bg-gray-100`}
                  data-lpignore={autoComplete ? 'false' : true}
                  data-testid={inputName}
                  disabled={disabled ?? false}
                  id={inputName}
                  name={inputName}
                  onBlur={onBlur}
                  onChange={(e) => {}}
                  onValueChange={(values) => {
                    onControllerChange(values.value)
                    onChange?.(values.value)
                  }}
                  placeholder={placeholder}
                  step={step}
                  getInputRef={ref}
                  value={value}
                  thousandSeparator
                  valueIsNumericString
                  prefix="$"
                />
                {errors && (
                  <div className="text-red-600 text-base absolute inline-block right-2 top-3">
                    <AiFillCloseCircle />
                  </div>
                )}
              </div>
              {addonAfter && (
                <div className="flex items-center px-3 text-sm text-gray-400 bg-gray-100 border border-l-0 border-gray-300 rounded-r-sm">
                  {addonAfter}
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
