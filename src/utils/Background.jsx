import { useEffect, useRef } from 'react'
/**
 * Reusable dotted background.
 *
 * Usage:
 *   import Background from '../utils/Background'
 *
 *   <section className="relative">
 *     <Background />
 *     ...your content (give it relative z-10 if needed)
 *   </section>
 *
 * Props:
 *   density  dots per 10,000 px² of area (default 0.9)
 *   colors   array of CSS colours the dots pick from
 *   speed    drift speed, 0 = still (default 1)
 *   fixed    true = covers the whole viewport and stays put while scrolling
 *   className extra classes for the canvas
 */
export default function Background({
  density = 0.9,
  colors = ['#ffffff', '#FF4DB8', '#E6007E'],
  speed = 1,
  fixed = false,
  className = ''
}) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let dots = []
    let w = 0
    let h = 0
    let raf
    let visible = true

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = Math.round(((w * h) / 10000) * density)
      dots = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.4 + Math.random() * 1.3,
        c: colors[Math.floor(Math.random() * colors.length)],
        v: 0.1 + Math.random() * 0.35,
        ph: Math.random() * 6.28,
        tw: 0.6 + Math.random() * 1.6
      }))
    }

    const ro = new ResizeObserver(build)
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(canvas)
    build()

    let last = performance.now()
    const frame = (now) => {
      raf = requestAnimationFrame(frame)
      if (!visible) return
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      ctx.clearRect(0, 0, w, h)
      for (const d of dots) {
        if (!reduced && speed) {
          d.y -= d.v * speed * dt * 20
          if (d.y < -2) {
            d.y = h + 2
            d.x = Math.random() * w
          }
        }
        const a = reduced ? 0.7 : 0.35 + 0.65 * Math.abs(Math.sin((now / 1000) * d.tw + d.ph))
        ctx.globalAlpha = a
        ctx.fillStyle = d.c
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, 6.2832)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [density, speed, colors])

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none ${fixed ? 'fixed' : 'absolute'} inset-0 z-0 h-full w-full ${className}`}
    />
  )
}
