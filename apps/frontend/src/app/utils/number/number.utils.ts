export const range = (start: number, end: number, step: number = 1): number[] =>
  Array.from({ length: (end - start) / step + 1 }, (_, i) => start + i * step)
