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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            Cast Your Fishing Line
          </DialogTitle>
          <DialogDescription>Choose your bait and start fishing!</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="p-6 border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="text-center">
              <div className="text-6xl mb-4">🎣</div>
              <h3 className="font-bold text-xl text-foreground mb-2">Cast Your Line</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Stake FISH tokens and use bait to catch unique NFT fish
              </p>

              <div className="flex justify-center gap-2 mb-4 flex-wrap">
                <span className="text-2xl" title="Common">🐟</span>
                <span className="text-xl text-muted-foreground">→</span>
                <span className="text-2xl" title="Rare">🐠</span>
                <span className="text-xl text-muted-foreground">→</span>
                <span className="text-2xl" title="Epic">🦈</span>
                <span className="text-xl text-muted-foreground">→</span>
                <span className="text-2xl" title="Legendary">🐉</span>
              </div>

              <div className="bg-card border border-border rounded-lg p-3 space-y-2">
                <p className="text-xs text-muted-foreground mb-2 font-semibold">Bait Shop</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Common</span>
                    <span className="font-semibold">{BAIT_PRICES.Common} FISH</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Rare</span>
                    <span className="font-semibold text-blue-500">{BAIT_PRICES.Rare} FISH</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Epic</span>
                    <span className="font-semibold text-purple-500">{BAIT_PRICES.Epic} FISH</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Legendary</span>
                    <span className="font-semibold text-orange-500">{BAIT_PRICES.Legendary} FISH</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-3 bg-muted/30 border-primary/20">
            <p className="text-xs text-muted-foreground">
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

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCast}
              disabled={loading}
              className="flex-1 gap-2 bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
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


