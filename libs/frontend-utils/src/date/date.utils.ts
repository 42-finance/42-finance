import { addMinutes, differenceInDays, format as f, startOfDay, subMinutes } from 'date-fns'

export const formatDateInUtc = (date: Date, format: string) => {
  return f(addMinutes(date, date.getTimezoneOffset()), format)
}

export const dateToUtc = (date: Date) => {
  return subMinutes(date, date.getTimezoneOffset())
}

export const dateToLocal = (date: Date) => {
  return addMinutes(date, date.getTimezoneOffset())
}

export const startOfDayUtc = (date: Date) => {
  return dateToUtc(startOfDay(dateToUtc(date)))
}

export const formatDateDifference = (date: Date) => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diffInSeconds < 60) {
    return 'just now'
  } else if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60)
    return `${mins} minute${mins > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 86_400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 2_592_000) {
    const days = Math.floor(diffInSeconds / 86_400)
    return `${days} day${days > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 31_536_000) {
    const months = Math.floor(diffInSeconds / 2_592_000)
    return `${months} month${months > 1 ? 's' : ''} ago`
  } else {
    const years = Math.floor(diffInSeconds / 31_536_000)
    return `${years} year${years > 1 ? 's' : ''} ago`
  }
}

export const todayInUtc = () => {
  const today = startOfDay(new Date())
  return subMinutes(today, today.getTimezoneOffset())
}

export const formatInvoiceDueDate = (date: Date) => {
  const today = todayInUtc()
  const dueInDays = differenceInDays(date, today)
  if (dueInDays < -1) {
    return `Due ${Math.abs(dueInDays)} days ago`
  } else if (dueInDays === -1) {
    return 'Due 1 day ago'
  } else if (dueInDays === 0) {
    return `Due today`
  } else if (dueInDays === 1) {
    return `Due in ${dueInDays} day`
  } else {
    return `Due in ${dueInDays} days`
  }
}

export const getDateSuffix = (date: number) => {
  const j = date % 10
  const k = date % 100
  if (j === 1 && k !== 11) {
    return `${date}st`
  }
  if (j === 2 && k !== 12) {
    return `${date}nd`
  }
  if (j === 3 && k !== 13) {
    return `${date}rd`
  }
  return `${date}th`
}
