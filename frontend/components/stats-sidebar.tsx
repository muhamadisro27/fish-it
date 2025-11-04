"use client"

import { Card } from "@/components/ui/card"
import { Fish as FishIcon, Sparkles, Coins, Waves, Clock, Anchor } from "lucide-react"
import { FishRarity, BAIT_PRICES } from "@/types/fish"

interface StatsSidebarProps {
  selectedPlantId: bigint | null
}

// Hardcoded stats untuk demo
const MOCK_STATS = {
  totalFish: 3,
  commonFish: 1,
  rareFish: 1,
  epicFish: 1,
  legendaryFish: 0,
}

export default function StatsSidebar({ selectedPlantId }: StatsSidebarProps) {
  const isConnected = true // Hardcoded untuk demo
  const address = "0x1234...5678"

  return (
    <div className="space-y-4 sticky top-24">
      {/* Aquarium Stats */}
      <Card className="p-4 bg-gradient-to-br from-card to-card/50 border border-border animate-slide-in-up hover:shadow-lg transition-all duration-300 ease-out">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <FishIcon className="w-5 h-5 text-primary" />
          Aquarium Stats
        </h3>
        {isConnected ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 rounded bg-muted/50 hover:bg-muted transition-all duration-300 ease-out">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <FishIcon className="w-4 h-4 text-primary" />
                Total Fish
              </span>
              <span className="font-semibold text-foreground">{MOCK_STATS.totalFish}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-muted/50 hover:bg-muted transition-all duration-300 ease-out">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <FishIcon className="w-4 h-4 text-gray-500" />
                Common
              </span>
              <span className="font-semibold text-foreground">{MOCK_STATS.commonFish}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-muted/50 hover:bg-muted transition-all duration-300 ease-out">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <FishIcon className="w-4 h-4 text-blue-500" />
                Rare
              </span>
              <span className="font-semibold text-foreground">{MOCK_STATS.rareFish}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-muted/50 hover:bg-muted transition-all duration-300 ease-out">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <FishIcon className="w-4 h-4 text-purple-500" />
                Epic
              </span>
              <span className="font-semibold text-foreground">{MOCK_STATS.epicFish}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-muted/50 hover:bg-muted transition-all duration-300 ease-out">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 text-orange-500" />
                Legendary
              </span>
              <span className="font-semibold text-foreground">{MOCK_STATS.legendaryFish}</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">Connect wallet to view stats</p>
        )}
      </Card>

      {/* Wallet Info */}
      {isConnected && (
        <Card
          className="p-4 border border-border animate-slide-in-up transition-all duration-300 ease-out"
          style={{ animationDelay: "0.1s" }}
        >
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Coins className="w-5 h-5 text-accent" />
            Wallet
          </h3>
          <div className="space-y-2">
            <div className="p-2 rounded bg-muted/30">
              <p className="text-xs text-muted-foreground mb-1">Address</p>
              <p className="text-xs font-mono text-foreground truncate">{address}</p>
            </div>
            <div className="p-2 rounded bg-muted/30">
              <p className="text-xs text-muted-foreground mb-1">Balance</p>
              <p className="text-sm font-semibold text-foreground">1,250 FISH</p>
            </div>
          </div>
        </Card>
      )}

      {/* Bait Shop */}
      <Card
        className="p-4 border border-border animate-slide-in-up transition-all duration-300 ease-out"
        style={{ animationDelay: "0.2s" }}
      >
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Anchor className="w-5 h-5 text-primary" />
          Bait Shop
        </h3>
        <div className="space-y-3 text-sm">
          <div className="p-3 rounded bg-gray-500/10 border border-gray-500/20">
            <p className="text-xs text-muted-foreground mb-1">Common Bait</p>
            <p className="font-semibold text-foreground">{BAIT_PRICES.Common} FISH</p>
          </div>
          <div className="p-3 rounded bg-blue-500/10 border border-blue-500/20">
            <p className="text-xs text-muted-foreground mb-1">Rare Bait</p>
            <p className="font-semibold text-foreground">{BAIT_PRICES.Rare} FISH</p>
          </div>
          <div className="p-3 rounded bg-purple-500/10 border border-purple-500/20">
            <p className="text-xs text-muted-foreground mb-1">Epic Bait</p>
            <p className="font-semibold text-foreground">{BAIT_PRICES.Epic} FISH</p>
          </div>
          <div className="p-3 rounded bg-orange-500/10 border border-orange-500/20">
            <p className="text-xs text-muted-foreground mb-1">Legendary Bait</p>
            <p className="font-semibold text-foreground">{BAIT_PRICES.Legendary} FISH</p>
          </div>
        </div>
      </Card>

      {/* How to Play */}
      <Card
        className="p-4 border border-border animate-slide-in-up transition-all duration-300 ease-out"
        style={{ animationDelay: "0.3s" }}
      >
        <h3 className="font-semibold text-foreground mb-3">How to Play</h3>
        <div className="space-y-2 text-xs text-muted-foreground">
          <p>1. Buy bait from the Bait Shop</p>
          <p>2. Stake FISH tokens for better chances</p>
          <p>3. Cast your line and wait ~1 minute</p>
          <p>4. Strike within 30 seconds to catch!</p>
          <p className="text-primary font-semibold pt-2">🎣 Higher stakes = Rarer fish!</p>
          <p className="text-orange-500 font-semibold pt-2">✨ Use better bait for legendary catches!</p>
        </div>
      </Card>

      {/* Game Mechanics */}
      <Card
        className="p-4 border border-border animate-slide-in-up transition-all duration-300 ease-out"
        style={{ animationDelay: "0.4s" }}
      >
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Fishing Times
        </h3>
        <div className="space-y-3 text-sm">
          <div className="p-3 rounded bg-blue-500/10 border border-blue-500/20">
            <p className="text-xs text-muted-foreground mb-1">Cast Duration</p>
            <p className="font-semibold text-foreground">60 seconds</p>
          </div>
          <div className="p-3 rounded bg-orange-500/10 border border-orange-500/20">
            <p className="text-xs text-muted-foreground mb-1">Strike Window</p>
            <p className="font-semibold text-foreground">30 seconds</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
