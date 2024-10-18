import { Listbox } from '@headlessui/react'
import { TagColor } from 'frontend-types'
import React, { useState } from 'react'
import { BiFilterAlt } from 'react-icons/bi'
import { FaCheckSquare, FaRegSquare } from 'react-icons/fa'

import { Badge } from './badge'

export enum FilterType {
  Accounts = 'accounts',
  Categories = 'categories',
  Merchants = 'merchants',
  StartDate = 'startDate',
  EndDate = 'endDate',
  Visibility = 'visibility',
  ReviewStatus = 'reviewStatus',
  Amount = 'amount'
}

type Props = {
  filters: { [key: string]: boolean }
  onChange: (title: FilterType, isVisible: boolean) => void
}

const mapFilterToName = (filter: FilterType) => {
  switch (filter) {
    case FilterType.Accounts:
      return 'Accounts'
    case FilterType.Categories:
      return 'Categories'
    case FilterType.Merchants:
      return 'Merchants'
    case FilterType.StartDate:
      return 'Start Date'
    case FilterType.EndDate:
      return 'End Date'
    case FilterType.Visibility:
      return 'Visibility'
    case FilterType.ReviewStatus:
      return 'Review Status'
    case FilterType.Amount:
      return 'Amount'
  }
}

export const FilterPicker: React.FC<Props> = ({ filters, onChange }) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>(
    Object.keys(filters)?.filter((filter) => filters[filter] === true)
  )

  const handleChange = (values: string[] | undefined) => {
    setSelectedFilters(values || [])
    Object.keys(filters)?.forEach((filter) => {
      if (filters[filter] && !values?.includes(filter)) {
        onChange(filter as FilterType, false)
      } else if (!filters[filter] && values?.includes(filter)) {
        onChange(filter as FilterType, true)
      }
    })
  }

  return (
    <Listbox value={selectedFilters} onChange={handleChange} multiple>
      <div className="relative min-w-[160px]">
        <Listbox.Button className="h-[40px] relative w-full text-left cursor-default whitespace-nowrap text-gray-900 pl-1 pr-7 pt-1.5 pb-1 rounded-[4px] bg-white border border-gray-300  transition-all group focus:outline-none focus:ring-1 focus:border-midnight-blue focus:ring-midnight-blue/30">
          <div className="flex items-center px-1.5">
            <BiFilterAlt className="mr-1 text-lg text-gray-600" />
            <div className="flex w-full justify-between">
              <div>Filters</div>
              <div className="grow" />
              {selectedFilters.length > 0 && <Badge color={TagColor.White}>{selectedFilters.length}</Badge>}
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center px-1 border-l border-gray-300 my-2 fill-gray-300 hover:fill-gray-400">
              <svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z" />
              </svg>
            </div>
          </div>
        </Listbox.Button>
        <Listbox.Options className="absolute z-50 max-h-72 left-0 mt-1 py-1 w-full overflow-auto bg-white border border-gray-300 rounded-sm shadow-lg focus:outline-none">
          {Object.keys(filters).map((f, i) => (
            <Listbox.Option
              key={i}
              className={({ active }) =>
                `relative cursor-default select-none py-2 pl-8 pr-4 ${
                  active ? 'bg-midnight-blue/10 text-gray-900' : 'text-gray-900'
                }`
              }
              value={f}
            >
              {({ selected }) => (
                <>
                  <div className={`block truncate ${selected ? 'text-midnight-blue' : 'text-auto'}`}>
                    {mapFilterToName(f as FilterType)}
                  </div>
                  {selected ? (
                    <div className="absolute inset-y-0 left-0 flex items-center pl-2 text-midnight-blue">
                      <FaCheckSquare aria-hidden="true" />
                    </div>
                  ) : (
                    <div className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400">
                      <FaRegSquare aria-hidden="true" />
                    </div>
                  )}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  )
}
