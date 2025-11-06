import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACTS } from '@/lib/config/contracts'
import {
  FishItTokenABI,
  FishItNFTABI,
  FishItBaitShopABI,
  FishItFaucetABI,
  FishItStakingABI,
} from '@/lib/abis'

// ========================================
// TOKEN CONTRACT HOOKS
// ========================================

export function useTokenBalance(address?: `0x${string}`) {
  return useReadContract({
    address: CONTRACTS.FishItToken,
    abi: FishItTokenABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 5000, // Refetch every 5 seconds
    },
  })
}

export function useTokenDecimals() {
  return useReadContract({
    address: CONTRACTS.FishItToken,
    abi: FishItTokenABI,
    functionName: 'decimals',
  })
}

export function useTokenApprove() {
  const { data: hash, writeContract, ...rest } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash })

  const approve = (spender: `0x${string}`, amount: bigint) => {
    writeContract({
      address: CONTRACTS.FishItToken,
      abi: FishItTokenABI,
      functionName: 'approve',
      args: [spender, amount],
    })
  }

  return { approve, hash, isConfirming, isConfirmed, ...rest }
}

export function useTokenAllowance(owner?: `0x${string}`, spender?: `0x${string}`) {
  return useReadContract({
    address: CONTRACTS.FishItToken,
    abi: FishItTokenABI,
    functionName: 'allowance',
    args: owner && spender ? [owner, spender] : undefined,
    query: {
      enabled: !!(owner && spender),
      refetchInterval: 5000,
    },
  })
}

// ========================================
// FAUCET CONTRACT HOOKS
// ========================================

export function useFaucetClaim() {
  const { data: hash, writeContract, ...rest } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash })

  const claim = () => {
    writeContract({
      address: CONTRACTS.FishItFaucet,
      abi: FishItFaucetABI,
      functionName: 'claim',
    })
  }

  return { claim, hash, isConfirming, isConfirmed, ...rest }
}

export function useFaucetCanClaim(address?: `0x${string}`) {
  return useReadContract({
    address: CONTRACTS.FishItFaucet,
    abi: FishItFaucetABI,
    functionName: 'canClaim',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 10000,
    },
  })
}

export function useFaucetNextClaimTime(address?: `0x${string}`) {
  return useReadContract({
    address: CONTRACTS.FishItFaucet,
    abi: FishItFaucetABI,
    functionName: 'getNextClaimTime',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 10000,
    },
  })
}

// ========================================
// BAIT SHOP CONTRACT HOOKS
// ========================================

export function useBaitInventory(address?: `0x${string}`, baitType?: 0 | 1 | 2 | 3) {
  return useReadContract({
    address: CONTRACTS.FishItBaitShop,
    abi: FishItBaitShopABI,
    functionName: 'getBaitInventory',
    args: address && baitType !== undefined ? [address, baitType] : undefined,
    query: {
      enabled: !!(address && baitType !== undefined),
      refetchInterval: 5000,
    },
  })
}

export function useBaitPrice(baitType?: 0 | 1 | 2 | 3) {
  return useReadContract({
    address: CONTRACTS.FishItBaitShop,
    abi: FishItBaitShopABI,
    functionName: 'getBaitPrice',
    args: baitType !== undefined ? [baitType] : undefined,
    query: {
      enabled: baitType !== undefined,
    },
  })
}

export function useBuyBait() {
  const { data: hash, writeContract, ...rest } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash })

  const buyBait = (baitType: 0 | 1 | 2 | 3, quantity: bigint) => {
    writeContract({
      address: CONTRACTS.FishItBaitShop,
      abi: FishItBaitShopABI,
      functionName: 'buyBait',
      args: [baitType, quantity],
    })
  }

  return { buyBait, hash, isConfirming, isConfirmed, ...rest }
}

// ========================================
// STAKING CONTRACT HOOKS
// ========================================

export function useStakeInfo(address?: `0x${string}`) {
  return useReadContract({
    address: CONTRACTS.FishItStaking,
    abi: FishItStakingABI,
    functionName: 'getStakeInfo',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 3000, // Fast refresh for fishing state
    },
  })
}

export function useStartFishing() {
  const { data: hash, writeContract, ...rest } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash })

  const startFishing = (amount: bigint, baitType: 0 | 1 | 2 | 3) => {
    writeContract({
      address: CONTRACTS.FishItStaking,
      abi: FishItStakingABI,
      functionName: 'startFishing',
      args: [amount, baitType],
    })
  }

  return { startFishing, hash, isConfirming, isConfirmed, ...rest }
}

export function useEnterCastingPhase() {
  const { data: hash, writeContract, ...rest } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash })

  const enterCasting = () => {
    writeContract({
      address: CONTRACTS.FishItStaking,
      abi: FishItStakingABI,
      functionName: 'enterCastingPhase',
    })
  }

  return { enterCasting, hash, isConfirming, isConfirmed, ...rest }
}

export function useEnterStrikePhase() {
  const { data: hash, writeContract, ...rest } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash })

  const enterStrike = () => {
    writeContract({
      address: CONTRACTS.FishItStaking,
      abi: FishItStakingABI,
      functionName: 'enterStrikePhase',
    })
  }

  return { enterStrike, hash, isConfirming, isConfirmed, ...rest }
}

export function useUnstake() {
  const { data: hash, writeContract, ...rest } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash })

  const unstake = () => {
    writeContract({
      address: CONTRACTS.FishItStaking,
      abi: FishItStakingABI,
      functionName: 'unstake',
    })
  }

  return { unstake, hash, isConfirming, isConfirmed, ...rest }
}

export function useClaimReward() {
  const { data: hash, writeContract, ...rest } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash })

  const claimReward = () => {
    writeContract({
      address: CONTRACTS.FishItStaking,
      abi: FishItStakingABI,
      functionName: 'claimReward',
    })
  }

  return { claimReward, hash, isConfirming, isConfirmed, ...rest }
}

export function useCastingTimeRemaining(address?: `0x${string}`) {
  return useReadContract({
    address: CONTRACTS.FishItStaking,
    abi: FishItStakingABI,
    functionName: 'getCastingTimeRemaining',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 1000, // Fast refresh for countdown
    },
  })
}

export function useStrikeTimeRemaining(address?: `0x${string}`) {
  return useReadContract({
    address: CONTRACTS.FishItStaking,
    abi: FishItStakingABI,
    functionName: 'getStrikeTimeRemaining',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 1000, // Fast refresh for countdown
    },
  })
}

// ========================================
// NFT CONTRACT HOOKS
// ========================================

export function useNFTBalance(address?: `0x${string}`) {
  return useReadContract({
    address: CONTRACTS.FishItNFT,
    abi: FishItNFTABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 10000,
    },
  })
}

export function useTokensOfOwner(address?: `0x${string}`) {
  return useReadContract({
    address: CONTRACTS.FishItNFT,
    abi: FishItNFTABI,
    functionName: 'tokensOfOwner',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 10000,
    },
  })
}

export function useTokenURIsOfOwner(address?: `0x${string}`) {
  return useReadContract({
    address: CONTRACTS.FishItNFT,
    abi: FishItNFTABI,
    functionName: 'tokenURIsOfOwner',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 10000,
    },
  })
}

