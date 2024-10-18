import React from 'react'

import { Visibility } from '../../routes/transactions'
import { FilterSelect } from '../common/filter-select'

type Props = {
  value?: Visibility
  onChange: (visibility: Visibility) => void
}

export const VisibilityFilter: React.FC<Props> = ({ value, onChange }) => {
  const options = [
    { label: 'Hidden', value: Visibility.Hidden },
    { label: 'Visible', value: Visibility.Visible }
  ]

  return (
    <FilterSelect<string>
      name="Select Visibility"
      data={options}
      onChange={(v) => onChange(v as Visibility)}
      value={value}
      placeholder="Filter by visibility"
    />
  )
}
