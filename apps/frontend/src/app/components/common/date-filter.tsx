import React from 'react'

import { SingleDatePicker } from './single-date-picker'

type Props = {
  title: string
  date: Date | undefined
  onChange: (date: Date | null) => void
}

export const DateFilter: React.FC<Props> = ({ title, date, onChange }) => {
  return (
    <div className="relative flex flex-wrap">
      <div className="flex items-center px-3 min-h-[32px] text-sm whitespace-nowrap text-gray-400 bg-gray-100 border border-r-0 border-gray-300 rounded-l-sm">
        {title}
      </div>
      <div className="relative">
        <SingleDatePicker onChange={onChange} placeholder="Filter by date" value={date ?? null} />
        {date && (
          <button
            type="button"
            aria-label="Clear filter"
            onClick={(e) => {
              e.preventDefault()
              onChange(null)
            }}
            className="absolute bg-white right-[1px] top-[1px] bottom-[1px] py-1.5 px-2 text-base text-gray-300 hover:text-gray-400 cursor-default"
          >
            <svg
              height="20"
              width="20"
              viewBox="0 0 20 20"
              aria-hidden="true"
              focusable="false"
              className="fill-current stroke-none"
            >
              <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
