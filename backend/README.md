# 🎣 FishIt Backend - NFT Generation Service

Backend service that listens to blockchain events and automatically generates unique fish NFT metadata using AI.

---

## 🎯 What This Does

1. **Listens** to `FishCaught` events from the smart contract
2. **Calculates** fish rarity based on stake amount and bait type
3. **Generates** unique NFT metadata using Gemini AI
4. **Uploads** metadata to IPFS via Pinata
5. **Calls** `prepareNFT()` on smart contract to make NFT claimable

---

## 📋 Prerequisites

Before starting, you need:

### 1. Node.js
- Node.js 18+ installed
- npm or yarn

### 2. Pinata Account (IPFS Storage)
- Sign up at: https://pinata.cloud/
- Get API credentials:
  - Go to **API Keys** section
  - Click **New Key**
  - Enable **pinFileToIPFS** and **pinJSONToIPFS**
  - Copy **API Key** and **API Secret**

### 3. Gemini AI API Key
- Sign up at: https://makersuite.google.com/app/apikey
- Click **Create API Key**
- Copy the key

### 4. Wallet Private Key
- Export private key from MetaMask:
  - Open MetaMask
  - Click 3 dots → Account Details → Export Private Key
  - Enter password
  - Copy private key
- ⚠️ **IMPORTANT**: This wallet must be the **owner** of the staking contract
- ⚠️ **SECURITY**: Never commit this key to git!

---

## 🔧 Setup Instructions

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables

```bash
# Copy example file
cp .env.example .env
```

Edit `.env` file:

```env
# Blockchain Configuration
RPC_URL=https://rpc.sepolia-api.lisk.com
CHAIN_ID=4202
PRIVATE_KEY=your_actual_private_key_here

# Contract Addresses (Already set for Lisk Sepolia)
STAKING_CONTRACT=0x803DC34D7E692691A41877553894aa3E14bFF226
NFT_CONTRACT=0xAF0DE0d61af37BfF41471681C6283D7339dF92b0

# Pinata (Get from https://pinata.cloud/)
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key

# Gemini AI (Get from https://makersuite.google.com/app/apikey)
GEMINI_API_KEY=your_gemini_api_key

# Server
PORT=3001
```

### Step 3: Verify Configuration

Make sure you have:
- ✅ Valid Pinata API credentials
- ✅ Valid Gemini API key
- ✅ Private key of contract owner wallet
- ✅ Some ETH in wallet for gas fees

---

## 🚀 Running the Backend

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
# Build
npm run build

# Start
npm start
```

---

## 📊 Expected Output

When running successfully, you'll see:

```
🚀 FishIt Backend Starting...

🔍 Testing Pinata connection...
✅ Pinata connected

📡 Connected to blockchain (Block: 12345678)

🎣 Listening for FishCaught events...
🌐 API Server running on http://localhost:3001
✅ Backend ready!
```

When a fish is caught:

```
🐟 Fish Caught!
User: 0x1234...5678
Amount: 5.0 FSHT
Bait: 2

🎨 Generating epic fish NFT...
📤 Uploading to IPFS...
✅ Uploaded: ipfs://QmXxx...
📝 Preparing NFT for 0x1234...5678...
⏳ Transaction sent: 0xabc...
✅ NFT prepared!
🎉 NFT generation complete!
```

---

## 🧪 Testing

### Test 1: Health Check

```bash
curl http://localhost:3001/health
```

Expected response:
```json
{"status":"ok","service":"FishIt NFT Generator"}
```

### Test 2: Trigger Event

1. Go to frontend
2. Complete fishing flow
3. Successfully unstake during strike phase
4. Watch backend console for processing logs

---

## 🏗️ Architecture

```
┌─────────────────────┐
│  Smart Contract     │
│  (Lisk Sepolia)     │
└──────────┬──────────┘
           │
           │ FishCaught Event
           ▼
┌─────────────────────┐
│  Event Listener     │
│  (ethers.js)        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Rarity Calculator  │
│  (Formula from      │
│   README)           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Gemini AI          │
│  (Generate          │
│   Metadata)         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Pinata IPFS        │
│  (Upload Metadata)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  prepareNFT()       │
│  (Smart Contract)   │
└─────────────────────┘
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── services/
│   │   ├── blockchain.ts      # Event listener & contract calls
│   │   ├── gemini.ts          # AI metadata generation
│   │   ├── pinata.ts          # IPFS upload
│   │   └── nftGenerator.ts    # Main orchestrator
│   ├── utils/
│   │   └── rarity.ts          # Rarity calculation formula
│   ├── types/
│   │   └── index.ts           # TypeScript types
│   └── index.ts               # Entry point
├── .env                       # Your secrets (DO NOT COMMIT)
├── .env.example               # Template
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔐 Security Notes

### ⚠️ CRITICAL: Never Commit These Files

Add to `.gitignore`:
```
.env
*.log
```

