"use client"

import { useEffect, useRef } from "react"

interface Bubble {
  x: number
  y: number
  radius: number
  speed: number
  wobble: number
  wobbleSpeed: number
  opacity: number
}

export default function OceanBackground() {
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

    // Create bubbles
    const bubbles: Bubble[] = []
    const bubbleCount = Math.floor((canvas.width * canvas.height) / 15000) // Responsive bubble count
    
    for (let i = 0; i < bubbleCount; i++) {
      bubbles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height + canvas.height, // Start below screen
        radius: Math.random() * 6 + 2, // 2-8px
        speed: Math.random() * 0.5 + 0.3, // 0.3-0.8
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.02 + 0.01,
        opacity: Math.random() * 0.4 + 0.3, // 0.3-0.7
      })
    }

    // Create light rays
    const rays: { x: number; width: number; opacity: number; speed: number }[] = []
    for (let i = 0; i < 5; i++) {
      rays.push({
        x: (canvas.width / 6) * (i + 0.5),
        width: Math.random() * 80 + 40,
        opacity: Math.random() * 0.15 + 0.05,
        speed: Math.random() * 0.0005 + 0.0002,
      })
    }

    let animationId: number
    let time = 0

    const animate = () => {
      time += 0.01
      
      // Create ocean gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#004d6b") // Light ocean surface
      gradient.addColorStop(0.3, "#003d5c") // Mid ocean
      gradient.addColorStop(0.7, "#002744") // Deep ocean
      gradient.addColorStop(1, "#001a33") // Abyss
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw caustic light rays from top
      ctx.save()
      rays.forEach((ray) => {
        const rayGradient = ctx.createLinearGradient(ray.x, 0, ray.x, canvas.height * 0.6)
        rayGradient.addColorStop(0, `rgba(0, 217, 255, ${ray.opacity * (1 + Math.sin(time + ray.x) * 0.3)})`)
        rayGradient.addColorStop(0.5, `rgba(0, 180, 255, ${ray.opacity * 0.5})`)
        rayGradient.addColorStop(1, "transparent")
        
        ctx.fillStyle = rayGradient
        ctx.fillRect(ray.x - ray.width / 2, 0, ray.width, canvas.height * 0.6)
        
        // Animate ray movement
        ray.x += Math.sin(time * ray.speed) * 0.5
        if (ray.x < -ray.width) ray.x = canvas.width + ray.width
        if (ray.x > canvas.width + ray.width) ray.x = -ray.width
      })
      ctx.restore()

      // Draw and update bubbles
      bubbles.forEach((bubble) => {
        // Update bubble position
        bubble.y -= bubble.speed
        bubble.wobble += bubble.wobbleSpeed
        bubble.x += Math.sin(bubble.wobble) * 0.5

        // Reset bubble when it goes off screen
        if (bubble.y + bubble.radius < 0) {
          bubble.y = canvas.height + bubble.radius
          bubble.x = Math.random() * canvas.width
        }

        // Draw bubble
        ctx.save()
        ctx.globalAlpha = bubble.opacity

        // Bubble body (glass effect)
        const bubbleGradient = ctx.createRadialGradient(
          bubble.x - bubble.radius * 0.3,
          bubble.y - bubble.radius * 0.3,
          0,
          bubble.x,
          bubble.y,
          bubble.radius
        )
        bubbleGradient.addColorStop(0, "rgba(255, 255, 255, 0.8)")
        bubbleGradient.addColorStop(0.3, "rgba(100, 200, 255, 0.4)")
        bubbleGradient.addColorStop(0.7, "rgba(50, 150, 255, 0.2)")
        bubbleGradient.addColorStop(1, "rgba(0, 100, 200, 0.1)")

        ctx.fillStyle = bubbleGradient
        ctx.beginPath()
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2)
        ctx.fill()

        // Bubble rim (highlight)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)"
        ctx.lineWidth = 0.5
        ctx.stroke()

        // Bubble shine spot
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
        ctx.beginPath()
        ctx.arc(
          bubble.x - bubble.radius * 0.4,
          bubble.y - bubble.radius * 0.4,
          bubble.radius * 0.25,
          0,
          Math.PI * 2
        )
        ctx.fill()

        ctx.restore()
      })

      // Add some floating particles (plankton-like)
      ctx.save()
      ctx.globalAlpha = 0.3
      for (let i = 0; i < 50; i++) {
        const px = (Math.sin(time * 0.5 + i) * canvas.width / 4) + canvas.width / 2
        const py = (Math.cos(time * 0.3 + i * 2) * canvas.height / 3) + canvas.height / 2
        const size = Math.sin(time + i) * 1.5 + 1.5
        
        ctx.fillStyle = `rgba(100, 200, 255, ${0.3 + Math.sin(time + i) * 0.2})`
        ctx.beginPath()
        ctx.arc(px, py, size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()

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
      className="fixed inset-0 pointer-events-none z-0"
      style={{ 
        mixBlendMode: "normal",
      }}
    />
  )
}

