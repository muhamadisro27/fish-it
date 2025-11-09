"use client"

import FishCard from "@/components/fish-card"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, RefreshCw, Loader2 } from "lucide-react"
import { useNFTCollection } from "@/lib/hooks/useNFTCollection"
import { useAccount } from "wagmi"

interface AquariumGridProps {
    onSelectFish: (fishId: bigint) => void
    onCastLine: () => void
}

export default function AquariumGrid({ onSelectFish, onCastLine }: AquariumGridProps) {
    const { isConnected } = useAccount()
    const { fish, isLoading, error, refetch, totalCount } = useNFTCollection()

    const loading = isLoading

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-3">
                    <h2 className="text-4xl font-semibold text-white drop-shadow">Your Aquarium</h2>
                    <div className="rounded-full border border-cyan-500/30 bg-[#0a2347]/70 px-4 py-1.5 text-sm text-cyan-100/90 shadow-[0_10px_25px_rgba(20,163,255,0.08)]">
                        {!isConnected ? (
                            "Connect wallet to view your collection"
                        ) : isLoading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Loading collection...
                            </span>
                        ) : totalCount === 0 ? (
                            "Start fishing by casting your first line"
                        ) : (
                            `${totalCount} fish caught`
                        )}
                    </div>
                </div>
                <div className="flex gap-3 flex-wrap">
                    <Button
                        onClick={() => refetch()}
                        disabled={loading || !isConnected}
                        variant="outline"
                        className="group gap-2 rounded-full border-cyan-400/40 bg-[#0a2145]/70 px-5 py-2 text-cyan-100 hover:bg-[#103163]/80 hover:shadow-[0_12px_30px_-10px_rgba(18,143,255,0.6)] hover:border-cyan-400/60 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        title="Refresh fish"
                    >
                        <RefreshCw className={`w-4 h-4 transition-transform duration-300 ${loading ? 'animate-spin' : 'group-hover:rotate-180'}`} />
                        Refresh
                    </Button>
                    <Button
                        onClick={onCastLine}
                        disabled={!isConnected}
                        className="group gap-2 rounded-full bg-gradient-to-r from-[#00c6ff] via-[#009dff] to-[#3d5fff] px-6 py-2 text-[#031226] font-semibold shadow-[0_16px_45px_-12px_rgba(9,193,255,0.9)] hover:shadow-[0_20px_55px_-12px_rgba(18,127,255,0.95)] hover:-translate-y-0.5 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100 relative overflow-hidden"
                    >
                        {/* Shine effect on hover */}
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                        <Plus className="w-4 h-4 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
                        <span className="relative z-10">Cast Line</span>
                    </Button>
                </div>
            </div>

            {!isConnected ? (
                <Card className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-[#081d40]/80 p-12 text-center shadow-[0_25px_70px_-30px_rgba(13,114,255,0.6)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(42,119,255,0.25),_transparent_55%)]" />
                    <div className="relative z-10">
                        <div className="text-7xl mb-5 drop-shadow">🔌</div>
                        <h3 className="text-2xl font-semibold text-white mb-3">Connect Your Wallet</h3>
                        <p className="text-cyan-100/80">
                            Connect your wallet to view your fish collection
                        </p>
                    </div>
                </Card>
            ) : error ? (
                <Card className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-[#3d0808]/80 p-12 text-center shadow-[0_25px_70px_-30px_rgba(255,13,13,0.6)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,42,42,0.25),_transparent_55%)]" />
                    <div className="relative z-10">
                        <div className="text-7xl mb-5 drop-shadow">❌</div>
                        <h3 className="text-2xl font-semibold text-white mb-3">Error Loading Collection</h3>
                        <p className="text-red-100/80 mb-7">{error}</p>
                        <Button
                            onClick={() => refetch()}
                            variant="outline"
                            className="border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/20"
                        >
                            Try Again
                        </Button>
                    </div>
                </Card>
            ) : isLoading ? (
                <Card className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-[#081d40]/80 p-12 text-center shadow-[0_25px_70px_-30px_rgba(13,114,255,0.6)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(42,119,255,0.25),_transparent_55%)]" />
                    <div className="relative z-10">
                        <Loader2 className="w-16 h-16 animate-spin text-cyan-400 mx-auto mb-5" />
                        <h3 className="text-2xl font-semibold text-white mb-3">Loading Collection</h3>
                        <p className="text-cyan-100/80">
                            Fetching your fish from the blockchain...
                        </p>
                    </div>
                </Card>
            ) : fish.length === 0 ? (
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
                    {fish.map((fishItem, index) => (
                        <div
                            key={fishItem.id.toString()}
                            onClick={() => onSelectFish(fishItem.id)}
                            className="cursor-pointer"
                            style={{
                                animation: `grow 0.6s ease-out`,
                                animationDelay: `${index * 0.12}s`,
                                animationFillMode: 'both',
                            }}
                        >
                            <FishCard fish={fishItem} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}


