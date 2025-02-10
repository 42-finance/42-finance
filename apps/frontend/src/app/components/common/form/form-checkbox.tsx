import { Controller } from 'react-hook-form'
import { AiOutlineQuestionCircle } from 'react-icons/ai'

import { Tooltip } from '../tooltip/tooltip'

type Props = {
  control: any
  disabled?: boolean
  errors?: string
  help?: string
  label: string
  name: string
  onChange?: (value: boolean) => void
}

export const FormCheckbox: React.FC<Props> = (props) => {
  const { control, disabled, errors, help, label, name, onChange } = props

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange: onControllerChange, value, name: inputName, ref } }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          onControllerChange(e.target.checked)
          onChange?.(e.target.checked)
        }

        const borderColor = errors ? 'border-red-500' : 'border-gray-300'

        return (
          <div>
            <div className="flex items-center">
              <input
                checked={value}
                className={`w-4 h-4 ${borderColor} text-midnight-blue bg-white rounded-sm border-gray-300 focus:outline-hidden focus:ring-offset-0 focus:border-midnight-blue focus:ring-midnight-blue/30`}
                data-testid={inputName}
                disabled={disabled ?? false}
                id={inputName}
                name={inputName}
                onChange={handleChange}
                ref={ref}
                type="checkbox"
              />
              <label className="ml-2" htmlFor={inputName}>
                {label}
              </label>
              {help && (
                <Tooltip className="ml-1 text-base text-gray-400" color="bg-midnight-blue" body={help}>
                  <span data-testid={`${inputName}-tooltip`}>
                    <AiOutlineQuestionCircle />
                  </span>
                </Tooltip>
              )}
            </div>
            <div className="text-red-600 text-xs min-h-[30px] mt-1">{errors}</div>
          </div>
        )
      }}
    />
  )
}
