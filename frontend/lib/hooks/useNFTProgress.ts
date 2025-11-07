import { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi'

interface NFTProgressData {
  stage: 'generating' | 'uploading_image' | 'uploading_metadata' | 'minting' | 'complete' | 'error'
  message: string
  data?: Record<string, any>
}

export function useNFTProgress() {
  const { address } = useAccount()
  const [progress, setProgress] = useState<NFTProgressData | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (!address) return

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'
    const eventSource = new EventSource(`${backendUrl}/events/${address.toLowerCase()}`)

    eventSource.onmessage = (event) => {
      try {
        const data: NFTProgressData = JSON.parse(event.data)
        setProgress(data)
        
        if (data.stage === 'generating') {
          setIsGenerating(true)
        } else if (data.stage === 'complete' || data.stage === 'error') {
          setIsGenerating(false)
          // Auto-clear after 5 seconds
          setTimeout(() => setProgress(null), 5000)
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error)
      }
    }

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error)
      eventSource.close()
      setIsGenerating(false)
    }

    return () => {
      eventSource.close()
    }
  }, [address])

  const clearProgress = useCallback(() => {
    setProgress(null)
    setIsGenerating(false)
  }, [])

  return {
    progress,
    isGenerating,
    clearProgress,
  }
}

