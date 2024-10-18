import { Controller } from 'react-hook-form'
import { AiFillCloseCircle, AiOutlineQuestionCircle } from 'react-icons/ai'

import { Tooltip } from '../tooltip/tooltip'

type Props = {
  control: any
  disabled?: boolean
  errors?: string
  help?: string
  label: React.ReactNode
  name: string
  onChange?: (value: string) => void
  placeholder?: string
}

export const FormTextArea: React.FC<Props> = (props) => {
  const { control, disabled, errors, help, label, name, onChange, placeholder } = props

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange: onControllerChange, onBlur, value, name: inputName, ref } }) => {
        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          onControllerChange(e.target.value)
          onChange?.(e.target.value)
        }
        const borderColor = errors ? 'border-red-500' : 'border-gray-300'

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
            <div className="relative flex">
              <textarea
                className={`block w-full text-sm p-2 text-gray-900 placeholder:text-gray-300 bg-white border ${borderColor} rounded-sm focus:outline-none focus:border-midnight-blue focus:ring-midnight-blue/30`}
                data-testid={inputName}
                disabled={disabled ?? false}
                id={inputName}
                name={inputName}
                onBlur={onBlur}
                onChange={handleChange}
                placeholder={placeholder}
                ref={ref}
                rows={4}
                value={value}
              />
              {errors && (
                <span className="text-red-600 text-base absolute inline-block right-2 top-3">
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
