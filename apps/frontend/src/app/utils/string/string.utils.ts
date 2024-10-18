export const capitalizeFirstLetter = (str: string | null) =>
  !str ? '' : str.charAt(0).toUpperCase() + str.slice(1)
