export const getInitials = (name: string) => {
  const allNames = name.trim().split(' ')
  return allNames.reduce((acc, curr, index) => {
    if (index === 0 || index === allNames.length - 1) {
      acc = `${acc}${curr.charAt(0).toUpperCase()}`
    }
    return acc
  }, '')
}

export const getFirstName = (name: string) => {
  return name.trim().split(' ')[0]
}
