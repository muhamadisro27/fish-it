"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, Anchor } from "lucide-react"
import { BAIT_PRICES } from "@/types/fish"

interface CastLineModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CastLineModal({ isOpen, onClose }: CastLineModalProps) {
  const loading = false

  const handleCast = () => {
    console.log("Casting line...")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md overflow-hidden rounded-3xl border border-cyan-500/25 bg-[#071a36]/95 shadow-[0_30px_90px_-40px_rgba(12,95,255,0.6)] backdrop-blur-xl">
        <DialogHeader className="text-white">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <Sparkles className="w-5 h-5 text-[#29c0ff]" />
            Cast Your Fishing Line
          </DialogTitle>
          <DialogDescription className="text-cyan-100/70">
            Choose your bait and start fishing!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="relative overflow-hidden rounded-3xl border border-[#29c0ff]/25 bg-gradient-to-br from-[#0b1f43]/80 via-[#081b3a]/85 to-[#04122b]/90 p-6 text-center shadow-[0_25px_70px_-35px_rgba(12,95,255,0.7)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(42,119,255,0.25),_transparent_55%)]" />
            <div className="relative z-10">
              <div className="text-6xl mb-4 drop-shadow">🎣</div>
              <h3 className="font-bold text-xl text-white mb-2">Cast Your Line</h3>
              <p className="text-sm text-cyan-100/75 mb-4">
                Stake FISH tokens and use bait to catch unique NFT fish
              </p>

              <div className="flex justify-center gap-2 mb-4 flex-wrap text-2xl">
                <span title="Common">🐟</span>
                <span className="text-xl text-cyan-100/60">→</span>
                <span title="Rare">🐠</span>
                <span className="text-xl text-cyan-100/60">→</span>
                <span title="Epic">🦈</span>
                <span className="text-xl text-cyan-100/60">→</span>
                <span title="Legendary">🐉</span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0b2347]/75 p-4 space-y-2 text-left text-xs text-cyan-100/80">
                <p className="uppercase tracking-[0.2em] text-cyan-100/60 font-semibold">Bait Shop</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between">
                    <span>Common</span>
                    <span className="font-semibold text-white">{BAIT_PRICES.Common} FISH</span>
                  </div>
                  <div className="flex items-center justify-between text-[#7fd4ff]">
                    <span>Rare</span>
                    <span className="font-semibold text-white">{BAIT_PRICES.Rare} FISH</span>
                  </div>
                  <div className="flex items-center justify-between text-[#cabdff]">
                    <span>Epic</span>
                    <span className="font-semibold text-white">{BAIT_PRICES.Epic} FISH</span>
                  </div>
                  <div className="flex items-center justify-between text-[#ffd6a5]">
                    <span>Legendary</span>
                    <span className="font-semibold text-white">{BAIT_PRICES.Legendary} FISH</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="rounded-3xl border border-[#29c0ff]/25 bg-[#081f3f]/80 p-4 text-xs text-cyan-100/80">
            <p>
              🎯 <strong>Better bait = Rarer fish</strong>
              <br />
              💰 <strong>Higher stakes = Higher rewards</strong>
              <br />
              ⏱️ <strong>Casting time</strong>: ~1 minute wait
              <br />
              ⚡ <strong>Strike window</strong>: React within 30 seconds
              <br />
              🖼️ <strong>NFT rewards</strong>: Each fish is a unique AI-generated NFT
            </p>
          </Card>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-full border border-white/20 bg-transparent text-cyan-100/80 hover:bg-white/10"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCast}
              disabled={loading}
              className="flex-1 gap-2 rounded-full bg-gradient-to-r from-[#21d4fd] via-[#0ab2ff] to-[#3d5fff] text-[#031226] font-semibold shadow-[0_18px_55px_-18px_rgba(9,193,255,0.95)] hover:shadow-[0_22px_65px_-18px_rgba(14,146,255,0.95)] transition-all"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Casting...
                </>
              ) : (
                <>
                  <Anchor className="w-4 h-4" />
                  Cast Line
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


