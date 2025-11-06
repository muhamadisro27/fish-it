import dotenv from 'dotenv';
import express from 'express';
import { BlockchainService } from './services/blockchain';
import { NFTGenerator } from './services/nftGenerator';
import { testConnection } from './services/pinata';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'FishIt NFT Generator' });
});

async function main() {
  console.log('🚀 FishIt Backend Starting...\n');

  console.log('🔍 Testing Pinata connection...');
  try {
    const pinataOk = await testConnection();
    if (!pinataOk) {
      console.error('❌ Pinata connection failed!');
      process.exit(1);
    }
    console.log('✅ Pinata connected\n');
  } catch (error: any) {
    console.error('❌ Pinata test error:', error.message);
    process.exit(1);
  }

  const blockchain = new BlockchainService();
  const nftGenerator = new NFTGenerator(blockchain);

  const blockNumber = await blockchain.getBlockNumber();
  console.log(`📡 Connected to blockchain (Block: ${blockNumber})\n`);

  await blockchain.listenToFishCaught(async (event) => {
    await nftGenerator.processEvent(event);
  });

  app.listen(PORT, () => {
    console.log(`🌐 API Server running on http://localhost:${PORT}`);
    console.log('✅ Backend ready!\n');
  });
}

main().catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
