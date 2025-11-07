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
    
    // Test if backend is available first
    fetch(`${backendUrl}/health`, { method: 'HEAD' })
      .then(() => {
        // Backend is available, connect SSE
        const eventSource = new EventSource(`${backendUrl}/events/${address.toLowerCase()}`)

        eventSource.onopen = () => {
          setIsConnected(true)
          console.log('✅ Connected to NFT generation service')
        }

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

        eventSource.onerror = () => {
          // Silent error - backend might not be running
          // This is OK, NFT generation just won't show progress
          eventSource.close()
          setIsConnected(false)
          setIsGenerating(false)
        }

        return () => {
          eventSource.close()
        }
      })
      .catch(() => {
        // Backend not available - this is OK
        // User can still use the app, just no real-time progress
        setIsConnected(false)
        console.log('ℹ️ NFT generation service offline - progress tracking disabled')
      })
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

