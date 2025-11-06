import { FishCaughtEvent, NFTMetadata } from '../types';
import { calculateRarity, getBaitName } from '../utils/rarity';
import { generateNFTMetadata } from './gemini';
import { uploadMetadataToPinata } from './pinata';
import { BlockchainService } from './blockchain';
import { ethers } from 'ethers';

export class NFTGenerator {
  private blockchain: BlockchainService;
  private processing = new Set<string>();

  constructor(blockchain: BlockchainService) {
    this.blockchain = blockchain;
  }

  async processEvent(event: FishCaughtEvent): Promise<void> {
    const key = `${event.user}-${event.timestamp}`;
    
    if (this.processing.has(key)) {
      console.log('⚠️  Already processing this event');
      return;
    }

    this.processing.add(key);

    try {
      const rarity = calculateRarity(event.baitType, event.amount);
      const baitName = getBaitName(event.baitType);
      const stakeAmount = ethers.formatEther(event.amount);

      console.log(`🎨 Generating ${rarity} fish NFT...`);

      const metadata = await generateNFTMetadata(rarity, baitName, stakeAmount);

      const fullMetadata: NFTMetadata = {
        ...metadata,
        image: 'ipfs://placeholder',
        external_url: `https://fishit.game/fish/${event.user}`,
      };

      console.log('📤 Uploading to IPFS...');
      const cid = await uploadMetadataToPinata(fullMetadata);
      console.log(`✅ Uploaded: ipfs://${cid}`);

      await this.blockchain.prepareNFT(event.user, cid);
      
      console.log('🎉 NFT generation complete!\n');
    } catch (error) {
      console.error('❌ Error processing event:', error);
    } finally {
      this.processing.delete(key);
    }
  }
}
