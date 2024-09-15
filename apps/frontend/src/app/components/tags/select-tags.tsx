import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getTags } from 'frontend-api'
import { TagColor } from 'frontend-types'
import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import Select, { MultiValue, MultiValueProps, createFilter } from 'react-select'

import { Tag } from '../common/tag/tag'

type Props = {
  tagIds: number[] | undefined
  onChange: (tagIds: number[]) => void
}

type SelectOption = {
  value: number
  label: string
}

export const SelectTags: React.FC<Props> = ({ tagIds, onChange }) => {
  const { data: tags, isFetching } = useQuery({
    queryKey: [ApiQuery.Tags],
    queryFn: async () => {
      const res = await getTags()
      if (res.ok && res.parsedBody) {
        return res.parsedBody.payload.map((t) => ({
          value: t.id,
          label: t.name
        }))
      }
    },
    placeholderData: keepPreviousData
  })

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
      <Select<SelectOption, true>
        inputId="tags-select"
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
        options={tags}
        placeholder="Select tags..."
        value={tags?.filter((t) => tagIds?.includes(t.value)) || null}
      />
    </div>
  )
}
