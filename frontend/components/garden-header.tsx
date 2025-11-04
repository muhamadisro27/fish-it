"use client"

import { Fish, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GardenHeaderProps {
  schedulerRunning?: boolean
}

export default function GardenHeader({ schedulerRunning = false }: GardenHeaderProps) {
  const isConnected = false // Hardcoded untuk demo

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50 animate-slide-in-down">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out">
            <Fish className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">FishIt</h1>
            <p className="text-xs text-muted-foreground">Web3 Gamified Staking</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {schedulerRunning && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30">
              <RefreshCw className="w-4 h-4 text-green-600 dark:text-green-400 animate-spin" />
              <span className="text-xs font-medium text-green-600 dark:text-green-400">
                Auto-Sync Active
              </span>
            </div>
          )}
          <Button variant="outline" size="sm">
            Connect Wallet
          </Button>
        </div>
      </div>
    </header>
  )
}
