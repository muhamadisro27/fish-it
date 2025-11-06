"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { ShoppingCart, Anchor, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { parseUnits } from "viem"
import { useTokenApprove, useTokenAllowance, useBuyBait, useBaitPrice } from "@/lib/hooks/useContracts"
import { CONTRACTS } from "@/lib/config/contracts"
import { useToast } from "@/hooks/use-toast"

interface BuyBaitModalProps {
  isOpen: boolean
  onClose: () => void
  baitType: 0 | 1 | 2 | 3 | null
  baitName: string
}

const BAIT_COLORS = {
  0: { bg: "bg-gray-500/10", border: "border-gray-500/30", text: "text-gray-300" },
  1: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-300" },
  2: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-300" },
  3: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-300" },
}

export default function BuyBaitModal({ isOpen, onClose, baitType, baitName }: BuyBaitModalProps) {
  const { address } = useAccount()
  const { toast } = useToast()
  const [quantity, setQuantity] = useState("1")
  const [step, setStep] = useState<"approve" | "buy">("approve")

  // Blockchain hooks
  const { data: baitPrice } = useBaitPrice(baitType ?? 0)
  const { data: allowance, refetch: refetchAllowance } = useTokenAllowance(address, CONTRACTS.FishItBaitShop)
  const { approve, isConfirming: isApproving, isConfirmed: isApproved, isPending: isApprovePending } = useTokenApprove()
  const { buyBait, isConfirming: isBuying, isConfirmed: isBought, isPending: isBuyPending } = useBuyBait()

  // Calculate total cost
  const quantityNum = parseInt(quantity) || 0
  const totalCost = baitPrice ? (BigInt(quantityNum) * baitPrice) : BigInt(0)
  const needsApproval = allowance !== undefined && totalCost > allowance

  // Reset on open/close
  useEffect(() => {
    if (isOpen) {
      setQuantity("1")
      setStep("approve")
      refetchAllowance()
    }
  }, [isOpen, refetchAllowance])

  // Check approval status
  useEffect(() => {
    if (!needsApproval && allowance !== undefined) {
      setStep("buy")
    }
  }, [needsApproval, allowance])

  // Handle approval success
  useEffect(() => {
    if (isApproved) {
      refetchAllowance()
      toast({
        title: "✅ Approval Successful!",
        description: "You can now buy bait",
      })
      setStep("buy")
    }
  }, [isApproved, refetchAllowance, toast])

  // Handle buy success
  useEffect(() => {
    if (isBought) {
      toast({
        title: "🎉 Bait Purchased!",
        description: `${quantity}x ${baitName} bait added to your inventory`,
      })
      setTimeout(() => onClose(), 1500)
    }
  }, [isBought, quantity, baitName, onClose, toast])

  // Handle approve
  const handleApprove = () => {
    if (!address || totalCost === BigInt(0)) return
    
    // Approve dengan buffer (2x total cost untuk avoid multiple approvals)
    const approvalAmount = totalCost * BigInt(2)
    approve(CONTRACTS.FishItBaitShop, approvalAmount)
  }

  // Handle buy
  const handleBuy = () => {
    if (baitType === null || quantityNum === 0) return
    buyBait(baitType, BigInt(quantityNum))
  }

  if (baitType === null) return null

  const colors = BAIT_COLORS[baitType]
  const isLoading = isApprovePending || isApproving || isBuyPending || isBuying

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md overflow-hidden rounded-3xl border border-cyan-500/25 bg-[#071a36]/95 shadow-[0_30px_90px_-40px_rgba(12,95,255,0.6)] backdrop-blur-xl">
        <DialogHeader className="text-white">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <ShoppingCart className="w-5 h-5 text-[#29c0ff]" />
            Buy {baitName} Bait
          </DialogTitle>
          <DialogDescription className="text-cyan-100/70">
            Purchase bait to start fishing
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Bait Info */}
          <Card className={`relative overflow-hidden rounded-2xl border ${colors.border} ${colors.bg} p-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Price per bait</p>
                <p className="text-2xl font-bold text-white">
                  {baitPrice ? (parseInt(baitPrice.toString()) / 1e18).toFixed(0) : "..."} FSHT
                </p>
              </div>
              <Anchor className={`w-12 h-12 ${colors.text}`} />
            </div>
          </Card>

          {/* Quantity Input */}
          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-white">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max="100"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="rounded-full border-cyan-500/30 bg-[#0b2347]/75 text-white"
              disabled={isLoading}
            />
          </div>

          {/* Total Cost */}
          <Card className="rounded-2xl border border-cyan-500/30 bg-[#0b2347]/75 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-cyan-100/70">Total Cost</p>
              <p className="text-xl font-bold text-white">
                {(Number(totalCost) / 1e18).toFixed(2)} FSHT
              </p>
            </div>
          </Card>

          {/* Approval Warning */}
          {needsApproval && step === "approve" && (
            <Card className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5" />
                <div className="text-xs text-yellow-200">
                  <p className="font-semibold mb-1">Approval Required</p>
                  <p>You need to approve the BaitShop contract to spend your FSHT tokens first.</p>
                </div>
              </div>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-full border border-white/20 bg-transparent text-cyan-100/80 hover:bg-white/10"
            >
              Cancel
            </Button>
            
            {step === "approve" && needsApproval ? (
              <Button
                onClick={handleApprove}
                disabled={isLoading || quantityNum === 0}
                className="flex-1 gap-2 rounded-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white font-semibold shadow-lg hover:shadow-orange-500/50 transition-all"
              >
                {isApprovePending || isApproving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isApprovePending ? "Confirm..." : "Approving..."}
                  </>
                ) : (
                  "Approve FSHT"
                )}
              </Button>
            ) : (
              <Button
                onClick={handleBuy}
                disabled={isLoading || quantityNum === 0}
                className="flex-1 gap-2 rounded-full bg-gradient-to-r from-[#21d4fd] via-[#0ab2ff] to-[#3d5fff] text-[#031226] font-semibold shadow-lg hover:shadow-cyan-500/50 transition-all"
              >
                {isBuyPending || isBuying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#031226] border-t-transparent rounded-full animate-spin" />
                    {isBuyPending ? "Confirm..." : "Buying..."}
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    Buy Bait
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

