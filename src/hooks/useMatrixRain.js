import { useEffect, useRef } from 'react'

export default function useMatrixRain(canvasRef) {
  const dropsRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const chars = 'ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let cols = 0
    let fontSize = 16
    let animId

    function resize() {
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w
      canvas.height = h
      fontSize = Math.max(14, Math.round(w / 70))
      cols = Math.ceil(w / fontSize)
      dropsRef.current = []
      for (let i = 0; i < cols; i++) dropsRef.current[i] = Math.random() * -50
    }

    resize()
    window.addEventListener('resize', resize)

    let last = 0
    const frameInterval = 1000 / 24

    function draw(ts) {
      animId = requestAnimationFrame(draw)
      if (ts - last < frameInterval) return
      last = ts

      const w = canvas.width
      const h = canvas.height
      ctx.fillStyle = 'rgba(0, 0, 0, 0.09)'
      ctx.fillRect(0, 0, w, h)
      ctx.font = fontSize + "px 'JetBrains Mono', monospace"
      ctx.textBaseline = 'top'
      ctx.fillStyle = '#00ff41'
      ctx.globalAlpha = 0.3

      const drops = dropsRef.current
      for (let i = 0; i < cols; i++) {
        if (Math.random() > 0.97) continue
        const x = i * fontSize
        const y = drops[i] * fontSize
        const ch = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(ch, x, y)
        if (y > h && Math.random() > 0.975) drops[i] = 0
        else drops[i] += 0.5 + Math.random() * 0.7
      }
    }

    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [canvasRef])
}
