import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getGroups } from 'frontend-api'
import { TagColor } from 'frontend-types'
import React, { useMemo } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import Select, { MultiValue, MultiValueProps, createFilter } from 'react-select'

import { Tag } from '../common/tag/tag'

type Props = {
  categoryIds: number[] | undefined
  onChange: (categoryIds: number[]) => void
}

type SelectOption = {
  value: number
  label: string
}

export const CategoryFilter: React.FC<Props> = ({ categoryIds, onChange }) => {
  const { data: groups = [], isFetching } = useQuery({
    queryKey: [ApiQuery.CategoriesFilter],
    queryFn: async () => {
      const res = await getGroups()
      if (res.ok && res.parsedBody) {
        return res.parsedBody.payload
      }
    },
    placeholderData: keepPreviousData
  })

  const options = useMemo(
    () =>
      groups.map((g) => ({
        label: g.name,
        options: g.categories.map((c) => ({ label: `${c.icon} ${c.name}`, value: c.id }))
      })),
    [groups]
  )

  const handleChange = (values: MultiValue<SelectOption> | undefined) => {
    onChange(values?.map((t) => t.value) || [])
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
    <div className="min-w-[200px]">
      <label className="sr-only" htmlFor="categories-filter">
        Select Categories
      </label>
      <Select<SelectOption, true>
        inputId="categories-filter"
        classNamePrefix={'react-select'}
        components={{ MultiValue: MV }}
        filterOption={createFilter({
          ignoreAccents: false,
          matchFrom: 'any',
          stringify: (option) => `${option.label}`
        })}
        isLoading={isFetching}
        isMulti
        onChange={handleChange}
        options={options}
        placeholder="Filter by categories"
        value={options?.flatMap((o) => o.options).filter((t) => categoryIds?.includes(t.value)) || null}
      />
    </div>
  )
}
