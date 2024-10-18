export const roundDollars = (value: number) => {
  return Math.round(value * 100) / 100
}

export const randomInt = (min: number, max: number) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
