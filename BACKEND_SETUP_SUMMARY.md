# 🎣 FishIt Backend - Complete Setup Summary

## ✅ What Was Created

A complete TypeScript backend service that:
- ✅ Listens to blockchain events in real-time
- ✅ Generates unique NFT metadata using Gemini AI
- ✅ Uploads to IPFS via Pinata
- ✅ Automatically calls smart contract to prepare NFTs
- ✅ Minimal code, maximum functionality

---

## 📁 Backend Structure

```
backend/
├── src/
│   ├── services/
│   │   ├── blockchain.ts       # Event listener & contract interaction
│   │   ├── gemini.ts           # AI metadata generation
│   │   ├── pinata.ts           # IPFS upload service
│   │   └── nftGenerator.ts     # Main orchestrator
│   ├── utils/
│   │   └── rarity.ts           # Rarity calculation (from README formula)
│   ├── types/
│   │   └── index.ts            # TypeScript definitions
│   └── index.ts                # Entry point with Express server
├── .env.example                # Environment template
├── .gitignore                  # Security
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── README.md                   # Full documentation
└── SETUP_GUIDE.md              # Quick start guide
```

---

## 🔑 Required API Keys & Secrets

You need to obtain these and add to `.env` file:

### 1. Pinata (IPFS Storage)
- **Where**: https://pinata.cloud/
- **What**: API Key + API Secret
- **Cost**: Free tier (1GB storage)
- **Time**: 5 minutes to setup
- **Steps**:
  1. Sign up
  2. Go to API Keys
  3. Create new key with `pinFileToIPFS` and `pinJSONToIPFS` permissions
  4. Copy both API Key and Secret

### 2. Gemini AI
- **Where**: https://makersuite.google.com/app/apikey
- **What**: API Key
- **Cost**: Free tier (60 req/min)
- **Time**: 2 minutes to setup
- **Steps**:
  1. Sign in with Google
  2. Create API key
  3. Copy the key

### 3. Wallet Private Key
- **Where**: MetaMask
- **What**: Private key of contract owner wallet
- **Cost**: Free (but need ETH for gas)
- **Time**: 2 minutes
- **Steps**:
  1. Open MetaMask
  2. Account Details → Export Private Key
  3. Enter password
  4. Copy private key
- ⚠️ **CRITICAL**: Must be the wallet that deployed the contracts!

---

## 🚀 Installation Steps

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Environment
```bash
# Copy template
cp .env.example .env

# Edit .env and add your keys:
# - PRIVATE_KEY (from MetaMask)
# - PINATA_API_KEY (from Pinata)
# - PINATA_SECRET_KEY (from Pinata)
# - GEMINI_API_KEY (from Google AI Studio)
```

### Step 3: Run Backend
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm run build
npm start
```

---

## 📊 Expected Console Output

### On Startup:
```
🚀 FishIt Backend Starting...

🔍 Testing Pinata connection...
✅ Pinata connected

📡 Connected to blockchain (Block: 12345678)

🎣 Listening for FishCaught events...
🌐 API Server running on http://localhost:3001
✅ Backend ready!
```

### When Fish is Caught:
```
🐟 Fish Caught!
User: 0x1234567890abcdef...
Amount: 5.0 FSHT
Bait: 2

