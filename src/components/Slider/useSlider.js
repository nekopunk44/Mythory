import { useCallback, useEffect, useRef, useState } from 'react'

const useSlider = () => {
  const trackRef = useRef(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const updateState = useCallback(() => {
    const track = trackRef.current
    if (!track) return

    const maxScrollLeft = track.scrollWidth - track.clientWidth
    setCanPrev(track.scrollLeft > 0)
    setCanNext(track.scrollLeft < maxScrollLeft)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    updateState()

    track.addEventListener('scroll', updateState, { passive: true })

    const observer = new ResizeObserver(updateState)
    observer.observe(track)

    return () => {
      track.removeEventListener('scroll', updateState)
      observer.disconnect()
    }
  }, [updateState])

  const scrollByPage = useCallback((direction) => {
    const track = trackRef.current
    if (!track) return

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    track.scrollBy({
      left: direction === 'prev' ? -track.clientWidth : track.clientWidth,
      behavior: reducedMotion ? 'auto' : 'smooth',
    })
  }, [])

  const prev = useCallback(() => scrollByPage('prev'), [scrollByPage])
  const next = useCallback(() => scrollByPage('next'), [scrollByPage])

  return { trackRef, canPrev, canNext, prev, next }
}

export default useSlider
