import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { useEffect, useRef, useState } from 'react'
import { Controller } from 'react-hook-form'
import { AiFillCloseCircle } from 'react-icons/ai'

type Props = {
  addonAfter?: React.ReactNode
  control: any
  errors?: string
  label?: React.ReactNode
  name: string
  onChange?: (value: string) => void
}

export const FormEmoji: React.FC<Props> = (props) => {
  const { addonAfter, control, errors, label, name, onChange } = props

  const [showEmojiBoard, setShowEmojiBoard] = useState(false)
  const ref = useRef<any>()

  useEffect(() => {
    const onMouseDown = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowEmojiBoard(false)
      }
    }

    document.addEventListener('mousedown', onMouseDown)

    return () => {
      document.removeEventListener('mousedown', onMouseDown)
    }
  }, [])

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange: onControllerChange, value, name: inputName } }) => {
        const handleChange = (value: string) => {
          onControllerChange(value)
          onChange?.(value)
        }

        const rounded = addonAfter ? 'rounded-none rounded-l-[4px]' : 'rounded-[4px]'
        const borderColor = errors ? 'border-red-500' : showEmojiBoard ? 'border-black' : 'border-cool-grey'

        return (
          <div data-testid={`form-item-${inputName}`} className="relative" ref={ref}>
            {label && (
              <label htmlFor={name} className="relative mb-1 flex items-center">
                {label}
              </label>
            )}
            <div className="flex">
              <div className="relative w-full">
                <div
                  onClick={() => setShowEmojiBoard((s) => !s)}
                  className={`h-[38px] block w-full text-base px-2 pt-1.5 bg-white text-gray-900 placeholder:text-dark-greyish-blue border ${borderColor} ${rounded} focus:outline-none focus:border-midnight-blue focus:ring-midnight-blue/30 disabled:bg-gray-100`}
                >
                  {value}
                </div>
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
            {showEmojiBoard && (
              <div className="absolute top-[65px] left-0 right-0 z-50">
                <Picker
                  data={data}
                  onEmojiSelect={(value: any) => {
                    handleChange(value.native)
                    setShowEmojiBoard(false)
                  }}
                  previewPosition="none"
                  dynamicWidth={true}
                />
              </div>
            )}
          </div>
        )
      }}
    />
  )
}
