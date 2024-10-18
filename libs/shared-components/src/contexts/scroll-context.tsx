import { PropsWithChildren, createContext, useEffect, useMemo, useState } from 'react'

export namespace ScrollContext {
  export type Value = {
    yScrollPosition: number
  }
}

export const ScrollContext = createContext({
  yScrollPosition: 0
} as ScrollContext.Value)

// Provider component
export const ScrollProvider = ({ children }: PropsWithChildren) => {
  const [yScrollPosition, setYScrollPosition] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setYScrollPosition(window.scrollY)
      console.log(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const value = useMemo<ScrollContext.Value>(
    () => ({
      yScrollPosition
    }),
    [yScrollPosition]
  )

  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
}
