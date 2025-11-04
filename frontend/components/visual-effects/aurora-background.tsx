"use client"

import { useEffect, useRef } from "react"

export default function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    // Aurora gradient animation
    let animationId: number
    let time = 0

    const animate = () => {
      time += 0.005
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      
      // Create dynamic gradient colors based on theme
      const isDark = document.documentElement.classList.contains("dark")
      
      if (isDark) {
        // Dark mode: ocean blues and cyans
        gradient.addColorStop(0, `rgba(59, 130, 246, ${0.1 + Math.sin(time) * 0.05})`)
        gradient.addColorStop(0.5, `rgba(14, 165, 233, ${0.08 + Math.cos(time * 1.2) * 0.04})`)
        gradient.addColorStop(1, `rgba(6, 182, 212, ${0.06 + Math.sin(time * 0.8) * 0.03})`)
      } else {
        // Light mode: softer blues
        gradient.addColorStop(0, `rgba(59, 130, 246, ${0.05 + Math.sin(time) * 0.02})`)
        gradient.addColorStop(0.5, `rgba(14, 165, 233, ${0.04 + Math.cos(time * 1.2) * 0.02})`)
        gradient.addColorStop(1, `rgba(6, 182, 212, ${0.03 + Math.sin(time * 0.8) * 0.01})`)
      }

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add some organic blob shapes
      ctx.globalAlpha = 0.3
      for (let i = 0; i < 3; i++) {
        const x = (canvas.width / 4) * (i + 1) + Math.sin(time + i) * 100
        const y = canvas.height / 2 + Math.cos(time * 0.8 + i) * 150
        const radius = 200 + Math.sin(time * 1.5 + i) * 50

        const blobGradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
        blobGradient.addColorStop(0, isDark 
          ? `rgba(59, 130, 246, ${0.2 + Math.sin(time + i) * 0.1})`
          : `rgba(59, 130, 246, ${0.1 + Math.sin(time + i) * 0.05})`)
        blobGradient.addColorStop(1, "transparent")

        ctx.fillStyle = blobGradient
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40 dark:opacity-30"
      style={{ mixBlendMode: "multiply" }}
    />
  )
}



