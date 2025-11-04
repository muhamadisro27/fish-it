"use client"

import { useEffect, useState } from "react"

interface Sparkle {
  id: number
  x: number
  y: number
  delay: number
  duration: number
}

interface SparklesEffectProps {
  count?: number
  duration?: number
  enabled?: boolean
}

export default function SparklesEffect({ 
  count = 20, 
  duration = 2000,
  enabled = true 
}: SparklesEffectProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])

  useEffect(() => {
    if (!enabled) return

    const newSparkles: Sparkle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * duration,
      duration: duration + Math.random() * 500,
    }))

    setSparkles(newSparkles)

    const timer = setTimeout(() => {
      setSparkles([])
    }, duration + 1000)

    return () => clearTimeout(timer)
  }, [enabled, count, duration])

  if (!enabled || sparkles.length === 0) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute animate-sparkle"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            animationDelay: `${sparkle.delay}ms`,
            animationDuration: `${sparkle.duration}ms`,
          }}
        >
          <span className="text-2xl">✨</span>
        </div>
      ))}
    </div>
  )
}



