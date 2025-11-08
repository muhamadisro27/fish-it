"use client"

import { Fish, Coins, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { useTokenBalance } from "@/lib/hooks/useContracts"
import { useNFTCollection } from "@/lib/hooks/useNFTCollection"
import { formatUnits } from "viem"

interface AppHeaderProps {
  schedulerRunning?: boolean
}

export default function AppHeader({ schedulerRunning = false }: AppHeaderProps) {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  // Get balance and collection stats
  const { data: balance } = useTokenBalance(address)
  const { fish } = useNFTCollection()

  const handleConnect = () => {
    if (connectors[0]) {
      connect({ connector: connectors[0] })
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  // Format balance
  const formattedBalance = balance ? formatUnits(balance, 18) : "0"
  const displayBalance = parseFloat(formattedBalance).toFixed(2)

  return (
    <header className="sticky top-0 z-50 animate-slide-in-down">
      <div className="relative border-b border-white/10 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,100,255,0.15)]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1f43]/95 via-[#0a2c66]/90 to-[#041432]/95" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#21d4fd] via-[#0ab2ff] to-[#3d5fff] shadow-[0_14px_40px_-18px_rgba(12,95,255,0.9)] flex items-center justify-center">
              <Fish className="w-6 h-6 text-[#031226]" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-white/60">FishIt Aquarium</p>
              <h1 className="text-2xl font-semibold text-white">Web3 Fishing Game</h1>
            </div>
          </div>

          {/* Center Stats (when connected) */}
          {isConnected && (
            <div className="hidden lg:flex items-center gap-4">
              {/* Balance */}
              <div className="flex items-center gap-2 rounded-full border border-cyan-400/40 bg-[#0a2145]/70 px-5 py-2.5">
                <Coins className="w-4 h-4 text-[#60f2ff]" />
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-bold text-white">{displayBalance}</span>
                  <span className="text-xs text-cyan-100/70">FSHT</span>
                </div>
              </div>

              {/* Fish Count */}
              <div className="flex items-center gap-2 rounded-full border border-purple-400/40 bg-[#1a0a2e]/70 px-5 py-2.5">
                <Fish className="w-4 h-4 text-purple-300" />
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-bold text-white">{fish.length}</span>
                  <span className="text-xs text-purple-100/70">Fish</span>
                </div>
              </div>
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {schedulerRunning && (
              <div className="flex items-center gap-2 rounded-full border border-green-400/40 bg-[#15335f]/70 px-3.5 py-2 text-xs font-medium text-green-100 shadow-[0_0_22px_rgba(0,255,100,0.35)]">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                NFT Service Active
              </div>
            )}
            {isConnected ? (
              <div className="flex items-center gap-2">
                <div className="rounded-full border border-cyan-400/40 bg-[#15335f]/70 px-4 py-2 text-sm font-medium text-cyan-100">
                  {formatAddress(address!)}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => disconnect()}
                  className="rounded-full border-white/20 text-white/80 hover:bg-white/10"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={handleConnect}
                className="relative overflow-hidden rounded-full bg-gradient-to-r from-[#21d4fd] via-[#0ab2ff] to-[#3d5fff] px-6 py-2 text-[#031226] font-semibold shadow-[0_15px_45px_-12px_rgba(9,193,255,0.9)] hover:shadow-[0_20px_60px_-12px_rgba(18,127,255,0.95)] transition-all"
              >
                <span className="relative z-10">Connect Wallet</span>
                <span className="absolute inset-0 bg-white/30 opacity-0 hover:opacity-100 transition-opacity" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}


