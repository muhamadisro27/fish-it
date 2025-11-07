"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Waves, Sparkles, Clock, Weight, Anchor } from "lucide-react"
import { FishRarity, RARITY_NAMES } from "@/types/fish"

const RARITY_COLORS = {
  common: "bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100",
  rare: "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100",
  epic: "bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100",
  legendary:
    "bg-orange-100 text-orange-900 dark:bg-orange-900 dark:text-orange-100",
}

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

const RARITY_HOVER_BACKGROUNDS = {
  [FishRarity.COMMON]:
    "group-hover:from-gray-100 group-hover:to-slate-100 dark:group-hover:from-gray-900 dark:group-hover:to-slate-900",
  [FishRarity.RARE]:
    "group-hover:from-blue-100 group-hover:to-cyan-100 dark:group-hover:from-blue-900 dark:group-hover:to-cyan-900",
  [FishRarity.EPIC]:
    "group-hover:from-purple-100 group-hover:to-violet-100 dark:group-hover:from-purple-900 dark:group-hover:to-violet-900",
  [FishRarity.LEGENDARY]:
    "group-hover:from-orange-100 group-hover:to-amber-100 dark:group-hover:from-orange-900 dark:group-hover:to-amber-900",
}

const RARITY_BORDERS = {
  [FishRarity.COMMON]: "border-gray-300 dark:border-gray-700",
  [FishRarity.RARE]: "border-blue-300 dark:border-blue-700",
  [FishRarity.EPIC]: "border-purple-300 dark:border-purple-700",
  [FishRarity.LEGENDARY]: "border-orange-300 dark:border-orange-700",
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

export default function FishCard({ fish }: { fish: any }) {
  if (!fish || fish.rarity === undefined) return null
  const rarity = fish.rarity as FishRarity
  const rarityKey = RARITY_NAMES[rarity] as keyof typeof RARITY_COLORS
  const progress = fish.isCaught ? 100 : 50

  return (
    <Card
      className={`overflow-hidden transition-all duration-500 ease-out animate-grow border-2 cursor-pointer group hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] active:scale-[0.98] ${RARITY_BORDERS[rarity]} hover:border-opacity-100 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]`}
      style={{
        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div
        className={`h-48 flex items-center justify-center relative overflow-hidden transition-all duration-500 ease-out group-hover:brightness-110 bg-gradient-to-b ${RARITY_BACKGROUNDS[rarity]} ${RARITY_HOVER_BACKGROUNDS[rarity]}`}
      >
        <div
          className={`absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 ${
            rarity === FishRarity.COMMON
              ? "bg-gray-400/20 blur-xl"
              : rarity === FishRarity.RARE
              ? "bg-blue-400/20 blur-xl"
              : rarity === FishRarity.EPIC
              ? "bg-purple-400/20 blur-xl"
              : "bg-orange-400/20 blur-xl"
          }`}
        />

        {fish.metadata?.image === "ipfs://placeholder" ? (
          <div className="text-7xl group-hover:scale-105 transition-transform duration-300">
            {RARITY_EMOJIS[rarity]}
          </div>
        ) : (
          <img src={fish.metadata?.image ?? ""} alt="" />
        )}

        {rarity === FishRarity.COMMON && (
          <>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-2 bg-gray-600/20 dark:bg-gray-400/20 rounded-full" />
            <div className="absolute top-4 right-4 text-2xl opacity-30">💧</div>
          </>
        )}
        {rarity === FishRarity.RARE && (
          <>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-3 bg-blue-600/30 dark:bg-blue-400/30 rounded-full" />
            <div className="absolute top-4 left-4 text-xl opacity-30">🌊</div>
            <div className="absolute top-4 right-4 text-xl opacity-40">✨</div>
          </>
        )}
        {rarity === FishRarity.EPIC && (
          <>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-purple-600/40 dark:bg-purple-400/40 rounded-full" />
            <div className="absolute top-6 left-6 text-lg opacity-25">⚡</div>
            <div className="absolute bottom-6 right-6 text-lg opacity-25">
              ⚡
            </div>
          </>
        )}
        {rarity === FishRarity.LEGENDARY && (
          <>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-orange-600/40 dark:bg-orange-400/40 rounded-full" />
            <div className="absolute top-3 left-3">
              <Sparkles className="w-5 h-5 text-yellow-500/70" />
            </div>
            <div className="absolute top-3 right-3">
              <Sparkles className="w-5 h-5 text-yellow-500/70" />
            </div>
          </>
        )}
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-foreground text-lg">
              {fish.species}
            </h3>
            <div className="flex gap-2 mt-1 flex-wrap">
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-medium ${RARITY_COLORS[rarityKey]}`}
              >
                {rarityKey.charAt(0).toUpperCase() + rarityKey.slice(1)}
              </span>
              {fish.isCaught && (
                <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/30">
                  ✓ Caught
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-foreground">
              <Weight className="w-4 h-4 text-primary" />
              Weight
            </span>
            <span className="text-muted-foreground font-medium">
              {fish.weight} kg
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-foreground">
              <Anchor className="w-4 h-4 text-blue-500" />
              Staked
            </span>
            <span className="text-muted-foreground font-medium">
              {fish.stakedAmount} FISH
            </span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-border">
          <p className="flex items-center gap-1">
            <Waves className="w-3 h-3" />
            Bait: {fish.baitType}
          </p>
          <p className="flex items-center gap-1" suppressHydrationWarning>
            <Clock className="w-3 h-3" />
            Caught: {formatTimeAgo(fish.catchTime)}
          </p>
        </div>
      </div>
    </Card>
  )
}
