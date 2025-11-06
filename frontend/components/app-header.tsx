"use client"

import { Fish } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { useEffect } from "react"

interface AppHeaderProps {
    schedulerRunning?: boolean
}

export default function AppHeader({ schedulerRunning = false }: AppHeaderProps) {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  // Auto-connect if previously connected
  useEffect(() => {
    if (!isConnected && typeof window !== 'undefined') {
      const cachedConnector = localStorage.getItem('wagmi.recentConnectorId')
      if (cachedConnector) {
        const connector = connectors.find(c => c.id === cachedConnector)
        if (connector) {
          connect({ connector })
        }
      }
    }
  }, [isConnected, connectors, connect])

  const handleConnect = () => {
    if (connectors[0]) {
      connect({ connector: connectors[0] })
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <header className="sticky top-0 z-50 animate-slide-in-down">
      <div className="relative border-b border-white/10 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1f43]/90 via-[#0a2c66]/85 to-[#041432]/90" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#21d4fd] via-[#0ab2ff] to-[#3d5fff] shadow-[0_14px_40px_-18px_rgba(12,95,255,0.9)] flex items-center justify-center">
              <Fish className="w-6 h-6 text-[#031226]" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-white/60">FishIt Aquarium</p>
              <h1 className="text-2xl font-semibold text-white">Web3 Fishing Game</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {schedulerRunning && (
              <div className="flex items-center gap-2 rounded-full border border-cyan-400/40 bg-[#15335f]/70 px-3.5 py-2 text-xs font-medium text-cyan-100 shadow-[0_0_22px_rgba(0,183,255,0.35)]">
                Auto-Sync Active
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


