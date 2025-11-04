"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Waves, Sparkles, Weight, Coins, Anchor, Clock } from "lucide-react"
import { Fish, FishRarity, RARITY_NAMES, FISH_REWARD_MULTIPLIERS } from "@/types/fish"

const RARITY_EMOJIS = {
  [FishRarity.COMMON]: "🐟",
  [FishRarity.RARE]: "🐠",
  [FishRarity.EPIC]: "🦈",
  [FishRarity.LEGENDARY]: "🐉",
}

const RARITY_BACKGROUNDS = {
  [FishRarity.COMMON]: "from-gray-50 to-slate-50 dark:from-gray-950 dark:to-slate-950",
  [FishRarity.RARE]: "from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950",
  [FishRarity.EPIC]: "from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950",
  [FishRarity.LEGENDARY]: "from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950",
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

export default function FishDetailsModal({ fish, isOpen, onClose }: FishDetailsModalProps) {
  const loading = false

  if (!fish || fish.rarity === undefined) return null

  const rarity = fish.rarity as FishRarity
  const rarityKey = RARITY_NAMES[rarity]
  const rewardMultiplier = FISH_REWARD_MULTIPLIERS[rarity]
  const estimatedReward = fish.stakedAmount * rewardMultiplier

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-card/95 backdrop-blur-sm border-2 p-0 gap-0 max-h-[85vh] overflow-hidden flex flex-col">
        <div className="px-6 pt-6 pb-3 border-b bg-card/95 sticky top-0 z-10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-3xl">{RARITY_EMOJIS[rarity]}</span>
              <div className="flex-1">
                <div>{fish.species} #{fish.id.toString()}</div>
              </div>
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="overflow-y-auto flex-1">
          <div className="p-6 space-y-4">
            <div
              className={`h-40 rounded-lg flex items-center justify-center relative overflow-hidden bg-gradient-to-b ${RARITY_BACKGROUNDS[rarity]}`}
            >
              <div className="text-8xl">{RARITY_EMOJIS[rarity]}</div>
            </div>

            <Card className="p-4 space-y-3 bg-muted/30">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Species</span>
                <span className="font-semibold text-foreground">{fish.species}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Rarity</span>
                <span className="font-semibold text-foreground capitalize">{rarityKey}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Weight className="w-4 h-4" />
                  Weight
                </span>
                <span className="font-semibold text-foreground">{fish.weight} kg</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Anchor className="w-4 h-4" />
                  Staked Amount
                </span>
                <span className="font-semibold text-foreground">{fish.stakedAmount} FISH</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Waves className="w-4 h-4" />
                  Bait Used
                </span>
                <span className="font-semibold text-foreground">{fish.baitType}</span>
              </div>
            </Card>

            <Card className="p-4 space-y-2 bg-blue-500/10 border-blue-500/20">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-semibold text-foreground">Caught</span>
              </div>
              <p className="text-sm text-muted-foreground">{formatTimeAgo(fish.catchTime)}</p>
            </Card>

            <Card className="p-4 space-y-2 bg-green-500/10 border-green-500/20">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-green-500" />
                <span className="text-sm font-semibold text-foreground">Estimated Reward</span>
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {estimatedReward} FISH
              </p>
              <p className="text-xs text-muted-foreground">
                {rewardMultiplier}x multiplier for {rarityKey} rarity
              </p>
            </Card>

            <Card className="p-3 bg-primary/10 border-primary/20">
              <p className="text-xs text-muted-foreground">
                🎣 <strong>Congratulations!</strong> You caught a {rarityKey} {fish.species}!
                <br />
                💎 <strong>Rarity bonus</strong>: {rewardMultiplier}x reward multiplier
                <br />
                🪙 <strong>NFT</strong>: This fish is a unique ERC-721 token
              </p>
            </Card>
          </div>
        </div>

        <div className="px-6 py-4 border-t bg-card/95 space-y-2">
          <Button
            onClick={() => console.log("Claim rewards")}
            disabled={loading}
            className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Claiming...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Claim Rewards
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full bg-transparent"
            disabled={loading}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}


