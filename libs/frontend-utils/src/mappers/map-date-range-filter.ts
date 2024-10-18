import { subMonths } from 'date-fns'
import { DateRangeFilter } from 'shared-types'

import { todayInUtc } from '../date/date.utils'

export const mapDateRangeFilter = (dateFilter: DateRangeFilter) => {
  switch (dateFilter) {
    case DateRangeFilter.OneMonth:
      return '1M'
    case DateRangeFilter.ThreeMonth:
      return '3M'
    case DateRangeFilter.SixMonth:
      return '6M'
    case DateRangeFilter.OneYear:
      return '1Y'
    case DateRangeFilter.AllTime:
      return 'All'
  }
}

export const mapDateRangeFilterFull = (dateFilter: DateRangeFilter) => {
  switch (dateFilter) {
    case DateRangeFilter.OneMonth:
      return '1 month'
    case DateRangeFilter.ThreeMonth:
      return '3 months'
    case DateRangeFilter.SixMonth:
      return '6 months'
    case DateRangeFilter.OneYear:
      return '1 year'
    case DateRangeFilter.AllTime:
      return 'All Time'
  }
}

export const mapDateRangeToDate = (dateFilter: DateRangeFilter) => {
  const today = todayInUtc()

  switch (dateFilter) {
    case DateRangeFilter.OneMonth:
      return subMonths(today, 1)
    case DateRangeFilter.ThreeMonth:
      return subMonths(today, 3)
    case DateRangeFilter.SixMonth:
      return subMonths(today, 6)
    case DateRangeFilter.OneYear:
      return subMonths(today, 12)
    case DateRangeFilter.AllTime:
      return new Date(0)
  }
}
