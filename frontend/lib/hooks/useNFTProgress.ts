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
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!address) {
      setIsConnected(false)
      return
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'
    let eventSource: EventSource | null = null
    let cleanedUp = false

    // Test if backend is available first
    fetch(`${backendUrl}/health`, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
    })
      .then((response) => {
        if (!response.ok || cleanedUp) {
          throw new Error('Backend not available')
        }

        // Backend is available, connect SSE
        eventSource = new EventSource(`${backendUrl}/events/${address.toLowerCase()}`)

        eventSource.onopen = () => {
          if (cleanedUp) return
          setIsConnected(true)
          console.log('✅ Connected to NFT generation service')
        }

        eventSource.onmessage = (event) => {
          if (cleanedUp) return

          try {
            const data: NFTProgressData = JSON.parse(event.data)
            setProgress(data)

            if (data.stage === 'generating') {
              setIsGenerating(true)
            } else if (data.stage === 'complete' || data.stage === 'error') {
              setIsGenerating(false)
              // Auto-clear after 5 seconds
              setTimeout(() => {
                if (!cleanedUp) setProgress(null)
              }, 5000)
            }
          } catch (error) {
            console.error('Error parsing SSE data:', error)
          }
        }

        eventSource.onerror = () => {
          if (cleanedUp) return
          // Silent error - backend might not be running
          // This is OK, NFT generation just won't show progress
          if (eventSource) {
            eventSource.close()
            eventSource = null
          }
          setIsConnected(false)
          setIsGenerating(false)
        }
      })
      .catch(() => {
        // Backend not available - this is OK
        // User can still use the app, just no real-time progress
        if (!cleanedUp) {
          setIsConnected(false)
          console.log('ℹ️ NFT generation service offline - progress tracking disabled')
        }
      })

    // Cleanup function
    return () => {
      cleanedUp = true
      if (eventSource) {
        eventSource.close()
        eventSource = null
      }
      setIsConnected(false)
      setIsGenerating(false)
    }
  }, [address])

  const clearProgress = useCallback(() => {
    setProgress(null)
    setIsGenerating(false)
  }, [])

  return {
    progress,
    isGenerating,
    isConnected,
    clearProgress,
  }
}

