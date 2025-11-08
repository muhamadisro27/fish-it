import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useTokensOfOwner, useTokenURIsOfOwner } from './useContracts'
import { Fish, FishRarity } from '@/types/fish'

interface NFTMetadata {
  name: string
  description: string
  image: string
  external_url?: string
  attributes: Array<{
    trait_type: string
    value: string | number
  }>
}

interface ParsedFish extends Fish {
  tokenId: bigint
  tokenURI: string
  metadata?: NFTMetadata
}

export function useNFTCollection() {
  const { address } = useAccount()
  const { data: tokenIds, isLoading: isLoadingIds, refetch: refetchIds } = useTokensOfOwner(address)
  const { data: tokenURIs, isLoading: isLoadingURIs, refetch: refetchURIs } = useTokenURIsOfOwner(address)
  
  const [parsedFish, setParsedFish] = useState<ParsedFish[]>([])
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0) // Trigger untuk force reload

  // Parse rarity from string
  const parseRarity = (rarityStr: string): FishRarity => {
    const lowerRarity = rarityStr.toLowerCase()
    if (lowerRarity === 'common') return FishRarity.COMMON
    if (lowerRarity === 'rare') return FishRarity.RARE
    if (lowerRarity === 'epic') return FishRarity.EPIC
    if (lowerRarity === 'legendary') return FishRarity.LEGENDARY
    return FishRarity.COMMON
  }

  // Fetch metadata from IPFS
  const fetchMetadata = async (uri: string): Promise<NFTMetadata | null> => {
    try {
      // Convert IPFS URI to gateway URL
      let url = uri
      if (uri.startsWith('ipfs://')) {
        const cid = uri.replace('ipfs://', '')
        url = `https://gateway.pinata.cloud/ipfs/${cid}`
      }

      const response = await fetch(url)
      if (!response.ok) {
        console.error(`Failed to fetch metadata from ${url}`)
        return null
      }

      const metadata: NFTMetadata = await response.json()

      return metadata
    } catch (error) {
      console.error('Error fetching metadata:', error)
      return null
    }
  }

  // Load and parse NFT data
  useEffect(() => {
    if (!tokenIds || !tokenURIs || tokenIds.length === 0) {
      setParsedFish([])
      return
    }

    const loadMetadata = async () => {
      setIsLoadingMetadata(true)
      setError(null)

      try {
        const fishPromises = tokenIds.map(async (tokenId, index): Promise<ParsedFish | null> => {
          const tokenURI = tokenURIs[index]
          
          if (!tokenURI) return null

          // Fetch metadata from IPFS
          const metadata = await fetchMetadata(tokenURI)

          if (!metadata) {
            return {
              id: tokenId,
              tokenId,
              tokenURI,
              owner: address || '',
              species: 'Unknown Fish',
              rarity: FishRarity.COMMON,
              weight: 0,
              stakedAmount: 0,
              baitType: 'Common',
              catchTime: Date.now(),
              isCaught: true,
            }
          }

          // Extract attributes from metadata
          const getAttributeValue = (traitType: string): string => {
            const attr = metadata.attributes.find(
              (a) => a.trait_type.toLowerCase() === traitType.toLowerCase()
            )
            return attr ? String(attr.value) : ''
          }

          const species = getAttributeValue('Species') || 'Unknown Fish'
          const rarityStr = getAttributeValue('Rarity') || 'common'
          const rarity = parseRarity(rarityStr)
          const weightStr = getAttributeValue('Weight') || '0 kg'
          const weight = parseFloat(weightStr.replace(/[^0-9.]/g, '')) || 0
          const baitType = getAttributeValue('Bait Used') || 'Common'
          const stakedAmountStr = getAttributeValue('Staked Amount') || '0 FSHT'
          const stakedAmount = parseFloat(stakedAmountStr.replace(/[^0-9.]/g, '')) || 0
          const rewardAmountStr = getAttributeValue('Reward Amount') || '0 FSHT'
          const rewardAmount = parseFloat(rewardAmountStr.replace(/[^0-9.]/g, '')) || 0
          const catchTimeStr = getAttributeValue('Catch Time')
          // Catch Time dari blockchain (unix timestamp in seconds), convert ke milliseconds
          const catchTime = catchTimeStr ? parseInt(catchTimeStr) * 1000 : Date.now()

          return {
            id: tokenId,
            tokenId,
            tokenURI,
            metadata,
            owner: address || '',
            species,
            rarity,
            weight,
            stakedAmount,
            rewardAmount,
            baitType,
            catchTime,
            isCaught: true,
          }
        })

        const fish = await Promise.all(fishPromises)
        const validFish = fish.filter((f): f is ParsedFish => f !== null)
        
        // Sort by catch time (newest first)
        validFish.sort((a, b) => b.catchTime - a.catchTime)
        
        setParsedFish(validFish)
      } catch (err: any) {
        console.error('Error loading NFT metadata:', err)
        setError(err.message || 'Failed to load NFT metadata')
      } finally {
        setIsLoadingMetadata(false)
      }
    }

    loadMetadata()
  }, [tokenIds, tokenURIs, address, refreshTrigger])

  // Refetch function - Force reload semua data
  const refetch = async () => {
    try {
      setIsLoadingMetadata(true)
      setError(null)
      
      // Refetch tokenIds dan tokenURIs dari blockchain
      await Promise.all([refetchIds(), refetchURIs()])
      
      // Force trigger useEffect untuk reload metadata
      setRefreshTrigger(prev => prev + 1)
    } catch (err: any) {
      console.error('Error refetching collection:', err)
      setError(err.message || 'Failed to refresh collection')
    }
  }

  return {
    fish: parsedFish,
    isLoading: isLoadingIds || isLoadingURIs || isLoadingMetadata,
    error,
    refetch,
    totalCount: tokenIds?.length || 0,
  }
}

