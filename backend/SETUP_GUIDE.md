# 🚀 Quick Setup Guide - FishIt Backend

## ⚡ 5-Minute Setup

### 1. Get API Keys (15 minutes total)

#### A. Pinata (IPFS Storage) - 5 minutes
1. Go to: https://pinata.cloud/
2. Click **Sign Up** (free account)
3. Verify email
4. Go to **API Keys** in sidebar
5. Click **New Key**
6. Enable these permissions:
   - ✅ `pinFileToIPFS`
   - ✅ `pinJSONToIPFS`
7. Give it a name: "FishIt Backend"
8. Click **Create Key**
9. **COPY BOTH**:
   - API Key
   - API Secret
   - ⚠️ You can only see the secret once!

#### B. Gemini AI - 5 minutes
1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click **Create API Key**
4. Select **Create API key in new project**
5. **COPY** the API key
6. ⚠️ Keep this key safe!

#### C. Wallet Private Key - 2 minutes
1. Open MetaMask
2. Click **3 dots** (⋮) next to account
3. Click **Account Details**
4. Click **Export Private Key**
5. Enter MetaMask password
6. **COPY** the private key
7. ⚠️ This must be the wallet that deployed the contracts!

---

### 2. Install & Configure (3 minutes)

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Now edit `.env` file and paste your keys:

```env
# Blockchain (already set)
RPC_URL=https://rpc.sepolia-api.lisk.com
CHAIN_ID=4202
PRIVATE_KEY=paste_your_private_key_here

# Contracts (already set)
STAKING_CONTRACT=0x803DC34D7E692691A41877553894aa3E14bFF226
NFT_CONTRACT=0xAF0DE0d61af37BfF41471681C6283D7339dF92b0

# Pinata (paste your keys)
PINATA_API_KEY=paste_your_pinata_api_key
PINATA_SECRET_KEY=paste_your_pinata_secret_key

# Gemini (paste your key)
GEMINI_API_KEY=paste_your_gemini_api_key

# Server (already set)
PORT=3001
```

---

### 3. Run Backend (1 minute)

```bash
npm run dev
```

You should see:
```
🚀 FishIt Backend Starting...
🔍 Testing Pinata connection...
✅ Pinata connected
📡 Connected to blockchain (Block: 12345678)
🎣 Listening for FishCaught events...
🌐 API Server running on http://localhost:3001
✅ Backend ready!
```

---

## ✅ Verification Checklist

Before testing, verify:

- [ ] Backend shows "✅ Pinata connected"
- [ ] Backend shows "✅ Backend ready!"
- [ ] No error messages in console
- [ ] Wallet has some ETH for gas (check on https://sepolia-blockscout.lisk.com/)

---

## 🧪 Test It!

### Test 1: Health Check

Open new terminal:
```bash
curl http://localhost:3001/health
```

Should return:
```json
{"status":"ok","service":"FishIt NFT Generator"}
```

### Test 2: Complete Fishing Flow

1. Open frontend: http://localhost:3000
2. Connect wallet
3. Claim faucet (if needed)
4. Buy bait
5. Start fishing
6. Wait for casting (60s)
7. Unstake during strike (30s)
8. **Watch backend terminal!**

You should see:
```
🐟 Fish Caught!
User: 0x...
Amount: 5.0 FSHT
Bait: 2

🎨 Generating epic fish NFT...
📤 Uploading to IPFS...
✅ Uploaded: ipfs://QmXxx...
📝 Preparing NFT for 0x...
⏳ Transaction sent: 0xabc...
✅ NFT prepared!
🎉 NFT generation complete!
```

9. Frontend will show "NFT Ready!" card
10. Click "Claim NFT Now!"
11. Done! 🎉

---

## 🐛 Common Issues

### Issue: "Pinata connection failed"
**Fix**: Check your Pinata API keys in `.env`

### Issue: "insufficient funds for gas"
**Fix**: Get testnet ETH from Lisk Sepolia faucet

### Issue: "caller is not the owner"
**Fix**: Use the private key of the wallet that deployed contracts

### Issue: Backend crashes on startup
**Fix**: 
1. Check all API keys are correct
2. Remove any extra spaces in `.env`
3. Verify RPC URL is accessible

---

## 📋 Environment Variables Summary

You need to fill in these 3 things in `.env`:

1. **PRIVATE_KEY** - From MetaMask (contract owner wallet)
2. **PINATA_API_KEY** - From Pinata dashboard
3. **PINATA_SECRET_KEY** - From Pinata dashboard
4. **GEMINI_API_KEY** - From Google AI Studio

Everything else is already configured!

---

## 🎯 What Happens When Fish is Caught?

```
User catches fish (frontend)
         ↓
Smart contract emits FishCaught event
         ↓
Backend detects event
         ↓
Calculate rarity (based on stake + bait)
         ↓
Generate metadata with Gemini AI
         ↓
Upload to IPFS via Pinata
         ↓
Call prepareNFT() on smart contract
         ↓
Frontend detects ReadyToClaim state
         ↓
User clicks "Claim NFT"
         ↓
NFT minted! 🎉
```

---

## 💰 Cost Estimate

### Free Tier Limits:
- **Pinata**: 1 GB storage (plenty for testing)
- **Gemini**: 60 requests/minute (more than enough)
- **Gas**: ~0.001 ETH per NFT preparation (~$0.003)

### For 100 NFTs:
- Pinata: Free
- Gemini: Free
- Gas: ~0.1 ETH (~$0.30)

---

## 🚀 Production Deployment

When ready for production:

### Option 1: Railway (Easiest)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Option 2: Render
1. Push code to GitHub
2. Connect Render to repo
3. Add environment variables
4. Deploy!

### Option 3: VPS (Most Control)
```bash
# On your server
git clone <repo>
cd backend
npm install
npm run build

# Use PM2 for process management
npm install -g pm2
pm2 start npm --name fishit-backend -- start
pm2 save
pm2 startup
```

---

## 📞 Need Help?

1. Check backend logs for errors
2. Verify all API keys are correct
3. Test Pinata connection: https://app.pinata.cloud/
4. Check wallet balance: https://sepolia-blockscout.lisk.com/
5. Verify contract owner matches your private key

---

**You're all set! Happy fishing! 🎣**
