import { TextField } from '@mui/material'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getGroups } from 'frontend-api'
import { Transaction } from 'frontend-types'
import { useMemo, useState } from 'react'

import { CurrencyInput } from '../common/currency-input'
import { SelectGroup } from '../common/select/select-group'

type Props = {
  transaction: Transaction
  onEdit: (transaction: Transaction) => void
}

export const SplitTransactionItem: React.FC<Props> = ({ transaction, onEdit }) => {
  const [amount, setAmount] = useState<number | null>(transaction.amount)

  const { data: groups = [], isFetching: fetchingGroups } = useQuery({
    queryKey: [ApiQuery.Groups],
    queryFn: async () => {
      const res = await getGroups()
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  const groupItems = useMemo(
    () =>
      groups.map((g) => ({
        label: g.name,
        options: g.categories.map((c) => ({ label: `${c.icon} ${c.name}`, value: c.id }))
      })),
    [groups]
  )

  return (
    <div className="flex items-center justify-between px-5 py-2 border-b">
      <div>{transaction.merchant.name}</div>
      <SelectGroup
        options={groupItems}
        loading={fetchingGroups}
        value={transaction.categoryId}
        onChange={(value) => {
          if (value) {
            transaction.categoryId = value
            onEdit(transaction)
          }
        }}
      />
      <TextField
        variant="outlined"
        onChange={(e) => {
          setAmount(Number(e.target.value))
          transaction.amount = Number(e.target.value)
          onEdit(transaction)
        }}
        value={amount}
        InputProps={{
          inputComponent: CurrencyInput as any
        }}
        hiddenLabel
        size="small"
      />
    </div>
  )
}
