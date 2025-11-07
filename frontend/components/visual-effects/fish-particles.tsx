"use client"

import { useEffect, useRef } from "react"

interface Fish {
  x: number
  y: number
  size: number
  speed: number
  direction: number
  wobble: number
  wobbleSpeed: number
  opacity: number
  type: 'small' | 'medium' | 'large'
}

export default function FishParticles() {
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

    // Create fish
    const fishes: Fish[] = []
    const fishCount = Math.min(12, Math.floor(canvas.width / 150)) // Responsive fish count
    
    for (let i = 0; i < fishCount; i++) {
      const typeRand = Math.random()
      const type: 'small' | 'medium' | 'large' = 
        typeRand < 0.6 ? 'small' : typeRand < 0.9 ? 'medium' : 'large'
      
      fishes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: type === 'small' ? 8 : type === 'medium' ? 15 : 25,
        speed: type === 'small' ? 0.8 : type === 'medium' ? 0.5 : 0.3,
        direction: Math.random() < 0.5 ? 1 : -1, // Left or right
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.02 + 0.01,
        opacity: Math.random() * 0.4 + 0.3,
        type,
      })
    }

    let animationId: number

    const drawFish = (fish: Fish) => {
      ctx.save()
      ctx.globalAlpha = fish.opacity
      ctx.translate(fish.x, fish.y)
      
      // Flip horizontally based on direction
      if (fish.direction < 0) {
        ctx.scale(-1, 1)
      }

      // Fish body (simple silhouette)
      const gradient = ctx.createLinearGradient(-fish.size, 0, fish.size, 0)
      gradient.addColorStop(0, "rgba(0, 150, 200, 0.6)")
      gradient.addColorStop(0.5, "rgba(0, 200, 255, 0.8)")
      gradient.addColorStop(1, "rgba(0, 150, 200, 0.4)")
      
      ctx.fillStyle = gradient

      // Body (oval)
      ctx.beginPath()
      ctx.ellipse(0, 0, fish.size, fish.size * 0.5, 0, 0, Math.PI * 2)
      ctx.fill()

      // Tail (triangle)
      ctx.beginPath()
      ctx.moveTo(-fish.size * 0.8, 0)
      ctx.lineTo(-fish.size * 1.5, -fish.size * 0.4)
      ctx.lineTo(-fish.size * 1.5, fish.size * 0.4)
      ctx.closePath()
      ctx.fill()

      // Eye (small dot)
      if (fish.size > 10) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
        ctx.beginPath()
        ctx.arc(fish.size * 0.5, -fish.size * 0.15, fish.size * 0.1, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      fishes.forEach((fish) => {
        // Update position
        fish.x += fish.speed * fish.direction
        fish.wobble += fish.wobbleSpeed
        fish.y += Math.sin(fish.wobble) * 0.5

        // Wrap around screen
        if (fish.direction > 0 && fish.x > canvas.width + fish.size * 2) {
          fish.x = -fish.size * 2
          fish.y = Math.random() * canvas.height
        } else if (fish.direction < 0 && fish.x < -fish.size * 2) {
          fish.x = canvas.width + fish.size * 2
          fish.y = Math.random() * canvas.height
        }

        // Keep within vertical bounds
        if (fish.y < fish.size) fish.y = fish.size
        if (fish.y > canvas.height - fish.size) fish.y = canvas.height - fish.size

        drawFish(fish)
      })

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
      className="fixed inset-0 pointer-events-none z-[5]"
      style={{ opacity: 0.7 }}
    />
  )
}

