'use client'
import { useEffect, useRef } from 'react'

export default function SakuraPetals({ count = 18 }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const colors = ['#c0392b', '#d4547a', '#e07070', '#f5b8b8', '#b03060', '#e8a0a0']
    const petals = []

    for (let i = 0; i < count; i++) {
      const petal = document.createElement('div')
      const size = 6 + Math.random() * 8
      const duration = 5 + Math.random() * 7
      const delay = Math.random() * 8
      const startX = Math.random() * 100
      const drift = (Math.random() - 0.5) * 120
      const color = colors[Math.floor(Math.random() * colors.length)]
      const rotation = Math.random() * 360

      petal.style.cssText = `
        position: absolute;
        left: ${startX}%;
        top: -20px;
        width: ${size}px;
        height: ${size * 0.65}px;
        background: ${color};
        border-radius: ${size}px ${size * 0.3}px ${size * 0.3}px ${size}px;
        opacity: 0;
        pointer-events: none;
        animation: sakuraFall ${duration}s ${delay}s linear infinite;
        --drift: ${drift}px;
        --rot: ${rotation}deg;
        filter: blur(0.3px);
      `
      container.appendChild(petal)
      petals.push(petal)
    }

    return () => petals.forEach(p => p.remove())
  }, [count])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  )
}