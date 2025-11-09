export enum FishRarity {
  COMMON = 0,
  RARE = 1,
  EPIC = 2,
  LEGENDARY = 3,
}

export const RARITY_NAMES = {
  [FishRarity.COMMON]: "common",
  [FishRarity.RARE]: "rare",
  [FishRarity.EPIC]: "epic",
  [FishRarity.LEGENDARY]: "legendary",
}

export interface Fish {
  id: bigint
  owner: string
  species: string
  rarity: FishRarity
  weight: number
  stakedAmount: number
  rewardAmount?: number // Reward dari staking (1% dari smart contract)
  baitType: string
  catchTime: number
  isCaught: boolean
}

// Game constants
export const BAIT_PRICES = {
  Common: 10,
  Rare: 25,
  Epic: 50,
  Legendary: 100,
}

export const FISH_REWARD_MULTIPLIERS = {
  [FishRarity.COMMON]: 1.0,
  [FishRarity.RARE]: 1.5,
  [FishRarity.EPIC]: 2.0,
  [FishRarity.LEGENDARY]: 3.0,
}

export const CAST_DURATION = 60 // 1 minute
export const STRIKE_DURATION = 30 // 30 seconds

