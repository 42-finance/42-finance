import { Frequency } from 'shared-types'

export const mapFrequency = (frequency: Frequency) => {
  switch (frequency) {
    case Frequency.Daily:
      return 'Daily'
    case Frequency.Weekly:
      return 'Weekly'
    case Frequency.BiWeekly:
      return 'Bi-Weekly'
    case Frequency.SemiMonthly:
      return 'Semi-Monthly'
    case Frequency.MonthlyExactDay:
      return 'Monthly on the same day'
    case Frequency.MonthlyDayOfWeek:
      return 'Monthly on the same day of week'
    case Frequency.MonthlyLastDay:
      return 'Monthly on the last day'
    case Frequency.MonthlyLastWeekday:
      return 'Monthly on the last day of week'
    case Frequency.Quarterly:
      return 'Quarterly'
    case Frequency.BiMonthly:
      return 'Bi-Monthly'
    case Frequency.YearlyExactDay:
      return 'Yearly on the same day'
    case Frequency.YearlyDayOfWeek:
      return 'Yearly on the day of week'
    case Frequency.FixedInterval:
      return 'Fixed interval'
  }
}