🎨 Generating epic fish NFT...
📤 Uploading to IPFS...
✅ Uploaded: ipfs://QmXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
📝 Preparing NFT for 0x1234567890abcdef...
⏳ Transaction sent: 0xabcdef1234567890...
✅ NFT prepared!
🎉 NFT generation complete!
```

---

## 🔄 Complete Flow

### User Perspective (Frontend):
1. User catches fish (unstakes successfully)
2. Waits ~10-30 seconds
3. Sees "NFT Ready!" notification
4. Clicks "Claim NFT Now!"
5. Receives NFT + rewards

### Backend Perspective:
1. Detects `FishCaught` event from blockchain
2. Calculates rarity: `score = base * baitMultiplier * stakeMultiplier`
3. Calls Gemini AI to generate metadata (name, description, attributes)
4. Uploads metadata JSON to Pinata IPFS
5. Gets IPFS CID (Content Identifier)
6. Calls `prepareNFT(userAddress, cid)` on smart contract
7. Waits for transaction confirmation
8. Done! User can now claim

---

## 🧪 Testing Checklist

### Before Testing:
- [ ] Backend running without errors
- [ ] Shows "✅ Backend ready!"
- [ ] Wallet has ETH for gas fees
- [ ] All API keys configured correctly

### Test 1: Health Check
```bash
curl http://localhost:3001/health
# Should return: {"status":"ok","service":"FishIt NFT Generator"}
```

### Test 2: End-to-End Flow
1. [ ] Open frontend (http://localhost:3000)
2. [ ] Connect wallet
3. [ ] Claim faucet tokens
4. [ ] Buy bait
5. [ ] Start fishing
6. [ ] Wait 60s (casting)
7. [ ] Unstake within 30s (strike)
8. [ ] Watch backend console for processing
9. [ ] See "NFT Ready!" in frontend
10. [ ] Claim NFT
11. [ ] Success! 🎉

---

## 🔐 Security Checklist

### ✅ DO:
- Store secrets in `.env` file
- Add `.env` to `.gitignore`
- Use environment variables in production
- Keep private key secure
- Monitor wallet balance
- Use separate wallet for backend (not your main wallet)

### ❌ DON'T:
- Commit `.env` to git
- Share private keys
- Hardcode secrets in code
- Use main wallet for backend
- Expose API keys publicly

---

## 🐛 Troubleshooting Guide

### Error: "Pinata connection failed"
**Cause**: Invalid Pinata credentials  
**Fix**: 
1. Check API key and secret in `.env`
2. Verify no extra spaces
3. Test at https://app.pinata.cloud/

### Error: "insufficient funds for gas"
**Cause**: Wallet has no ETH  
**Fix**: Get Lisk Sepolia testnet ETH from faucet

### Error: "caller is not the owner"
**Cause**: Wrong private key  
**Fix**: Use the wallet that deployed the contracts

### Error: "AI generation failed"
**Cause**: Invalid Gemini API key or rate limit  
**Fix**: 
1. Check API key in `.env`
2. Verify key is active
3. Check rate limits

### Backend crashes on startup
**Fix**:
1. Check all environment variables are set
2. Verify RPC URL is accessible
3. Check Node.js version (need 18+)
4. Run `npm install` again

---

## 📈 Monitoring

### Key Metrics:
- **Event Processing Time**: Should be < 30 seconds
- **IPFS Upload Success**: Should be > 95%
- **Gas Usage**: ~0.001 ETH per NFT
- **Error Rate**: Should be < 5%

### Logs to Watch:
```bash
# Development
npm run dev

# Production (with PM2)
pm2 logs fishit-backend
```

---

## 💰 Cost Breakdown

### Development (Testing):
- Pinata: **FREE** (1GB storage)
- Gemini AI: **FREE** (60 req/min)
- Gas: ~0.001 ETH per NFT (~$0.003)

### Production (100 NFTs/day):
- Pinata: **FREE** (under 1GB)
- Gemini AI: **FREE** (under rate limit)
- Gas: ~0.1 ETH/day (~$0.30/day)
- Server: $5-10/month (Railway/Render)

**Total**: ~$15-20/month for 3000 NFTs

---

## 🚀 Deployment Options

### Option 1: Railway (Recommended)
- **Pros**: Easy, auto-deploy from git, free tier
- **Steps**:
  1. Push to GitHub
  2. Connect Railway
  3. Add environment variables
  4. Deploy!
- **Cost**: Free tier available

### Option 2: Render
- **Pros**: Simple, free tier, good docs
- **Steps**: Same as Railway
- **Cost**: Free tier available

### Option 3: AWS EC2 / VPS
- **Pros**: Full control, scalable
- **Steps**: 
  1. Setup server
  2. Install Node.js
  3. Clone repo
  4. Use PM2 for process management
- **Cost**: $5-10/month

---

## 📝 Environment Variables Reference

```env
# Blockchain (Already configured)
RPC_URL=https://rpc.sepolia-api.lisk.com
CHAIN_ID=4202
PRIVATE_KEY=                    # ← YOU NEED TO ADD THIS

