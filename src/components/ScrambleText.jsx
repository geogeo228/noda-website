import { useRef, useCallback } from 'react'

const CHARS = '!<>-_\\/[]{}—=+*^?#________'

export default function ScrambleText({ text, as: Tag = 'span', className = '' }) {
  const elRef = useRef(null)
  const timeoutRef = useRef(null)

  const handleMouseEnter = useCallback(() => {
    const el = elRef.current
    if (!el) return

    let frame = 0
    const queue = text.split('').map((c) => ({
      from: c,
      to: c,
      start: Math.floor(Math.random() * 20),
      end: Math.floor(Math.random() * 30) + 20,
      char: '',
    }))

    function tick() {
      let output = ''
      let complete = 0
      for (let i = 0; i < queue.length; i++) {
        const q = queue[i]
        if (frame >= q.end) {
          complete++
          output += q.to
        } else if (frame >= q.start) {
          if (!q.char || Math.random() < 0.28)
            q.char = CHARS[Math.floor(Math.random() * CHARS.length)]
          output += q.char
        } else {
          output += q.from
        }
      }
      el.textContent = output
      if (complete === queue.length) return
      frame++
      timeoutRef.current = setTimeout(tick, 30)
    }
    tick()
  }, [text])

  const handleMouseLeave = useCallback(() => {
    clearTimeout(timeoutRef.current)
    if (elRef.current) elRef.current.textContent = text
  }, [text])

  return (
    <Tag
      ref={elRef}
      className={`scramble ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {text}
    </Tag>
  )
}
