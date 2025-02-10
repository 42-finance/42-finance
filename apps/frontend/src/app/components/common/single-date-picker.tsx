import { endOfDay, format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import DatePicker from 'react-datepicker'
import { AiOutlineCalendar } from 'react-icons/ai'
import { TbChevronLeft, TbChevronRight } from 'react-icons/tb'

import { EARLIEST_DATE_IN_SYSTEM } from '../../utils/date/date.utils'

type Props = {
  value: Date | null
  onChange: (date: Date | null) => void
  placeholder?: string
  showTimeInput?: boolean
}

export const SingleDatePicker: React.FC<Props> = ({ value, onChange, placeholder, showTimeInput }) => {
  const monthBtn =
    'inline-flex p-1 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-xs hover:border-lighter-green focus:outline-hidden focus:border-midnight-blue focus:ring-midnight-blue/30'
  const monthBtnDisabled =
    'inline-flex p-1 text-sm font-medium text-gray-100 bg-white border border-gray-200 rounded-xs cursor-not-allowed opacity-50'

  return (
    <div className="relative">
      <DatePicker
        dateFormat="PP"
        maxDate={endOfDay(toZonedTime(new Date().getTime(), 'etc/utc'))}
        minDate={EARLIEST_DATE_IN_SYSTEM}
        nextMonthButtonLabel=">"
        onChange={onChange}
        popperClassName="react-datepicker-left"
        previousMonthButtonLabel="<"
        selected={value}
        placeholderText={placeholder}
        todayButton="Today"
        showTimeInput={showTimeInput}
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
                type="button"
                aria-label="Previous month"
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                className={prevMonthButtonDisabled ? monthBtnDisabled : monthBtn}
              >
                <TbChevronLeft className="w-5 h-5 text-gray-500" />
              </button>
              <button
                type="button"
                aria-label="Next month"
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                className={nextMonthButtonDisabled ? monthBtnDisabled : monthBtn}
              >
                <TbChevronRight className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        )}
      />
      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <AiOutlineCalendar className="text-lg text-gray-600" />
      </span>
    </div>
  )
}
