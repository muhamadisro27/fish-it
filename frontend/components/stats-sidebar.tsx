"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Fish as FishIcon, Sparkles, Coins, Clock, Anchor, Gift, ShoppingCart, Trophy } from "lucide-react"
import { BAIT_PRICES, FishRarity } from "@/types/fish"
import { useAccount } from "wagmi"
import { useTokenBalance, useFaucetClaim, useFaucetCanClaim, useFaucetNextClaimTime, useBaitInventory, useBaitPrice, useStakeInfo, useClaimReward } from "@/lib/hooks/useContracts"
import { formatUnits } from "viem"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import BuyBaitModal from "./buy-bait-modal"
import { useNFTCollection } from "@/lib/hooks/useNFTCollection"

interface StatsSidebarProps {
  selectedFishId: bigint | null
  onNFTClaimed?: () => void
}

export default function StatsSidebar({ selectedFishId, onNFTClaimed }: StatsSidebarProps) {
  const { address, isConnected } = useAccount()
  const { toast } = useToast()
  const [countdown, setCountdown] = useState<string>("")
  const [buyBaitModalOpen, setBuyBaitModalOpen] = useState(false)
  const [selectedBait, setSelectedBait] = useState<{ type: 0 | 1 | 2 | 3; name: string } | null>(null)
  const [activeTab, setActiveTab] = useState<"shop" | "stats" | "guide">("shop")

  // NFT Collection hook - Get real stats
  const { fish: nftCollection } = useNFTCollection()

  // Calculate real stats from NFT collection
  const aquariumStats = {
    totalFish: nftCollection.length,
    commonFish: nftCollection.filter(f => f.rarity === FishRarity.COMMON).length,
    rareFish: nftCollection.filter(f => f.rarity === FishRarity.RARE).length,
    epicFish: nftCollection.filter(f => f.rarity === FishRarity.EPIC).length,
    legendaryFish: nftCollection.filter(f => f.rarity === FishRarity.LEGENDARY).length,
  }

  // Blockchain hooks
  const { data: balance, refetch: refetchBalance } = useTokenBalance(address)
  const { data: canClaim, refetch: refetchCanClaim } = useFaucetCanClaim(address)
  const { data: nextClaimTime } = useFaucetNextClaimTime(address)
  const { claim, isConfirming, isConfirmed, isPending } = useFaucetClaim()

  // Staking hooks
  const { data: stakeInfo, refetch: refetchStakeInfo } = useStakeInfo(address)
  const { claimReward, isConfirming: isClaimingNFT, isConfirmed: isNFTClaimed, isPending: isNFTPending } = useClaimReward()

  // Bait inventory hooks
  const { data: commonBait } = useBaitInventory(address, 0)
  const { data: rareBait } = useBaitInventory(address, 1)
  const { data: epicBait } = useBaitInventory(address, 2)
  const { data: legendaryBait } = useBaitInventory(address, 3)

  // Bait prices hooks
  const { data: commonPrice } = useBaitPrice(0)
  const { data: rarePrice } = useBaitPrice(1)
  const { data: epicPrice } = useBaitPrice(2)
  const { data: legendaryPrice } = useBaitPrice(3)

  // Check if NFT is ready to claim (state 4 = ReadyToClaim)
  const hasNFTReady = stakeInfo && stakeInfo[2] === 4

  // Format balance
  const formattedBalance = balance ? formatUnits(balance, 18) : "0"
  const displayBalance = parseFloat(formattedBalance).toFixed(2)

  // Format address
  const formattedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""

  // Countdown timer
  useEffect(() => {
    if (!nextClaimTime || canClaim) {
      setCountdown("")
      return
    }

    const updateCountdown = () => {
      const now = Math.floor(Date.now() / 1000)
      const timeLeft = Number(nextClaimTime) - now

      if (timeLeft <= 0) {
        setCountdown("")
        refetchCanClaim()
        return
      }

      const hours = Math.floor(timeLeft / 3600)
      const minutes = Math.floor((timeLeft % 3600) / 60)
      const seconds = timeLeft % 60

      setCountdown(`${hours}h ${minutes}m ${seconds}s`)
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextClaimTime, canClaim])

  // Handle claim success
  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "🎉 Claimed Successfully!",
        description: "10 FSHT has been added to your wallet",
      })
      refetchBalance()
      refetchCanClaim()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmed])

  // Handle claim
  const handleClaim = () => {
    if (!canClaim) {
      toast({
        title: "Cannot Claim Yet",
        description: `Next claim available in ${countdown}`,
        variant: "destructive",
      })
      return
    }
    claim()
  }

  // Handle buy bait
  const handleBuyBait = (type: 0 | 1 | 2 | 3, name: string) => {
    setSelectedBait({ type, name })
    setBuyBaitModalOpen(true)
  }

  // Close modal handler
  const handleCloseBaitModal = () => {
    setBuyBaitModalOpen(false)
    setSelectedBait(null)
  }

  // Handle claim NFT
  const handleClaimNFT = () => {
    claimReward()
  }

  // Handle NFT claim success
  useEffect(() => {
    if (isNFTClaimed) {
      toast({
        title: "🎉 NFT Claimed!",
        description: "Check your collection!",
      })
      refetchStakeInfo()
      // Trigger parent refetch to update aquarium
      if (onNFTClaimed) {
        setTimeout(() => onNFTClaimed(), 1000)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNFTClaimed])

  return (
    <div className="space-y-4 sticky top-24">
      {/* Quick Stats - Always Visible */}
      {isConnected && (
        <div className="grid grid-cols-2 gap-3">
          {/* Balance Card - Enhanced with hover effects */}
          <Card className="group relative overflow-hidden rounded-2xl border border-cyan-400/40 bg-gradient-to-br from-[#0a2145]/90 to-[#041432]/90 p-4 shadow-[0_20px_50px_-30px_rgba(6,182,212,0.5)] transition-all duration-300 hover:shadow-[0_25px_60px_-25px_rgba(6,182,212,0.8)] hover:scale-[1.02] hover:border-cyan-400/60 cursor-pointer">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(6,182,212,0.15),_transparent_70%)] group-hover:bg-[radial-gradient(circle_at_top_right,_rgba(6,182,212,0.25),_transparent_60%)] transition-all duration-300" />
            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="w-4 h-4 text-[#60f2ff] group-hover:scale-110 transition-transform duration-300" />
                <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-100/60 group-hover:text-cyan-100/80 transition-colors">Balance</p>
              </div>
              <p className="text-2xl font-bold text-white group-hover:text-cyan-50 transition-colors">{displayBalance}</p>
              <p className="text-xs text-cyan-100/70 mt-1 group-hover:text-cyan-100/90 transition-colors">FSHT</p>
            </div>
          </Card>

          {/* Fish Count Card - Enhanced with hover effects */}
          <Card className="group relative overflow-hidden rounded-2xl border border-purple-400/40 bg-gradient-to-br from-[#1a0a2e]/90 to-[#0a0520]/90 p-4 shadow-[0_20px_50px_-30px_rgba(168,85,247,0.5)] transition-all duration-300 hover:shadow-[0_25px_60px_-25px_rgba(168,85,247,0.8)] hover:scale-[1.02] hover:border-purple-400/60 cursor-pointer">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(168,85,247,0.15),_transparent_70%)] group-hover:bg-[radial-gradient(circle_at_top_right,_rgba(168,85,247,0.25),_transparent_60%)] transition-all duration-300" />
            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <FishIcon className="w-4 h-4 text-purple-300 group-hover:scale-110 transition-transform duration-300" />
                <p className="text-[10px] uppercase tracking-[0.2em] text-purple-100/60 group-hover:text-purple-100/80 transition-colors">Collection</p>
              </div>
              <p className="text-2xl font-bold text-white group-hover:text-purple-50 transition-colors">{aquariumStats.totalFish}</p>
              <p className="text-xs text-purple-100/70 mt-1 group-hover:text-purple-100/90 transition-colors">Fish</p>
            </div>
          </Card>
        </div>
      )}
      
      {/* Faucet Card */}
      {isConnected && (
        <Card className="relative overflow-hidden rounded-3xl border border-green-500/30 bg-gradient-to-br from-[#0a3d2e]/90 via-[#071d3d]/90 to-[#071d3d]/90 p-5 shadow-[0_25px_70px_-40px_rgba(34,197,94,0.5)] animate-slide-in-up transition-all duration-300 ease-out">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.2),_transparent_60%)]" />
          <div className="relative z-10">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Gift className="w-5 h-5 text-green-400" />
              Free FSHT Faucet
            </h3>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl border border-green-500/30 bg-green-500/10">
                <p className="text-xs uppercase tracking-[0.2em] text-green-200/70 mb-2">Claim Amount</p>
                <p className="text-2xl font-bold text-white">10 FSHT</p>
                <p className="text-xs text-green-200/60 mt-1">Every 24 hours</p>
              </div>
              
              <Button
                onClick={handleClaim}
                disabled={!canClaim || isPending || isConfirming}
                className="group w-full rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg hover:shadow-green-500/50 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden"
              >
                {/* Ripple effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                {isPending || isConfirming ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isPending ? "Confirm in wallet..." : "Claiming..."}
                  </span>
                ) : canClaim ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-bounce">🎁</span>
                    Claim 10 FSHT
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {countdown || "Loading..."}
                  </span>
                )}
                </div>
              </Button>
              
              {!canClaim && countdown && (
                <p className="text-xs text-center text-green-200/60">
                  Next claim available in {countdown}
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* NFT Claim Card */}
      {isConnected && hasNFTReady && (
        <Card className="relative overflow-hidden rounded-3xl border border-yellow-500/30 bg-gradient-to-br from-[#3d2a0a]/90 via-[#071d3d]/90 to-[#071d3d]/90 p-5 shadow-[0_25px_70px_-40px_rgba(234,179,8,0.6)] animate-slide-in-up transition-all duration-300 ease-out animate-pulse">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(234,179,8,0.3),_transparent_60%)]" />
          <div className="relative z-10">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              NFT Ready!
            </h3>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl border border-yellow-500/30 bg-yellow-500/10">
                <p className="text-xs uppercase tracking-[0.2em] text-yellow-200/70 mb-2">Your Catch</p>
                <p className="text-xl font-bold text-white">🐟 Fish NFT</p>
                <p className="text-xs text-yellow-200/60 mt-1">Ready to be claimed!</p>
              </div>
              
              <Button
                onClick={handleClaimNFT}
                disabled={isNFTPending || isClaimingNFT}
                className="group w-full rounded-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white font-bold shadow-lg hover:shadow-yellow-500/50 hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden animate-pulse"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                <div className="relative z-10">
                {isNFTPending || isClaimingNFT ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isNFTPending ? "Confirm in wallet..." : "Claiming..."}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 animate-bounce" />
                    <span className="animate-pulse">🎁 Claim NFT Now!</span>
                  </span>
                )}
                </div>
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Tabs Navigation - Enhanced with smooth transitions */}
      {isConnected && (
        <div className="flex gap-2 p-1 rounded-2xl border border-white/10 bg-[#071a36]/60 backdrop-blur-sm">
          <button
            onClick={() => setActiveTab("shop")}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === "shop"
                ? "bg-gradient-to-r from-[#00c6ff] to-[#009dff] text-[#031226] shadow-lg shadow-cyan-500/30 scale-[1.02]"
                : "text-cyan-100/70 hover:text-cyan-100 hover:bg-white/5 hover:scale-[1.01] active:scale-[0.98]"
            }`}
          >
            🛒 Shop
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === "stats"
                ? "bg-gradient-to-r from-[#00c6ff] to-[#009dff] text-[#031226] shadow-lg shadow-cyan-500/30 scale-[1.02]"
                : "text-cyan-100/70 hover:text-cyan-100 hover:bg-white/5 hover:scale-[1.01] active:scale-[0.98]"
            }`}
          >
            📊 Stats
          </button>
          <button
            onClick={() => setActiveTab("guide")}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === "guide"
                ? "bg-gradient-to-r from-[#00c6ff] to-[#009dff] text-[#031226] shadow-lg shadow-cyan-500/30 scale-[1.02]"
                : "text-cyan-100/70 hover:text-cyan-100 hover:bg-white/5 hover:scale-[1.01] active:scale-[0.98]"
            }`}
          >
            📖 Guide
          </button>
        </div>
      )}

      {/* Tab Content */}
      {isConnected && activeTab === "shop" && (
        <>
      {/* Bait Shop */}
      <Card
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#071a36]/85 p-5 shadow-[0_25px_70px_-45px_rgba(12,95,255,0.55)] animate-slide-in-up transition-all duration-300 ease-out"
        style={{ animationDelay: "0.05s" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(44,156,255,0.22),_transparent_60%)]" />
        <div className="relative z-10">
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Anchor className="w-5 h-5 text-[#29c0ff]" />
            Bait Shop
          </h3>
          {isConnected ? (
            <div className="space-y-3 text-sm">
              {/* Common Bait */}
              <div className="p-3 rounded-2xl border border-white/10 bg-[#0b1e3c]/75">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/50">Common Bait</p>
                    <p className="font-semibold text-white">
                      {commonPrice ? (parseInt(commonPrice.toString()) / 1e18).toFixed(0) : "..."} FSHT
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/50">Owned</p>
                    <p className="text-lg font-bold text-white">{commonBait?.toString() || "0"}</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => handleBuyBait(0, "Common")}
                  className="w-full rounded-full bg-gray-600 hover:bg-gray-700 text-white"
                >
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  Buy
                </Button>
              </div>

              {/* Rare Bait */}
              <div className="p-3 rounded-2xl border border-[#40b8ff]/35 bg-[#0b264c]/75">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#9cdcff]">Rare Bait</p>
                    <p className="font-semibold text-white">
                      {rarePrice ? (parseInt(rarePrice.toString()) / 1e18).toFixed(0) : "..."} FSHT
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/50">Owned</p>
                    <p className="text-lg font-bold text-white">{rareBait?.toString() || "0"}</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => handleBuyBait(1, "Rare")}
                  className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  Buy
                </Button>
              </div>

              {/* Epic Bait */}
              <div className="p-3 rounded-2xl border border-[#7b5dff]/35 bg-[#161c55]/75">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#cabdff]">Epic Bait</p>
                    <p className="font-semibold text-white">
                      {epicPrice ? (parseInt(epicPrice.toString()) / 1e18).toFixed(0) : "..."} FSHT
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/50">Owned</p>
                    <p className="text-lg font-bold text-white">{epicBait?.toString() || "0"}</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => handleBuyBait(2, "Epic")}
                  className="w-full rounded-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  Buy
                </Button>
              </div>

              {/* Legendary Bait */}
              <div className="p-3 rounded-2xl border border-[#ff944d]/35 bg-[#2c1634]/75">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#ffd9b5]">Legendary Bait</p>
                    <p className="font-semibold text-white">
                      {legendaryPrice ? (parseInt(legendaryPrice.toString()) / 1e18).toFixed(0) : "..."} FSHT
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/50">Owned</p>
                    <p className="text-lg font-bold text-white">{legendaryBait?.toString() || "0"}</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => handleBuyBait(3, "Legendary")}
                  className="w-full rounded-full bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  Buy
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-cyan-100/70 text-center py-4">Connect wallet to buy bait</p>
          )}
        </div>
      </Card>
        </>
      )}

      {isConnected && activeTab === "stats" && (
        <>
      {/* Aquarium Stats */}
      <Card className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-[#071d3d]/85 p-5 shadow-[0_25px_70px_-40px_rgba(12,95,255,0.6)] animate-slide-in-up transition-all duration-300 ease-out" style={{ animationDelay: "0.05s" }}>
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
              <span className="text-white font-semibold">{aquariumStats.totalFish}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0a264d]/70 px-4 py-3">
              <span className="flex items-center gap-2">
                <FishIcon className="w-4 h-4 text-gray-300" />
                Common
              </span>
              <span className="text-white font-semibold">{aquariumStats.commonFish}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0c2f5b]/70 px-4 py-3">
              <span className="flex items-center gap-2">
                <FishIcon className="w-4 h-4 text-blue-300" />
                Rare
              </span>
              <span className="text-white font-semibold">{aquariumStats.rareFish}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#1b1f5a]/70 px-4 py-3">
              <span className="flex items-center gap-2">
                <FishIcon className="w-4 h-4 text-purple-300" />
                Epic
              </span>
              <span className="text-white font-semibold">{aquariumStats.epicFish}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#311736]/70 px-4 py-3">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-300" />
                Legendary
              </span>
              <span className="text-white font-semibold">{aquariumStats.legendaryFish}</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-cyan-100/70 text-center py-4">Connect wallet to view stats</p>
        )}
        </div>
      </Card>
        </>
      )}

      {isConnected && activeTab === "guide" && (
        <>
      {/* How to Play */}
      <Card
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#071a36]/85 p-5 shadow-[0_25px_70px_-45px_rgba(12,95,255,0.55)] animate-slide-in-up transition-all duration-300 ease-out"
        style={{ animationDelay: "0.05s" }}
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
        style={{ animationDelay: "0.1s" }}
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
        </>
      )}

      {/* Buy Bait Modal */}
      <BuyBaitModal
        isOpen={buyBaitModalOpen}
        onClose={handleCloseBaitModal}
        baitType={selectedBait?.type ?? null}
        baitName={selectedBait?.name ?? ""}
      />
    </div>
  )
}
