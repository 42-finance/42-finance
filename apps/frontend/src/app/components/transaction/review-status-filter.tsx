import React from 'react'

import { ReviewStatus } from '../../routes/transactions'
import { FilterSelect } from '../common/filter-select'

type Props = {
  value?: ReviewStatus
  onChange: (reviewStatus: ReviewStatus) => void
}

export const ReviewStatusFilter: React.FC<Props> = ({ value, onChange }) => {
  const options = [
    { label: 'Needs review', value: ReviewStatus.NeedsReview },
    { label: 'Reviewed', value: ReviewStatus.Reviewed }
  ]

  return (
    <FilterSelect<string>
      name="Select Review Status"
      data={options}
      onChange={(v) => onChange(v as ReviewStatus)}
      value={value}
      placeholder="Filter by review status"
    />
  )
}
