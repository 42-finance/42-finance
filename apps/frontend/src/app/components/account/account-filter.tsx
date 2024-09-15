import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getAccounts } from 'frontend-api'
import { TagColor } from 'frontend-types'
import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import Select, { MultiValue, MultiValueProps, createFilter } from 'react-select'

import { Tag } from '../common/tag/tag'

type Props = {
  accountIds: string[] | undefined
  onChange: (accountIds: string[]) => void
}

type SelectOption = {
  value: string
  label: string
}

export const AccountsFilter: React.FC<Props> = ({ accountIds, onChange }) => {
  const { data: accounts, isFetching } = useQuery({
    queryKey: [ApiQuery.AccountsFilter],
    queryFn: async () => {
      const res = await getAccounts()
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
      <label className="sr-only" htmlFor="accounts-filter">
        Select Accounts
      </label>
      <Select<SelectOption, true>
        inputId="accounts-filter"
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
        options={accounts}
        placeholder="Filter by accounts"
        value={accounts?.filter((t) => accountIds?.includes(t.value)) || null}
      />
    </div>
  )
}
