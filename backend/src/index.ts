import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { BlockchainService } from "./services/blockchain";
import { NFTGenerator } from "./services/nftGenerator";
import { testConnection } from "./services/pinata";
import { sseManager } from "./services/eventEmitter";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "FishIt NFT Generator" });
});

// SSE endpoint for NFT progress
app.get("/events/:userAddress", (req, res) => {
  const userAddress = req.params.userAddress.toLowerCase();
  
  console.log(`📡 SSE client connected: ${userAddress}`);
  
  sseManager.addClient(userAddress, res);
  
  // Keep connection alive
  const keepAlive = setInterval(() => {
    res.write(': keep-alive\n\n');
  }, 30000);
  
  req.on('close', () => {
    clearInterval(keepAlive);
    console.log(`📡 SSE client disconnected: ${userAddress}`);
  });
});

async function main() {
  console.log("🚀 FishIt Backend Starting...\n");

  console.log("🔍 Testing Pinata connection...");
  try {
    const pinataOk = await testConnection();
    if (!pinataOk) {
      console.error("❌ Pinata connection failed!");
      process.exit(1);
    }
    console.log("✅ Pinata connected\n");
  } catch (error: any) {
    console.error("❌ Pinata test error:", error.message);
    process.exit(1);
  }

  const blockchain = new BlockchainService();
  const nftGenerator = new NFTGenerator(blockchain);

  const blockNumber = await blockchain.getBlockNumber();
  console.log(`📡 Connected to blockchain (Block: ${blockNumber})\n`);

  await blockchain.listenToFishCaught(async (event) => {
    console.log(`🎣 Fish caught by ${event.user}`);
    await nftGenerator.processEvent(event);
  });

  app.listen(PORT, () => {
    console.log(`🌐 API Server running on http://localhost:${PORT}`);
    console.log(`📡 SSE endpoint: http://localhost:${PORT}/events/:userAddress`);
    console.log("✅ Backend ready!\n");
  });
}

main().catch((error) => {
  console.error("💥 Fatal error:", error);
  process.exit(1);
});