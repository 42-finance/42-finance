import * as SecureStore from 'expo-secure-store'
import { useState } from 'react'

export const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = SecureStore.getItem(key)
      return item != null ? JSON.parse(item) : initialValue
    } catch (err) {
      console.error(err)
      return initialValue
    }
  })

  const setValue = (value: T) => {
    try {
      setStoredValue(value)
      SecureStore.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.error(err)
    }
  }

  return [storedValue, setValue]
}