### Private Key Security

- ✅ Store in `.env` file only
- ✅ Use environment variables in production
- ❌ Never hardcode in source code
- ❌ Never commit to git
- ❌ Never share publicly

### Production Recommendations

1. **Use Secret Manager**: AWS Secrets Manager, HashiCorp Vault, etc.
2. **Separate Wallets**: Use dedicated wallet for backend (not your main wallet)
3. **Monitor Gas**: Set up alerts for low balance
4. **Rate Limiting**: Add rate limits to prevent abuse
5. **Logging**: Use proper logging service (not just console.log)

---

## 🐛 Troubleshooting

### Error: "Pinata connection failed"

**Cause**: Invalid Pinata credentials

**Solution**:
1. Check API key and secret in `.env`
2. Verify keys are active in Pinata dashboard
3. Ensure no extra spaces in `.env` file

### Error: "insufficient funds for gas"

**Cause**: Wallet has no ETH for gas fees

**Solution**:
1. Get Lisk Sepolia testnet ETH from faucet
2. Send to your backend wallet address

### Error: "Ownable: caller is not the owner"

**Cause**: Private key is not the contract owner

**Solution**:
1. Use the same wallet that deployed the contracts
2. Check contract owner with: `cast call <STAKING_CONTRACT> "owner()(address)"`

### Warning: "Already processing this event"

**Cause**: Duplicate event (normal behavior)

**Solution**: This is expected, backend prevents duplicate processing

### Error: "AI generation failed"

**Cause**: Invalid Gemini API key or rate limit

**Solution**:
1. Check Gemini API key in `.env`
2. Verify API key is active
3. Check rate limits on Google AI Studio

---

## 📈 Monitoring

### Key Metrics to Watch

1. **Event Processing Time**: Should be < 30 seconds
2. **IPFS Upload Success Rate**: Should be > 95%
3. **Gas Usage**: Monitor wallet balance
4. **Error Rate**: Should be < 5%

### Logs to Monitor

```bash
# Watch logs in real-time
npm run dev

# In production, use PM2 or similar
pm2 logs fishit-backend
```

---

## 🚀 Deployment Options

### Option 1: Railway (Recommended)

1. Sign up at https://railway.app/
2. Create new project
3. Connect GitHub repo
4. Add environment variables
5. Deploy!

### Option 2: Render

1. Sign up at https://render.com/
2. Create new Web Service
3. Connect repo
4. Add environment variables
5. Deploy!

### Option 3: AWS EC2

1. Launch EC2 instance
2. Install Node.js
3. Clone repo
4. Setup `.env`
5. Use PM2 to run:
   ```bash
   npm install -g pm2
   pm2 start npm --name fishit-backend -- start
   pm2 save
   pm2 startup
   ```

---

## 🔄 Integration with Frontend

The frontend automatically polls the smart contract to check if NFT is ready:

```typescript
// Frontend checks this every 3 seconds
const { data: stakeInfo } = useStakeInfo(address);

if (stakeInfo.state === FishingState.ReadyToClaim) {
  // Show "Claim NFT" button
}
```

**No direct frontend-backend communication needed!** Everything goes through the blockchain.

---

## 📝 Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `RPC_URL` | ✅ | Blockchain RPC endpoint | `https://rpc.sepolia-api.lisk.com` |
| `CHAIN_ID` | ✅ | Network chain ID | `4202` |
| `PRIVATE_KEY` | ✅ | Contract owner private key | `0xabc...` |
| `STAKING_CONTRACT` | ✅ | Staking contract address | `0x803D...` |
| `NFT_CONTRACT` | ✅ | NFT contract address | `0xAF0D...` |
| `PINATA_API_KEY` | ✅ | Pinata API key | `abc123...` |
| `PINATA_SECRET_KEY` | ✅ | Pinata secret key | `xyz789...` |
| `GEMINI_API_KEY` | ✅ | Google Gemini API key | `AIza...` |
| `PORT` | ❌ | Server port (default: 3001) | `3001` |

---

## 🎯 Next Steps

After backend is running:

1. ✅ Test complete fishing flow
2. ✅ Verify NFT generation
3. ✅ Check IPFS uploads
4. ✅ Monitor gas usage
5. ✅ Deploy to production

---

## 💡 Tips

1. **Start Simple**: Test with one fish catch first
2. **Monitor Logs**: Keep terminal open to see processing
3. **Check IPFS**: Verify uploads at `https://gateway.pinata.cloud/ipfs/<CID>`
4. **Gas Buffer**: Keep extra ETH in wallet for gas
5. **Backup Keys**: Store credentials securely

---

## 📞 Support

If you encounter issues:

1. Check logs for error messages
2. Verify all environment variables
3. Test Pinata connection manually
4. Check wallet has ETH for gas
5. Verify contract owner is correct

---

**Ready to generate some fish NFTs! 🐟✨**
