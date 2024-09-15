import { ReportDateFilter } from 'shared-types'

export const mapReportDateFilter = (reportDateFilter: ReportDateFilter) => {
  switch (reportDateFilter) {
    case ReportDateFilter.Weekly:
      return 'Weekly'
    case ReportDateFilter.Monthly:
      return 'Monthly'
    case ReportDateFilter.Quarterly:
      return 'Quarterly'
    case ReportDateFilter.Yearly:
      return 'Yearly'
  }
}

export const mapReportDateFilterShort = (reportDateFilter: ReportDateFilter) => {
  switch (reportDateFilter) {
    case ReportDateFilter.Weekly:
      return 'Week'
    case ReportDateFilter.Monthly:
      return 'Month'
    case ReportDateFilter.Quarterly:
      return 'Quarter'
    case ReportDateFilter.Yearly:
      return 'Year'
  }
}
