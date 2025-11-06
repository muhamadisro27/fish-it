"use client"

import { useState } from "react"
import AppHeader from "@/components/app-header"
import AquariumGrid from "@/components/aquarium-grid"
import StatsSidebar from "@/components/stats-sidebar"
import FishDetailsModal from "@/components/fish-details-modal"
import FishingModal from "@/components/fishing-modal"
import AuroraBackground from "@/components/visual-effects/aurora-background"
import { Fish, FishRarity } from "@/types/fish"

// Hardcoded data untuk demo
// Use fixed timestamp to avoid hydration mismatch
const BASE_TIME = 1706400000000 // Fixed timestamp

const MOCK_FISH: Fish[] = [
  {
    id: BigInt(1),
    owner: "0x1234...5678",
    species: "Tuna",
    rarity: FishRarity.COMMON,
    weight: 15.5,
    stakedAmount: 100,
    baitType: "Common",
    catchTime: BASE_TIME - 3600000, // 1 hour ago
    isCaught: true,
  },
  {
    id: BigInt(2),
    owner: "0x1234...5678",
    species: "Salmon",
    rarity: FishRarity.RARE,
    weight: 22.3,
    stakedAmount: 200,
    baitType: "Rare",
    catchTime: BASE_TIME - 7200000, // 2 hours ago
    isCaught: true,
  },
  {
    id: BigInt(3),
    owner: "0x1234...5678",
    species: "Marlin",
    rarity: FishRarity.EPIC,
    weight: 45.8,
    stakedAmount: 500,
    baitType: "Epic",
    catchTime: BASE_TIME - 10800000, // 3 hours ago
    isCaught: true,
  },
]

export default function Home() {
  const [selectedFishId, setSelectedFishId] = useState<bigint | null>(null)
  const [showFishingModal, setShowFishingModal] = useState(false)

  const selectedFish = MOCK_FISH.find((f) => f.id === selectedFishId) || null

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AuroraBackground />
      <div className="relative z-10">
        <AppHeader schedulerRunning={false} />
        <div className="flex gap-6 p-6 max-w-7xl mx-auto">
          <main className="flex-1">
            <AquariumGrid 
              onSelectFish={setSelectedFishId} 
              onCastLine={() => setShowFishingModal(true)} 
            />
          </main>
          <aside className="w-80">
            <StatsSidebar selectedFishId={selectedFishId} />
          </aside>
        </div>

        {/* Modals */}
        <FishDetailsModal
          fish={selectedFish}
          isOpen={!!selectedFishId}
          onClose={() => setSelectedFishId(null)}
        />
        <FishingModal 
          isOpen={showFishingModal} 
          onClose={() => setShowFishingModal(false)} 
        />
      </div>
    </div>
  )
}
