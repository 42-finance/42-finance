import { mapAmountFilter, mapTransactionAmountType } from 'frontend-utils'
import React from 'react'
import Select, { createFilter } from 'react-select'
import { AmountFilter, TransactionAmountType } from 'shared-types'

import { useUserTokenContext } from '../../contexts/user-token.context'
import { CurrencyInput } from '../common/currency-input'

type AmountTypeSelectOption = {
  value: TransactionAmountType
  label: string
}

type AmountFilterSelectOption = {
  value: AmountFilter
  label: string
}

type Props = {
  amountType: TransactionAmountType
  amountFilter: AmountFilter
  amountValue: number | undefined | null
  amountValue2: number | undefined | null
  onChange: (
    amountType: TransactionAmountType | undefined | null,
    amountFilter: AmountFilter | undefined | null,
    amountValue: number | undefined | null,
    amountValue2: number | undefined | null
  ) => void
}

export const TransactionAmountFilter: React.FC<Props> = ({
  amountType,
  amountFilter,
  amountValue,
  amountValue2,
  onChange
}) => {
  const { currencyCode } = useUserTokenContext()

  const amountTypeOptions = Object.values(TransactionAmountType).map((a) => ({
    value: a,
    label: mapTransactionAmountType(a)
  }))

  const amountFilterOptions = Object.values(AmountFilter).map((a) => ({
    value: a,
    label: mapAmountFilter(a)
  }))

  return (
    <div className="flex">
      <div className="min-w-[100px]">
        <Select<AmountTypeSelectOption>
          className="react-select-addon-before"
          classNamePrefix={'react-select'}
          filterOption={createFilter({
            ignoreAccents: false,
            matchFrom: 'any',
            stringify: (option) => `${option.label}`
          })}
          onChange={(option) => onChange(option?.value, amountFilter, amountValue, amountValue2)}
          options={amountTypeOptions}
          value={amountTypeOptions.filter((o) => o.value === amountType) || null}
        />
      </div>
      <div className="min-w-[130px]">
        <Select<AmountFilterSelectOption>
          className="react-select-addon-middle"
          classNamePrefix={'react-select'}
          filterOption={createFilter({
            ignoreAccents: false,
            matchFrom: 'any',
            stringify: (option) => `${option.label}`
          })}
          onChange={(option) => onChange(amountType, option?.value, amountValue, amountValue2)}
          options={amountFilterOptions}
          value={amountFilterOptions.filter((o) => o.value === amountFilter) || null}
        />
      </div>
      <CurrencyInput
        onChange={(e) => onChange(amountType, amountFilter, Number(e.target.value), amountValue2)}
        placeholder={amountFilter === AmountFilter.Between ? 'Minimum' : 'Amount'}
        className={`${amountFilter === AmountFilter.Between ? '' : 'rounded-r-sm'} border text-sm p-2 bg-white text-gray-900 placeholder:text-dark-greyish-blue focus:outline-none focus:border-midnight-blue focus:ring-midnight-blue/30`}
        value={amountValue?.toString() ?? ''}
        currencyCode={currencyCode}
      />
      {amountFilter === AmountFilter.Between && (
        <CurrencyInput
          onChange={(e) => onChange(amountType, amountFilter, amountValue, Number(e.target.value))}
          placeholder="Maximum"
          className={`rounded-r-sm border border-l-0 focus:border-l focus:-ml-[1px] text-sm p-2 bg-white text-gray-900 placeholder:text-dark-greyish-blue focus:outline-none focus:border-midnight-blue focus:ring-midnight-blue/30`}
          value={amountValue2?.toString() ?? ''}
          currencyCode={currencyCode}
        />
      )}
    </div>
  )
}
