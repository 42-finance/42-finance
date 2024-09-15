import { useRef, useState, useEffect } from 'react'

export function useScrollLeft<T extends HTMLElement>() {
  const scrollRef = useRef<T>(null)

  const [scrollLeft, setScrollLeft] = useState(0)
  const [maxScroll, setMaxScroll] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      if (scrollRef.current) {
        setScrollLeft(Math.round(scrollRef.current.scrollLeft))
        setMaxScroll(
          Math.round(
            scrollRef.current.scrollWidth - scrollRef.current.clientWidth
          )
        )
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [scrollRef.current])

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setScrollLeft(Math.round(scrollRef.current.scrollLeft))
        setMaxScroll(
          Math.round(
            scrollRef.current.scrollWidth - scrollRef.current.clientWidth
          )
        )
      }
    }
    scrollRef.current?.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => scrollRef.current?.removeEventListener('scroll', handleScroll)
  }, [scrollRef.current])

  return { scrollLeft, maxScroll, scrollRef }
}