# Contracts (Already configured)
STAKING_CONTRACT=0x803DC34D7E692691A41877553894aa3E14bFF226
NFT_CONTRACT=0xAF0DE0d61af37BfF41471681C6283D7339dF92b0

# Pinata (YOU NEED TO ADD THESE)
PINATA_API_KEY=                 # ← From Pinata dashboard
PINATA_SECRET_KEY=              # ← From Pinata dashboard

# Gemini AI (YOU NEED TO ADD THIS)
GEMINI_API_KEY=                 # ← From Google AI Studio

# Server (Already configured)
PORT=3001
```

---

## 🎯 Integration with Frontend

**No changes needed to frontend!** It already:
- ✅ Polls `getStakeInfo()` every 3 seconds
- ✅ Detects when state changes to `ReadyToClaim`
- ✅ Shows "Claim NFT" button automatically
- ✅ Handles NFT claiming

The backend and frontend communicate **only through the blockchain**:
```
Frontend → Smart Contract → Backend
Backend → Smart Contract → Frontend
```

---

## 📚 Key Files Explained

### `src/index.ts`
- Entry point
- Starts Express server
- Initializes event listener
- Health check endpoint

### `src/services/blockchain.ts`
- Connects to blockchain via ethers.js
- Listens to `FishCaught` events
- Calls `prepareNFT()` function

### `src/services/gemini.ts`
- Generates NFT metadata using Gemini AI
- Creates unique name, description, attributes
- Returns JSON metadata

### `src/services/pinata.ts`
- Uploads metadata to IPFS
- Returns CID (Content Identifier)
- Tests connection on startup

### `src/services/nftGenerator.ts`
- Orchestrates the entire flow
- Prevents duplicate processing
- Error handling and retries

### `src/utils/rarity.ts`
- Implements rarity formula from README
- Calculates: `score = base * baitMul * stakeMul`
- Returns: common, rare, epic, or legendary

---

## 🎓 How It Works

### Rarity Calculation:
```typescript
const baitMul = { Common: 1.0, Rare: 1.1, Epic: 1.25, Legendary: 1.5 }
const base = random(0, 1)
const stakeMul = 1 + 0.35 * log10(max(stake, 100) / 100)
const score = min(1, base * baitMul * stakeMul)

if (score >= 0.9) → legendary
if (score >= 0.7) → epic
if (score >= 0.4) → rare
else → common
```

### Event Listening:
```typescript
contract.on('FishCaught', async (user, amount, baitType) => {
  // Process event
})
```

### NFT Preparation:
```typescript
1. Calculate rarity
2. Generate metadata with AI
3. Upload to IPFS → get CID
4. Call prepareNFT(user, cid)
5. Wait for confirmation
6. Done!
```

---

## ✅ Success Criteria

Backend is working correctly when:
- [ ] Starts without errors
- [ ] Connects to Pinata successfully
- [ ] Connects to blockchain
- [ ] Listens for events
- [ ] Processes fish caught events
- [ ] Generates unique metadata
- [ ] Uploads to IPFS
- [ ] Calls prepareNFT successfully
- [ ] Frontend shows "NFT Ready!"
- [ ] User can claim NFT

---

## 🎉 You're Done!

The backend is now:
- ✅ Fully functional
- ✅ Minimal and efficient
- ✅ Well documented
- ✅ Production ready (after deployment)
- ✅ Integrated with frontend and smart contracts

### Next Steps:
1. Get API keys (15 minutes)
2. Configure `.env` (2 minutes)
3. Run `npm install` (1 minute)
4. Run `npm run dev` (instant)
5. Test complete flow (5 minutes)
6. Deploy to production (optional)

**Total setup time: ~25 minutes**

---

## 📞 Quick Reference

### Start Backend:
```bash
cd backend
npm run dev
```

### Check Health:
```bash
curl http://localhost:3001/health
```

### View Logs:
```bash
# Logs are in console where you ran npm run dev
```

### Stop Backend:
```bash
# Press Ctrl+C in terminal
```

---

**Happy Fishing! 🎣✨**
