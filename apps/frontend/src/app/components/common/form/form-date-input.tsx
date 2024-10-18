import { format } from 'date-fns'
import * as React from 'react'
import DatePicker from 'react-datepicker'
import { Controller } from 'react-hook-form'
import { AiFillCloseCircle, AiOutlineCalendar, AiOutlineQuestionCircle } from 'react-icons/ai'
import { TbChevronLeft, TbChevronRight } from 'react-icons/tb'

import { Tooltip } from '../tooltip/tooltip'

export type Props = {
  control: any
  disabled?: boolean
  defaultPickerValue?: Date
  errors?: string
  help?: string | React.ReactNode
  label?: string | React.ReactNode
  maxDate?: Date
  minDate?: Date
  name: string
}

export const FormDateInput: React.FC<Props> = (props) => {
  const { control, disabled, errors, help, label, maxDate, minDate, name } = props

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange: onControllerChange, value, name: inputName } }) => {
        const handleChange = (date: Date | null) => {
          onControllerChange(date)
        }

        const monthBtn =
          'inline-flex p-1 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-sm hover:border-lighter-green focus:outline-none focus:border-midnight-blue focus:ring-midnight-blue/30'
        const monthBtnDisabled =
          'inline-flex p-1 text-sm font-medium text-gray-100 bg-white border border-gray-200 rounded-sm cursor-not-allowed opacity-50'

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
            <div data-testid={inputName} className="flex">
              <div className="relative w-full">
                <DatePicker
                  dateFormat="PP"
                  disabled={disabled}
                  maxDate={maxDate}
                  minDate={minDate}
                  name={inputName}
                  nextMonthButtonLabel=">"
                  onChange={handleChange}
                  popperClassName="react-datepicker-left"
                  previousMonthButtonLabel="<"
                  selected={value}
                  selectsStart
                  todayButton="Today"
                  renderCustomHeader={({
                    date,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled
                  }) => (
                    <div className="flex items-center justify-between px-2 py-2">
                      <span className="text-lg text-gray-900">{format(date, 'MMMM yyyy')}</span>
                      <div className="space-x-2">
                        <button
                          aria-label="Previous month"
                          onClick={decreaseMonth}
                          disabled={prevMonthButtonDisabled}
                          type="button"
                          className={prevMonthButtonDisabled ? monthBtnDisabled : monthBtn}
                        >
                          <TbChevronLeft className="w-5 h-5 text-gray-500" />
                        </button>
                        <button
                          aria-label="Next month"
                          onClick={increaseMonth}
                          disabled={nextMonthButtonDisabled}
                          type="button"
                          className={nextMonthButtonDisabled ? monthBtnDisabled : monthBtn}
                        >
                          <TbChevronRight className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  )}
                />
                {errors && (
                  <span className="text-red-600 text-base absolute inline-block right-2 top-3">
                    <AiFillCloseCircle />
                  </span>
                )}
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <AiOutlineCalendar className="text-lg text-gray-600" />
                </span>
              </div>
            </div>
            <div className="text-red-600 text-xs min-h-[30px] mt-1">{errors}</div>
          </div>
        )
      }}
    />
  )
}
