"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Fish, Anchor, AlertCircle, Loader2, Trophy, XCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { parseUnits } from "viem"
import {
  useStakeInfo,
  useTokenApprove,
  useTokenAllowance,
  useStartFishing,
  useEnterCastingPhase,
  useEnterStrikePhase,
  useUnstake,
  useBaitInventory,
  useCastingTimeRemaining,
  useStrikeTimeRemaining,
} from "@/lib/hooks/useContracts"
import { CONTRACTS } from "@/lib/config/contracts"
import { useToast } from "@/hooks/use-toast"

interface FishingModalProps {
  isOpen: boolean
  onClose: () => void
}

type FishingPhase = "select" | "approve" | "starting" | "chumming" | "casting" | "strike" | "success" | "failed"

const BAIT_NAMES = ["Common", "Rare", "Epic", "Legendary"]
const BAIT_COLORS = {
  0: { bg: "bg-gray-500/10", border: "border-gray-500/30", text: "text-gray-300" },
  1: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-300" },
  2: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-300" },
  3: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-300" },
}

export default function FishingModal({ isOpen, onClose }: FishingModalProps) {
  const { address } = useAccount()
  const { toast } = useToast()

  // State
  const [phase, setPhase] = useState<FishingPhase>("select")
  const [selectedBait, setSelectedBait] = useState<0 | 1 | 2 | 3>(0)
  const [stakeAmount, setStakeAmount] = useState("10")
  const [countdown, setCountdown] = useState(0)

  // Local loading states for immediate UI feedback
  const [isStrikeLoading, setIsStrikeLoading] = useState(false)
  const [isUnstakeLoading, setIsUnstakeLoading] = useState(false)

  // Blockchain hooks
  const { data: stakeInfo, refetch: refetchStakeInfo } = useStakeInfo(address)

  // Fetch inventory for all 4 bait types
  const { data: commonBaitInventory } = useBaitInventory(address, 0)
  const { data: rareBaitInventory } = useBaitInventory(address, 1)
  const { data: epicBaitInventory } = useBaitInventory(address, 2)
  const { data: legendaryBaitInventory } = useBaitInventory(address, 3)

  const { data: allowance, refetch: refetchAllowance } = useTokenAllowance(address, CONTRACTS.FishItStaking)
  const { data: castingTimeLeft } = useCastingTimeRemaining(address)
  const { data: strikeTimeLeft } = useStrikeTimeRemaining(address)

  // Transaction hooks
  const { approve, isConfirming: isApproving, isConfirmed: isApproved, isPending: isApprovePending } = useTokenApprove()
  const { startFishing, isConfirming: isStarting, isConfirmed: isStarted, isPending: isStartPending } = useStartFishing()
  const { enterCasting, isConfirming: isEnteringCasting, isConfirmed: isEnteredCasting } = useEnterCastingPhase()
  const { enterStrike, isConfirming: isEnteringStrike, isConfirmed: isEnteredStrike } = useEnterStrikePhase()
  const { unstake, isConfirming: isUnstaking, isConfirmed: isUnstaked, isPending: isUnstakePending } = useUnstake()

  // Get inventory for selected bait
  const getBaitInventory = (baitType: 0 | 1 | 2 | 3): bigint => {
    switch (baitType) {
      case 0: return commonBaitInventory ?? BigInt(0)
      case 1: return rareBaitInventory ?? BigInt(0)
      case 2: return epicBaitInventory ?? BigInt(0)
      case 3: return legendaryBaitInventory ?? BigInt(0)
      default: return BigInt(0)
    }
  }

  // Parse amounts
  const stakeAmountBigInt = stakeAmount ? parseUnits(stakeAmount, 18) : BigInt(0)
  const needsApproval = allowance !== undefined && stakeAmountBigInt > allowance
  const selectedBaitInventory = getBaitInventory(selectedBait)
  const hasBait = selectedBaitInventory > BigInt(0)

  // Initialize phase based on stakeInfo
  useEffect(() => {
    if (!isOpen || !stakeInfo) return

    const [, , state] = stakeInfo

    // State: 0=Idle, 1=Chumming, 2=Casting, 3=Strike, 4=ReadyToClaim
    if (state === 1) {
      setPhase("chumming")
    } else if (state === 2) {
      setPhase("casting")
    } else if (state === 3) {
      setPhase("strike")
    } else if (state === 4) {
      setPhase("success")
    } else {
      setPhase("select")
    }
  }, [isOpen, stakeInfo])

  // Auto-enter casting after start
  useEffect(() => {
    if (isStarted && phase === "starting") {
      setPhase("chumming")
      // Auto enter casting phase
      setTimeout(() => {
        enterCasting()
      }, 1000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStarted, phase])

  // Handle casting phase entry
  useEffect(() => {
    if (isEnteredCasting) {
      setPhase("casting")
      toast({
        title: "🎣 Line Cast!",
        description: "Wait 60 seconds for a fish to bite...",
      })
      refetchStakeInfo()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnteredCasting])

  // Notify when casting is done - USER MUST CLICK BUTTON MANUALLY
  useEffect(() => {
    if (phase === "casting" && castingTimeLeft === BigInt(0)) {
      // DO NOT auto-trigger enterStrike() - this causes wallet to open automatically!
      // Just show toast notification
      toast({
        title: "⚡ Ready to Strike!",
        description: "Click 'Enter Strike Phase' button now!",
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, castingTimeLeft])

  // Handle strike phase entry
  useEffect(() => {
    if (isEnteredStrike) {
      setPhase("strike")
      toast({
        title: "⚡ STRIKE!",
        description: "Tap unstake NOW within 30 seconds!",
      })
      refetchStakeInfo()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnteredStrike])

  // Handle unstake result
  useEffect(() => {
    if (!isUnstaked) return

    // Wait a bit for blockchain state to update, then check result
    const timer = setTimeout(async () => {
      const updatedStakeInfo = await refetchStakeInfo()

      // Reset loading state
      setIsUnstakeLoading(false)

      // If stake still exists and in Strike state = SUCCESS
      // If stake deleted (state = 0 / Idle) = FAILED
      if (updatedStakeInfo.data && updatedStakeInfo.data[2] === 3) {
        // State = 3 (Strike) means fish caught!
        setPhase("success")
        toast({
          title: "🎉 Fish Caught!",
          description: "Wait for NFT generation...",
        })
      } else {
        // State = 0 (Idle) or deleted means fish escaped
        setPhase("failed")
        toast({
          title: "😢 Fish Escaped",
          description: "Too slow! Try again.",
          variant: "destructive",
        })
      }
    }, 2000) // Wait 2 seconds for blockchain to confirm

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUnstaked])

  // Reset strike loading when confirmed
  useEffect(() => {
    if (isEnteredStrike) {
      setIsStrikeLoading(false)
    }
  }, [isEnteredStrike])

  // Wrapper functions for immediate UI feedback
  const handleEnterStrike = () => {
    setIsStrikeLoading(true)
    enterStrike()
  }

  const handleUnstake = () => {
    setIsUnstakeLoading(true)
    unstake()
  }

  // Countdown timer for casting/strike
  useEffect(() => {
    if (phase === "casting" && castingTimeLeft) {
      setCountdown(Number(castingTimeLeft))
    } else if (phase === "strike" && strikeTimeLeft) {
      setCountdown(Number(strikeTimeLeft))
    }
  }, [phase, castingTimeLeft, strikeTimeLeft])

  // Handle approve
  const handleApprove = () => {
    if (!address || stakeAmountBigInt === BigInt(0)) return
    const approvalAmount = stakeAmountBigInt * BigInt(2)
    approve(CONTRACTS.FishItStaking, approvalAmount)
    setPhase("approve")
  }

  // Handle approval success
  useEffect(() => {
    if (isApproved) {
      refetchAllowance()
      toast({
        title: "✅ Approved!",
        description: "Now you can start fishing",
      })
      setPhase("select")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApproved])

  // Handle start fishing
  const handleStartFishing = () => {
    if (!hasBait) {
      toast({
        title: "No Bait!",
        description: `You need ${BAIT_NAMES[selectedBait]} bait to fish`,
        variant: "destructive",
      })
      return
    }

    if (stakeAmountBigInt < parseUnits("1", 18)) {
      toast({
        title: "Minimum Stake",
        description: "Minimum stake is 1 FSHT",
        variant: "destructive",
      })
      return
    }

    startFishing(stakeAmountBigInt, selectedBait)
    setPhase("starting")
  }

  // Handle close
  const handleClose = () => {
    if (phase === "select" || phase === "success" || phase === "failed") {
      onClose()
      setTimeout(() => setPhase("select"), 300)
    }
  }

  // Render content based on phase
  const renderContent = () => {
    switch (phase) {
      case "select":
      case "approve":
        return (
          <div className="space-y-4">
            {/* Bait Selection */}
            <div className="space-y-2">
              <Label className="text-white">Select Bait</Label>
              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((bait) => {
                  const baitType = bait as 0 | 1 | 2 | 3
                  const colors = BAIT_COLORS[baitType]
                  const isSelected = selectedBait === bait
                  const inventory = getBaitInventory(baitType)
                  return (
                    <button
                      key={bait}
                      onClick={() => setSelectedBait(baitType)}
                      className={`p-3 rounded-xl border-2 transition-all ${isSelected
                        ? `${colors.border} ${colors.bg} scale-105`
                        : "border-white/10 bg-white/5"
                        }`}
                    >
                      <p className={`text-xs font-semibold ${colors.text}`}>
                        {BAIT_NAMES[bait]}
                      </p>
                      <p className="text-xs text-white/50 mt-1">
                        Owned: {inventory.toString()}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Stake Amount */}
            <div className="space-y-2">
              <Label htmlFor="stake" className="text-white">
                Stake Amount (FSHT)
              </Label>
              <Input
                id="stake"
                type="number"
                min="1"
                step="0.1"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                className="rounded-full border-cyan-500/30 bg-[#0b2347]/75 text-white"
              />
              <p className="text-xs text-cyan-100/60">
                Higher stakes = Better chance at rare fish! (Min: 1 FSHT)
              </p>
            </div>

            {/* Warning if no bait */}
            {!hasBait && (
              <Card className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5" />
                  <div className="text-xs text-yellow-200">
                    <p className="font-semibold">No bait available!</p>
                    <p>Buy {BAIT_NAMES[selectedBait]} bait from the Bait Shop first</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1 rounded-full border border-white/20 bg-transparent text-cyan-100/80 hover:bg-white/10"
              >
                Cancel
              </Button>

              {needsApproval ? (
                <Button
                  onClick={handleApprove}
                  disabled={isApprovePending || isApproving}
                  className="flex-1 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold"
                >
                  {isApprovePending || isApproving ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Approving...</>
                  ) : (
                    "Approve FSHT"
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleStartFishing}
                  disabled={isStartPending || isStarting || !hasBait}
                  className="flex-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold"
                >
                  {isStartPending || isStarting ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Starting...</>
                  ) : (
                    <>🎣 Start Fishing</>
                  )}
                </Button>
              )}
            </div>
          </div>
        )

      case "starting":
      case "chumming":
        return (
          <div className="text-center space-y-4 py-8">
            <Loader2 className="w-16 h-16 animate-spin text-cyan-400 mx-auto" />
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Preparing...</h3>
              <p className="text-cyan-100/70">Setting up your fishing spot</p>
            </div>
          </div>
        )

      case "casting":
        const castingProgress = countdown > 0 ? ((60 - countdown) / 60) * 100 : 100
        const readyToStrike = castingTimeLeft === BigInt(0)

        return (
          <div className="text-center space-y-6 py-8">
            <div className="text-6xl animate-bounce">🎣</div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Line Cast!</h3>
              <p className="text-cyan-100/70">
                {readyToStrike ? "A fish is biting!" : "Waiting for a fish to bite..."}
              </p>
            </div>
            <div className="space-y-2">
              <Progress value={castingProgress} className="h-3" />
              <p className="text-3xl font-bold text-cyan-400">{countdown}s</p>
            </div>

            {readyToStrike ? (
              <Button
                onClick={handleEnterStrike}
                disabled={isStrikeLoading || isEnteringStrike}
                size="lg"
                className="w-full rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-xl py-6 animate-pulse disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {(isStrikeLoading || isEnteringStrike) ? (
                  <><Loader2 className="w-6 h-6 animate-spin mr-2" /> Entering Strike...</>
                ) : (
                  "⚡ ENTER STRIKE PHASE ⚡"
                )}
              </Button>
            ) : (
              <p className="text-sm text-cyan-100/60">Be ready to strike in {countdown} seconds!</p>
            )}
          </div>
        )

      case "strike":
        const strikeProgress = countdown > 0 ? (countdown / 30) * 100 : 0
        return (
          <div className="text-center space-y-6 py-8">
            <div className="text-6xl animate-pulse">⚡</div>
            <div>
              <h3 className="text-3xl font-bold text-red-500 mb-2 animate-pulse">
                STRIKE NOW!
              </h3>
              <p className="text-white">A fish is biting! Tap unstake quickly!</p>
            </div>
            <div className="space-y-2">
              <Progress value={strikeProgress} className="h-4 bg-red-900" />
              <p className="text-4xl font-bold text-red-500 animate-pulse">{countdown}s</p>
            </div>
            <Button
              onClick={handleUnstake}
              disabled={isUnstakeLoading || isUnstakePending || isUnstaking}
              size="lg"
              className="w-full rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white font-bold text-xl py-6 animate-pulse disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {(isUnstakeLoading || isUnstakePending || isUnstaking) ? (
                <><Loader2 className="w-6 h-6 animate-spin mr-2" /> Unstaking...</>
              ) : (
                "⚡ UNSTAKE NOW! ⚡"
              )}
            </Button>
          </div>
        )

      case "success":
        return (
          <div className="text-center space-y-6 py-8">
            <Trophy className="w-24 h-24 text-yellow-400 mx-auto" />
            <div>
              <h3 className="text-3xl font-bold text-green-400 mb-2">Fish Caught! 🎉</h3>
              <p className="text-cyan-100/70">Your NFT is being generated...</p>
              <p className="text-sm text-cyan-100/60 mt-2">Check the sidebar for claim button</p>
            </div>
            <Button
              onClick={handleClose}
              className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-8"
            >
              Awesome!
            </Button>
          </div>
        )

      case "failed":
        return (
          <div className="text-center space-y-6 py-8">
            <XCircle className="w-24 h-24 text-red-400 mx-auto" />
            <div>
              <h3 className="text-3xl font-bold text-red-400 mb-2">Fish Escaped! 😢</h3>
              <p className="text-cyan-100/70">You were too slow...</p>
              <p className="text-sm text-cyan-100/60 mt-2">Your stake and bait were lost. Try again!</p>
            </div>
            <Button
              onClick={handleClose}
              className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-8"
            >
              Try Again
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg overflow-hidden rounded-3xl border border-cyan-500/25 bg-[#071a36]/95 shadow-[0_30px_90px_-40px_rgba(12,95,255,0.6)] backdrop-blur-xl">
        <div className="space-y-4">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/20 mb-4">
              <Fish className="w-8 h-8 text-cyan-400" />
            </div>
            <DialogTitle className="text-2xl font-bold text-white">
              {phase === "select" || phase === "approve" ? "Start Fishing" :
                phase === "casting" ? "Casting Line" :
                  phase === "strike" ? "STRIKE!" :
                    phase === "success" ? "Success!" :
                      phase === "failed" ? "Failed" :
                        "Fishing..."}
            </DialogTitle>
          </div>

          {/* Content */}
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  )
}

