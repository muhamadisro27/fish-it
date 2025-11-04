"use client"

import { useState } from "react"
import GardenHeader from "@/components/garden-header"
import GardenGrid from "@/components/garden-grid"
import StatsSidebar from "@/components/stats-sidebar"
import PlantDetailsModal from "@/components/plant-details-modal"
import PlantSeedModal from "@/components/plant-seed-modal"
import AuroraBackground from "@/components/visual-effects/aurora-background"
import { Fish, FishRarity } from "@/types/fish"

// Hardcoded data untuk demo
const MOCK_FISH: Fish[] = [
  {
    id: BigInt(1),
    owner: "0x1234...5678",
    species: "Tuna",
    rarity: FishRarity.COMMON,
    weight: 15.5,
    stakedAmount: 100,
    baitType: "Common",
    catchTime: Date.now() - 3600000, // 1 hour ago
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
    catchTime: Date.now() - 7200000, // 2 hours ago
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
    catchTime: Date.now() - 10800000, // 3 hours ago
    isCaught: true,
  },
]

export default function Home() {
  const [selectedFishId, setSelectedFishId] = useState<bigint | null>(null)
  const [showCastModal, setShowCastModal] = useState(false)

  const selectedFish = MOCK_FISH.find((f) => f.id === selectedFishId) || null

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AuroraBackground />
      <div className="relative z-10">
        <GardenHeader schedulerRunning={false} />
        <div className="flex gap-6 p-6 max-w-7xl mx-auto">
          <main className="flex-1">
            <GardenGrid 
              onSelectPlant={setSelectedFishId} 
              onPlantSeed={() => setShowCastModal(true)} 
            />
          </main>
          <aside className="w-80">
            <StatsSidebar selectedPlantId={selectedFishId} />
          </aside>
        </div>

        {/* Modals */}
        <PlantDetailsModal
          plant={selectedFish}
          isOpen={!!selectedFishId}
          onClose={() => setSelectedFishId(null)}
        />
        <PlantSeedModal 
          isOpen={showCastModal} 
          onClose={() => setShowCastModal(false)} 
        />
      </div>
    </div>
  )
}
