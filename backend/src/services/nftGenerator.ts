import { FishCaughtEvent, NFTMetadata } from "../types"
import { calculateRarity, getBaitName } from "../utils/rarity"
import { generateFishImage, generateNFTMetadata } from "./gemini"
import { uploadMetadataToPinata } from "./pinata"
import { BlockchainService } from "./blockchain"
import { sseManager } from "./eventEmitter"
import { ethers } from "ethers"

export class NFTGenerator {
  private blockchain: BlockchainService
  private processing = new Set<string>()

  constructor(blockchain: BlockchainService) {
    this.blockchain = blockchain
  }

  async processEvent(event: FishCaughtEvent): Promise<void> {
    const key = `${event.user}-${event.timestamp}`

    if (this.processing.has(key)) {
      console.log("⚠️  Already processing this event")
      return
    }

    this.processing.add(key)

    try {
      const rarity = calculateRarity(event.baitType, event.amount)
      const baitName = getBaitName(event.baitType)
      const stakeAmount = ethers.formatEther(event.amount)

      // Stage 1: Generate metadata
      console.log(`🎨 Generating ${rarity} fish NFT...`)
      sseManager.sendProgress({
        user: event.user,
        stage: "generating",
        message: "Generating fish metadata and image...",
        data: { rarity, baitName, stakeAmount },
      })

      const metadata = await generateNFTMetadata(rarity, baitName, stakeAmount)

      console.log("metadata", metadata)

      // Stage 2: Generate and upload image
      console.log("🖼️  Generating fish image...")
      sseManager.sendProgress({
        user: event.user,
        stage: "uploading_image",
        message: "Creating unique fish artwork...",
        data: { name: metadata.name, species: metadata.species },
      })

      const imageURL = await generateFishImage(
        metadata.name,
        metadata.species,
        rarity
      )

      // const imageCid = `bafybeifwxamsy7m452o3s4hcomrqcfh4trhc2c52xrghdaooyoeist5ntm`

      // Stage 3: Upload metadata with image URL
      console.log("📤 Uploading metadata to IPFS...")
      sseManager.sendProgress({
        user: event.user,
        stage: "uploading_metadata",
        message: "Uploading NFT data to IPFS...",
        data: { imageURL },
      })

      const fullMetadata: NFTMetadata = {
        ...metadata,
        image: imageURL,
        external_url: imageURL,
      }

      const metadataCid = await uploadMetadataToPinata(fullMetadata)
      console.log(
        `✅ Metadata uploaded: https://gateway.pinata.cloud/ipfs/${metadataCid}`
      )

      // Stage 4: Prepare NFT on blockchain
      console.log("⛓️  Preparing NFT on blockchain...")
      sseManager.sendProgress({
        user: event.user,
        stage: "minting",
        message: "Preparing NFT for minting...",
        data: { metadataCid },
      })

      await this.blockchain.prepareNFT(event.user, metadataCid)

      // Stage 5: Complete
      console.log("🎉 NFT generation complete!\n")
      sseManager.sendProgress({
        user: event.user,
        stage: "complete",
        message: "NFT ready to mint!",
        data: {
          metadata: fullMetadata,
          imageUrl: imageURL,
          metadataUrl: `https://gateway.pinata.cloud/ipfs/${metadataCid}`,
          ipfsUri: `https://gateway.pinata.cloud/ipfs/${metadataCid}`,
        },
      })
    } catch (error: any) {
      console.error("❌ Error processing event:", error)
      sseManager.sendProgress({
        user: event.user,
        stage: "error",
        message: error.message || "Failed to generate NFT",
        data: { error: error.toString() },
      })
    } finally {
      this.processing.delete(key)
    }
  }
}
