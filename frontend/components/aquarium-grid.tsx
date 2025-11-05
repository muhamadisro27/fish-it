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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-3">
                    <h2 className="text-4xl font-semibold text-white drop-shadow">Your Aquarium</h2>
                    <div className="rounded-full border border-cyan-500/30 bg-[#0a2347]/70 px-4 py-1.5 text-sm text-cyan-100/90 shadow-[0_10px_25px_rgba(20,163,255,0.08)]">
                        {MOCK_FISH.length === 0
                            ? "Start fishing by casting your first line"
                            : `${MOCK_FISH.length} fish caught`}
                    </div>
                </div>
                <div className="flex gap-3 flex-wrap">
                    <Button
                        onClick={() => console.log("Refresh")}
                        disabled={loading}
                        variant="outline"
                        className="gap-2 rounded-full border-cyan-400/40 bg-[#0a2145]/70 px-5 py-2 text-cyan-100 hover:bg-[#103163]/80 hover:shadow-[0_12px_30px_-10px_rgba(18,143,255,0.6)]"
                        title="Refresh fish"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button
                        onClick={onCastLine}
                        className="gap-2 rounded-full bg-gradient-to-r from-[#00c6ff] via-[#009dff] to-[#3d5fff] px-6 py-2 text-[#031226] font-semibold shadow-[0_16px_45px_-12px_rgba(9,193,255,0.9)] hover:shadow-[0_20px_55px_-12px_rgba(18,127,255,0.95)] hover:-translate-y-0.5 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Cast Line
                    </Button>
                </div>
            </div>

            {MOCK_FISH.length === 0 ? (
                <Card className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-[#081d40]/80 p-12 text-center shadow-[0_25px_70px_-30px_rgba(13,114,255,0.6)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(42,119,255,0.25),_transparent_55%)]" />
                    <div className="relative z-10">
                        <div className="text-7xl mb-5 drop-shadow">🎣</div>
                        <h3 className="text-2xl font-semibold text-white mb-3">Your aquarium is empty</h3>
                        <p className="text-cyan-100/80 mb-7">
                            Cast your first line and start your Web3 fishing journey!
                        </p>
                        <Button
                            onClick={onCastLine}
                            className="gap-2 rounded-full bg-gradient-to-r from-[#00c6ff] via-[#009dff] to-[#3d5fff] px-6 py-2 text-[#031226] font-semibold shadow-[0_16px_45px_-12px_rgba(9,193,255,0.9)]"
                        >
                            <Plus className="w-4 h-4" />
                            Cast Your First Line
                        </Button>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MOCK_FISH.map((fish, index) => (
                        <div
                            key={fish.id.toString()}
                            onClick={() => onSelectFish(fish.id)}
                            className="cursor-pointer"
                            style={{
                                animation: `grow 0.6s ease-out`,
                                animationDelay: `${index * 0.12}s`,
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


