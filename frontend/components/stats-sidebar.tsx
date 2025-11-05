"use client"

import { Card } from "@/components/ui/card"
import { Fish as FishIcon, Sparkles, Coins, Waves, Clock, Anchor } from "lucide-react"
import { FishRarity, BAIT_PRICES } from "@/types/fish"

interface StatsSidebarProps {
  selectedFishId: bigint | null
}

// Hardcoded stats untuk demo
const MOCK_STATS = {
  totalFish: 3,
  commonFish: 1,
  rareFish: 1,
  epicFish: 1,
  legendaryFish: 0,
}

export default function StatsSidebar({ selectedFishId }: StatsSidebarProps) {
  const isConnected = true // Hardcoded untuk demo
  const address = "0x1234...5678"

  return (
    <div className="space-y-4 sticky top-24">
      {/* Aquarium Stats */}
      <Card className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-[#071d3d]/85 p-5 shadow-[0_25px_70px_-40px_rgba(12,95,255,0.6)] animate-slide-in-up transition-all duration-300 ease-out">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(42,119,255,0.2),_transparent_60%)]" />
        <div className="relative z-10">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <FishIcon className="w-5 h-5 text-[#29c0ff]" />
            Aquarium Stats
          </h3>
        {isConnected ? (
          <div className="space-y-3 text-sm text-cyan-100/85">
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-[0_10px_25px_-18px_rgba(27,167,255,0.35)]">
              <span className="flex items-center gap-2">
                <FishIcon className="w-4 h-4 text-[#29c0ff]" />
                Total Fish
              </span>
              <span className="text-white font-semibold">{MOCK_STATS.totalFish}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0a264d]/70 px-4 py-3">
              <span className="flex items-center gap-2">
                <FishIcon className="w-4 h-4 text-gray-300" />
                Common
              </span>
              <span className="text-white font-semibold">{MOCK_STATS.commonFish}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0c2f5b]/70 px-4 py-3">
              <span className="flex items-center gap-2">
                <FishIcon className="w-4 h-4 text-blue-300" />
                Rare
              </span>
              <span className="text-white font-semibold">{MOCK_STATS.rareFish}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#1b1f5a]/70 px-4 py-3">
              <span className="flex items-center gap-2">
                <FishIcon className="w-4 h-4 text-purple-300" />
                Epic
              </span>
              <span className="text-white font-semibold">{MOCK_STATS.epicFish}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#311736]/70 px-4 py-3">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-300" />
                Legendary
              </span>
              <span className="text-white font-semibold">{MOCK_STATS.legendaryFish}</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-cyan-100/70 text-center py-4">Connect wallet to view stats</p>
        )}
        </div>
      </Card>

      {/* Wallet Info */}
      {isConnected && (
        <Card
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#071a36]/85 p-5 shadow-[0_25px_70px_-45px_rgba(12,95,255,0.6)] animate-slide-in-up transition-all duration-300 ease-out"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_-10%,rgba(0,184,255,0.3),transparent_65%)]" />
          <div className="relative z-10 space-y-3">
            <h3 className="font-semibold text-white mb-1 flex items-center gap-2">
              <Coins className="w-5 h-5 text-[#60f2ff]" />
              Wallet
            </h3>
            <div className="p-3 rounded-2xl border border-white/10 bg-white/5">
              <p className="text-[11px] uppercase tracking-[0.25em] text-cyan-100/65">Address</p>
              <p className="mt-2 font-mono text-xs text-white/85 truncate">{address}</p>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-[#1f8eff]/30 bg-[#0b2145]/70 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.25em] text-cyan-100/65">Balance</p>
              <p className="text-base font-semibold text-white">1,250 FISH</p>
            </div>
          </div>
        </Card>
      )}

      {/* Bait Shop */}
      <Card
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#071a36]/85 p-5 shadow-[0_25px_70px_-45px_rgba(12,95,255,0.55)] animate-slide-in-up transition-all duration-300 ease-out"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(44,156,255,0.22),_transparent_60%)]" />
        <div className="relative z-10">
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Anchor className="w-5 h-5 text-[#29c0ff]" />
            Bait Shop
          </h3>
          <div className="space-y-3 text-sm text-cyan-100/85">
            <div className="p-3 rounded-2xl border border-white/10 bg-[#0b1e3c]/75">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-1">Common Bait</p>
              <p className="font-semibold text-white">{BAIT_PRICES.Common} FISH</p>
            </div>
            <div className="p-3 rounded-2xl border border-[#40b8ff]/35 bg-[#0b264c]/75">
              <p className="text-xs uppercase tracking-[0.2em] text-[#9cdcff] mb-1">Rare Bait</p>
              <p className="font-semibold text-white">{BAIT_PRICES.Rare} FISH</p>
            </div>
            <div className="p-3 rounded-2xl border border-[#7b5dff]/35 bg-[#161c55]/75">
              <p className="text-xs uppercase tracking-[0.2em] text-[#cabdff] mb-1">Epic Bait</p>
              <p className="font-semibold text-white">{BAIT_PRICES.Epic} FISH</p>
            </div>
            <div className="p-3 rounded-2xl border border-[#ff944d]/35 bg-[#2c1634]/75">
              <p className="text-xs uppercase tracking-[0.2em] text-[#ffd9b5] mb-1">Legendary Bait</p>
              <p className="font-semibold text-white">{BAIT_PRICES.Legendary} FISH</p>
            </div>
          </div>
        </div>
      </Card>

      {/* How to Play */}
      <Card
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#071a36]/85 p-5 shadow-[0_25px_70px_-45px_rgba(12,95,255,0.55)] animate-slide-in-up transition-all duration-300 ease-out"
        style={{ animationDelay: "0.3s" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(30,102,255,0.18),_transparent_60%)]" />
        <div className="relative z-10">
          <h3 className="font-semibold text-white mb-3">How to Play</h3>
          <div className="space-y-2 text-xs text-cyan-100/80">
            <p>1. Buy bait from the Bait Shop</p>
            <p>2. Stake FISH tokens for better chances</p>
            <p>3. Cast your line and wait ~1 minute</p>
            <p>4. Strike within 30 seconds to catch!</p>
            <p className="text-[#29c0ff] font-semibold pt-2">🎣 Higher stakes = Rarer fish!</p>
            <p className="text-[#ff9b55] font-semibold pt-2">✨ Use better bait for legendary catches!</p>
          </div>
        </div>
      </Card>

      {/* Game Mechanics */}
      <Card
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#071a36]/85 p-5 shadow-[0_25px_70px_-45px_rgba(12,95,255,0.55)] animate-slide-in-up transition-all duration-300 ease-out"
        style={{ animationDelay: "0.4s" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(0,180,255,0.18),_transparent_65%)]" />
        <div className="relative z-10">
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#29c0ff]" />
            Fishing Times
          </h3>
          <div className="space-y-3 text-sm text-cyan-100/85">
            <div className="p-3 rounded-2xl border border-[#40b8ff]/30 bg-[#0c264c]/75">
              <p className="text-xs uppercase tracking-[0.2em] text-[#9cdcff] mb-1">Cast Duration</p>
              <p className="font-semibold text-white">60 seconds</p>
            </div>
            <div className="p-3 rounded-2xl border border-[#ff944d]/35 bg-[#2c1634]/75">
              <p className="text-xs uppercase tracking-[0.2em] text-[#ffd9b5] mb-1">Strike Window</p>
              <p className="font-semibold text-white">30 seconds</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
