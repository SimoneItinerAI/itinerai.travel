import { useEffect, useRef, useState } from 'react'

export default function DestinationTypewriter() {
  const phrase = 'Dove vuoi andare?'
  const [text, setText] = useState('')
  const idxRef = useRef(0)
  const timersRef = useRef<number[]>([])

  useEffect(() => {
    const intervalMs = 70
    const holdMs = 2000
    let mounted = true
    const step = () => {
      if (!mounted) return
      if (idxRef.current < phrase.length) {
        idxRef.current += 1
        setText(phrase.slice(0, idxRef.current))
        timersRef.current.push(window.setTimeout(step, intervalMs))
      } else {
        timersRef.current.push(
          window.setTimeout(() => {
            idxRef.current = 0
            setText('')
            timersRef.current.push(window.setTimeout(step, intervalMs))
          }, holdMs)
        )
      }
    }
    step()
    return () => {
      mounted = false
      timersRef.current.forEach((t) => window.clearTimeout(t))
      timersRef.current = []
    }
  }, [])

  return (
    <p className="text-[clamp(1rem,2.2vw,1.25rem)] md:text-[clamp(1.1rem,2vw,1.5rem)] font-semibold text-white/90 text-center">
      <style>{`@keyframes blinkType{0%,45%{opacity:1}50%,100%{opacity:0}}@-webkit-keyframes blinkType{0%,45%{opacity:1}50%,100%{opacity:0}}`}</style>
      {text}
      <span className="inline-block w-[1ch] align-[-0.1em]" style={{ animation: 'blinkType 1s steps(1, end) infinite' }}>|</span>
    </p>
  )
}