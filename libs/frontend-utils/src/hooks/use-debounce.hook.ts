import { useState } from 'react'

export const useDebounce = (defaultValue: string, delay: number = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(defaultValue)
  const [timeoutHandler, setTimeoutHandler] = useState<NodeJS.Timeout | null>(null)

  const setValue = (value: string) => {
    if (timeoutHandler) clearTimeout(timeoutHandler)
    setTimeoutHandler(setTimeout(() => setDebouncedValue(value), delay))
  }

  return [debouncedValue, setValue] as [string, (value: string) => void]
}
