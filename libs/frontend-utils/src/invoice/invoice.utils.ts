export const formatDollars = (value: number | null, decimals: number = 2) => {
  if (value == null) return '$0.00'
  return (
    '$' +
    Number(Math.abs(value).toFixed(2)).toLocaleString('en', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })
  )
}

export const formatDollarsSigned = (value: number | null, decimals: number = 2) => {
  if (value == null) return '$0.00'
  return (
    (value < 0 ? '-' : '') +
    '$' +
    Number(Math.abs(value).toFixed(2)).toLocaleString('en', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })
  )
}

export const formatPercentage = (value: number | null, decimals: number = 1) => {
  if (value == null) return '0.0%'
  return (
    Number(value.toFixed(2)).toLocaleString('en', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }) + '%'
  )
}
