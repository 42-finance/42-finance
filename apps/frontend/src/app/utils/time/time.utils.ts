export const getSecondsFromHHMMSS = (value?: string) => {
  if (value == null) {
    return 0
  }

  const [str1, str2, str3] = value.split(':')

  const val1 = Number(str1)
  const val2 = Number(str2)
  const val3 = Number(str3)

  if (!isNaN(val1) && isNaN(val2) && isNaN(val3)) {
    return val1
  }

  if (!isNaN(val1) && !isNaN(val2) && isNaN(val3)) {
    return val1 * 60 + val2
  }

  return !isNaN(val1) && !isNaN(val2) && !isNaN(val3)
    ? val1 * 60 * 60 + val2 * 60 + val3
    : 0
}

export const toHHMMSS = (secs: number) => {
  if (secs < 0) {
    return '00:00:00'
  }

  const secNum = parseInt(secs.toString(), 10)
  let hours: number | string = Math.floor(secNum / 3_600)
  let minutes: number | string = Math.floor(secNum / 60) % 60
  let seconds: number | string = secNum % 60

  if (hours < 10) {
    hours = `0${hours}`
  }
  if (minutes < 10) {
    minutes = `0${minutes}`
  }
  if (seconds < 10) {
    seconds = `0${seconds}`
  }
  return `${hours}:${minutes}:${seconds}`
}
