"use client"

import FishCard from "@/components/fish-card"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, RefreshCw } from "lucide-react"
import { Fish, FishRarity } from "@/types/fish"

interface AquariumGridProps {
    onSelectFish: (fishId: bigint) => void
    onCastLine: () => void
}

const MOCK_FISH: Fish[] = [
    {
        id: BigInt(1),
        owner: "0x1234...5678",
        species: "Tuna",
        rarity: FishRarity.COMMON,
        weight: 15.5,
        stakedAmount: 100,
        baitType: "Common",
        catchTime: Date.now() - 3600000,
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
        catchTime: Date.now() - 7200000,
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
        catchTime: Date.now() - 10800000,
        isCaught: true,
    },
]

export default function AquariumGrid({ onSelectFish, onCastLine }: AquariumGridProps) {
    const loading = false

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Your Aquarium</h2>
                    <p className="text-muted-foreground mt-1">
                        {MOCK_FISH.length === 0
                            ? "Start fishing by casting your first line"
                            : `${MOCK_FISH.length} fish caught`}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={() => console.log("Refresh")}
                        disabled={loading}
                        variant="outline"
                        className="gap-2"
                        title="Refresh fish"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button
                        onClick={onCastLine}
                        className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 hover:animate-pulse-glow"
                    >
                        <Plus className="w-4 h-4" />
                        Cast Line
                    </Button>
                </div>
            </div>

            {MOCK_FISH.length === 0 ? (
                <Card className="p-12 text-center border-2 border-dashed border-primary/30">
                    <div className="text-6xl mb-4">🎣</div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Your aquarium is empty</h3>
                    <p className="text-muted-foreground mb-6">
                        Cast your first line and start your Web3 fishing journey!
                    </p>
                    <Button onClick={onCastLine} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Cast Your First Line
                    </Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {MOCK_FISH.map((fish, index) => (
                        <div
                            key={fish.id.toString()}
                            onClick={() => onSelectFish(fish.id)}
                            className="cursor-pointer"
                            style={{
                                animation: `grow 0.6s ease-out`,
                                animationDelay: `${index * 0.1}s`,
                                animationFillMode: 'both',
                            }}
                        >
                            <FishCard fish={fish} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}


