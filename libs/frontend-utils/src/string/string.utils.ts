export const capitalizeFirstLetter = (value: string | null) => {
  if (value == null) return ''
  return value
    .split(' ')
    .map((word) => {
      return word[0].toUpperCase() + word.substring(1)
    })
    .join(' ')
}
