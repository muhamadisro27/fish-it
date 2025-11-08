"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Waves, Sparkles, Weight, Coins, Anchor, Clock } from "lucide-react"
import {
  Fish,
  FishRarity,
  RARITY_NAMES,
  FISH_REWARD_MULTIPLIERS,
} from "@/types/fish"

const RARITY_EMOJIS = {
  [FishRarity.COMMON]: "🐟",
  [FishRarity.RARE]: "🐠",
  [FishRarity.EPIC]: "🦈",
  [FishRarity.LEGENDARY]: "🐉",
}

const RARITY_BACKGROUNDS = {
  [FishRarity.COMMON]:
    "from-gray-50 to-slate-50 dark:from-gray-950 dark:to-slate-950",
  [FishRarity.RARE]:
    "from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950",
  [FishRarity.EPIC]:
    "from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950",
  [FishRarity.LEGENDARY]:
    "from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950",
}

interface FishDetailsModalProps {
  fish: Fish | null | any
  isOpen: boolean
  onClose: () => void
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function FishDetailsModal({
  fish,
  isOpen,
  onClose,
}: FishDetailsModalProps) {
  const loading = false

  if (!fish || fish.rarity === undefined) return null

  const rarity = fish.rarity as FishRarity
  const rarityKey = RARITY_NAMES[rarity]
  // Reward dari smart contract (1% flat, bukan multiplier rarity)
  const actualReward = fish.rewardAmount || (fish.stakedAmount * 0.01)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md overflow-hidden rounded-3xl border border-cyan-500/25 bg-[#071a36]/95 p-0 shadow-[0_35px_90px_-40px_rgba(12,95,255,0.65)] backdrop-blur-xl flex max-h-[85vh] flex-col">
        <div className="relative px-6 pt-6 pb-4 border-b border-white/10 bg-gradient-to-r from-[#0b1f43]/95 via-[#0a2c66]/90 to-[#041432]/95 sticky top-0 z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,rgba(47,147,255,0.3),transparent_60%)]" />
          <DialogHeader className="relative z-10">
            <DialogTitle className="flex items-center gap-3 text-white">
              <span className="text-3xl drop-shadow">
                {RARITY_EMOJIS[rarity]}
              </span>
              <div className="flex-1">
                <div className="text-lg font-semibold">
                  {fish.species} #{fish.id.toString()}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="overflow-y-auto flex-1">
          <div className="p-6 space-y-5">
            <div
              className={`relative h-40 rounded-2xl flex items-center justify-center overflow-hidden bg-gradient-to-b ${RARITY_BACKGROUNDS[rarity]}`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(47,147,255,0.25),transparent_65%)]" />
              {(() => {
                const image = fish.metadata?.image
                const isPlaceholder = image === "ipfs://placeholder"

                if (!image || isPlaceholder) {
                  return (
                    <div className="text-7xl group-hover:scale-105 transition-transform duration-300">
                      {RARITY_EMOJIS[rarity]}
                    </div>
                  )
                }

                return <img src={image} alt={fish.metadata?.name ?? "Fish"} />
              })()}
            </div>

            <Card className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b2347]/80 p-5 space-y-3">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(41,134,255,0.18),_transparent_60%)]" />
              <div className="relative z-10 space-y-3 text-sm text-cyan-100/85">
                <div className="flex items-center justify-between">
                  <span className="text-cyan-100/70">Species</span>
                  <span className="font-semibold text-white">
                    {fish.species}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-cyan-100/70">Rarity</span>
                  <span className="font-semibold text-white capitalize">
                    {rarityKey}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-cyan-100/70">
                    <Weight className="w-4 h-4 text-[#29c0ff]" />
                    Weight
                  </span>
                  <span className="font-semibold text-white">
                    {fish.weight} kg
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-cyan-100/70">
                    <Anchor className="w-4 h-4 text-[#6ea8ff]" />
                    Staked Amount
                  </span>
                  <span className="font-semibold text-white">
                    {fish.stakedAmount} FISH
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-cyan-100/70">
                    <Waves className="w-4 h-4 text-[#38c6ff]" />
                    Bait Used
                  </span>
                  <span className="font-semibold text-white">
                    {fish.baitType}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl border border-[#40b8ff]/35 bg-[#0b264c]/80 p-5 space-y-2 text-sm text-cyan-100/80">
              <div className="flex items-center gap-2 text-white">
                <Clock className="w-4 h-4 text-[#29c0ff]" />
                <span className="font-semibold">Caught</span>
              </div>
              <p suppressHydrationWarning>{formatTimeAgo(fish.catchTime)}</p>
            </Card>

            <Card className="rounded-2xl border border-[#51f5c5]/35 bg-[#0a2e3d]/80 p-5 space-y-2 text-sm text-cyan-100/85">
              <div className="flex items-center gap-2 text-white">
                <Coins className="w-4 h-4 text-[#61f6ca]" />
                <span className="font-semibold">Staking Reward</span>
              </div>
              <p className="text-2xl font-bold text-[#61f6ca]">
                {actualReward.toFixed(2)} FSHT
              </p>
              <p className="text-xs text-cyan-100/70">
                1% reward from staked amount (smart contract)
              </p>
            </Card>

            <Card className="rounded-2xl border border-[#29c0ff]/30 bg-[#0a2347]/80 p-4">
              <p className="text-xs text-cyan-100/80">
                🎣 <strong>Congratulations!</strong> You caught a {rarityKey}{" "}
                {fish.species}!
                <br />
                💰 <strong>Staking Reward</strong>: 1% bonus ({actualReward.toFixed(2)} FSHT)
                <br />
                🪙 <strong>NFT</strong>: This fish is a unique ERC-721 token
              </p>
            </Card>
          </div>
        </div>

        <div className="px-6 py-5 border-t border-white/10 bg-[#081a36]/95 space-y-3">
          <Card className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-3 text-xs text-cyan-100/80">
            <p>
              💡 <strong>NFT Details</strong>
              <br />
              This is your collected fish NFT. It's already in your aquarium!
            </p>
          </Card>
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full rounded-full border border-white/20 bg-transparent text-cyan-100/80 hover:bg-white/10"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
