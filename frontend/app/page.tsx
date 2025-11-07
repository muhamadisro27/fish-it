"use client"

import { useState, useEffect } from "react"
import AppHeader from "@/components/app-header"
import AquariumGrid from "@/components/aquarium-grid"
import StatsSidebar from "@/components/stats-sidebar"
import FishDetailsModal from "@/components/fish-details-modal"
import FishingModal from "@/components/fishing-modal"
import OceanBackground from "@/components/visual-effects/ocean-background"
import FishParticles from "@/components/visual-effects/fish-particles"
import { useNFTCollection } from "@/lib/hooks/useNFTCollection"
import { useNFTProgress } from "@/lib/hooks/useNFTProgress"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Sparkles, CheckCircle, XCircle } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function Home() {
  const [selectedFishId, setSelectedFishId] = useState<bigint | null>(null)
  const [showFishingModal, setShowFishingModal] = useState(false)
  
  const { fish, refetch: refetchFish } = useNFTCollection()
  const { progress, isGenerating, clearProgress } = useNFTProgress()
  const { toast } = useToast()

  const selectedFish = fish.find((f) => f.id === selectedFishId) || null

  // Show toast notifications for NFT generation progress
  useEffect(() => {
    if (!progress) return

    if (progress.stage === 'complete') {
      toast({
        title: "🎉 NFT Generated!",
        description: "Your fish NFT is ready to claim",
      })
      // Refetch collection after a short delay
      setTimeout(() => refetchFish(), 2000)
    } else if (progress.stage === 'error') {
      toast({
        title: "❌ NFT Generation Failed",
        description: progress.message,
        variant: "destructive",
      })
    }
  }, [progress, toast, refetchFish])

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Background Effects - z-0 */}
      <OceanBackground />
      <FishParticles />
      
      {/* Sticky Navbar - z-50 */}
      <AppHeader schedulerRunning={false} />
      
      {/* Main Content - z-10 */}
      <div className="relative z-10">
        <div className="flex gap-6 p-6 max-w-7xl mx-auto">
          <main className="flex-1">
            <AquariumGrid 
              onSelectFish={setSelectedFishId} 
              onCastLine={() => setShowFishingModal(true)} 
            />
          </main>
          <aside className="w-80">
            <StatsSidebar selectedFishId={selectedFishId} onNFTClaimed={refetchFish} />
          </aside>
        </div>

        {/* NFT Generation Progress Notification */}
        {isGenerating && progress && (
          <div className="fixed bottom-6 right-6 z-50 animate-slide-in-up">
            <Card className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-[#071a36]/95 p-5 shadow-[0_30px_90px_-40px_rgba(12,95,255,0.8)] backdrop-blur-xl max-w-sm">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(0,184,255,0.2),_transparent_70%)]" />
              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-3">
                  {progress.stage === 'complete' ? (
                    <CheckCircle className="w-6 h-6 text-green-400 animate-bounce" />
                  ) : progress.stage === 'error' ? (
                    <XCircle className="w-6 h-6 text-red-400" />
                  ) : (
                    <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">
                      {progress.stage === 'generating' && "🎨 Generating NFT..."}
                      {progress.stage === 'uploading_image' && "🖼️ Creating Artwork..."}
                      {progress.stage === 'uploading_metadata' && "📤 Uploading to IPFS..."}
                      {progress.stage === 'minting' && "⛓️ Preparing NFT..."}
                      {progress.stage === 'complete' && "✅ NFT Ready!"}
                      {progress.stage === 'error' && "❌ Error"}
                    </p>
                    <p className="text-xs text-cyan-100/70 mt-1">{progress.message}</p>
                  </div>
                </div>
                
                {progress.data && progress.stage !== 'error' && (
                  <div className="p-3 rounded-xl border border-cyan-500/20 bg-cyan-500/10">
                    {progress.data.rarity && (
                      <p className="text-xs text-cyan-100/80">
                        <span className="font-semibold">Rarity:</span> {progress.data.rarity}
                      </p>
                    )}
                    {progress.data.name && (
                      <p className="text-xs text-cyan-100/80">
                        <span className="font-semibold">Name:</span> {progress.data.name}
                      </p>
                    )}
                  </div>
                )}

                {progress.stage === 'complete' && (
                  <button
                    onClick={clearProgress}
                    className="text-xs text-cyan-300 hover:text-cyan-100 underline"
                  >
                    Dismiss
                  </button>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Modals */}
        <FishDetailsModal
          fish={selectedFish}
          isOpen={!!selectedFishId}
          onClose={() => setSelectedFishId(null)}
        />
        <FishingModal 
          isOpen={showFishingModal} 
          onClose={() => setShowFishingModal(false)} 
        />
      </div>
    </div>
  )
}
