import * as SecureStore from 'expo-secure-store'
import { useState } from 'react'

export function useLocalStorage(key: string): [string | null, (value: string | null) => void] {
  const [storedValue, setStoredValue] = useState<string | null>(null)

  const setValue = async (value: string | null) => {
    try {
      setStoredValue(value)
      if (value) {
        await SecureStore.setItemAsync(key, value)
      } else {
        await SecureStore.deleteItemAsync(key)
      }
    } catch (err) {
      console.error(err)
    }
  }
  return [storedValue, setValue]
}
