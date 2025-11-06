# ✅ Action Items - What YOU Need to Do

## 🎯 Overview

The backend code is **100% complete**. You just need to:
1. Get 3 API keys
2. Add them to `.env` file
3. Run the backend

**Total time: ~20 minutes**

---

## 📋 Step-by-Step Checklist

### ☐ Step 1: Get Pinata API Keys (5 minutes)

1. Go to: **https://pinata.cloud/**
2. Click **"Sign Up"** (use email or Google)
3. Verify your email
4. After login, click **"API Keys"** in left sidebar
5. Click **"New Key"** button
6. In the popup:
   - Enable: ✅ `pinFileToIPFS`
   - Enable: ✅ `pinJSONToIPFS`
   - Key Name: `FishIt Backend`
7. Click **"Create Key"**
8. **IMPORTANT**: Copy both values NOW (you can't see secret again):
   - `API Key`: Copy this
   - `API Secret`: Copy this
9. Save them in a text file temporarily

---

### ☐ Step 2: Get Gemini AI API Key (3 minutes)

1. Go to: **https://makersuite.google.com/app/apikey**
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Select **"Create API key in new project"**
5. Copy the API key that appears
6. Save it in your text file

---

### ☐ Step 3: Get Your Wallet Private Key (2 minutes)

1. Open **MetaMask** browser extension
2. Click the **3 dots (⋮)** next to your account name
3. Click **"Account Details"**
4. Click **"Export Private Key"**
5. Enter your MetaMask password
6. Click **"Confirm"**
7. Copy the private key (starts with `0x`)
8. Save it in your text file

**⚠️ CRITICAL**: This must be the same wallet that deployed the smart contracts!

---

### ☐ Step 4: Install Backend Dependencies (2 minutes)

Open terminal and run:

```bash
cd backend
npm install
```

Wait for installation to complete.

---

### ☐ Step 5: Configure Environment Variables (3 minutes)

1. In the `backend` folder, copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` file in your text editor

3. Find these lines and paste your keys:

```env
# Line 3: Paste your MetaMask private key
PRIVATE_KEY=paste_here_without_quotes

# Line 11: Paste your Pinata API key
PINATA_API_KEY=paste_here_without_quotes

# Line 12: Paste your Pinata secret key
PINATA_SECRET_KEY=paste_here_without_quotes

# Line 15: Paste your Gemini API key
GEMINI_API_KEY=paste_here_without_quotes
```

4. Save the file

**Example of what it should look like:**
```env
PRIVATE_KEY=0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890
PINATA_API_KEY=abc123xyz789
PINATA_SECRET_KEY=def456uvw012
GEMINI_API_KEY=AIzaSyABC123XYZ789
```

---

### ☐ Step 6: Verify Your Wallet Has ETH (2 minutes)

1. Go to: **https://sepolia-blockscout.lisk.com/**
2. Paste your wallet address in search
3. Check you have at least **0.01 ETH** for gas fees
4. If not, get testnet ETH from a Lisk Sepolia faucet

---

### ☐ Step 7: Start the Backend (1 minute)

In terminal, run:

```bash
npm run dev
```

**Expected output:**
```
🚀 FishIt Backend Starting...

🔍 Testing Pinata connection...
✅ Pinata connected

📡 Connected to blockchain (Block: 12345678)

🎣 Listening for FishCaught events...
🌐 API Server running on http://localhost:3001
✅ Backend ready!
```

**If you see this, you're done! ✅**

---

### ☐ Step 8: Test Health Check (1 minute)

Open a **new terminal** and run:

```bash
curl http://localhost:3001/health
```

**Expected response:**
```json
{"status":"ok","service":"FishIt NFT Generator"}
```

---

### ☐ Step 9: Test Complete Flow (5 minutes)

1. Keep backend running in terminal
2. Open frontend: **http://localhost:3000**
3. Connect your wallet
4. Claim faucet tokens (if needed)
5. Buy some bait
6. Start fishing:
   - Select bait
   - Enter stake amount (e.g., 5 FSHT)
   - Approve and start
7. Wait 60 seconds (casting phase)
8. Click "UNSTAKE NOW!" within 30 seconds
9. **Watch the backend terminal!**

**You should see:**
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

10. In frontend, you'll see **"NFT Ready!"** card appear
11. Click **"Claim NFT Now!"**
12. Approve transaction in MetaMask
13. **Success! You got your first AI-generated fish NFT! 🎉**

---

## 🐛 Troubleshooting

### Problem: "Pinata connection failed"
**Solution**: 
- Check your Pinata API key and secret in `.env`
- Make sure there are no extra spaces
- Verify keys are active at https://app.pinata.cloud/

### Problem: "insufficient funds for gas"
**Solution**: 
- Your wallet needs ETH for gas fees
- Get testnet ETH from Lisk Sepolia faucet
- Check balance at https://sepolia-blockscout.lisk.com/

### Problem: "caller is not the owner"
**Solution**: 
- You're using the wrong private key
- Use the wallet that deployed the contracts
- Check contract owner with block explorer

### Problem: Backend crashes on startup
**Solution**: 
1. Check all API keys are correct in `.env`
2. Remove any extra spaces or quotes
3. Verify Node.js version: `node --version` (need 18+)
4. Try: `rm -rf node_modules && npm install`

### Problem: "AI generation failed"
**Solution**: 
- Check Gemini API key in `.env`
- Verify key is active at https://makersuite.google.com/
- Check you haven't hit rate limits

---

## 📝 Summary of What You Need

### API Keys to Get:
1. ✅ Pinata API Key (from https://pinata.cloud/)
2. ✅ Pinata Secret Key (from https://pinata.cloud/)
3. ✅ Gemini API Key (from https://makersuite.google.com/app/apikey)
4. ✅ MetaMask Private Key (from MetaMask → Account Details)

### Files to Edit:
1. ✅ `backend/.env` - Add your 4 keys here

### Commands to Run:
```bash
cd backend
npm install
npm run dev
```

---

## ✅ Success Checklist

You're successful when:
- [ ] Backend starts without errors
- [ ] Shows "✅ Pinata connected"
- [ ] Shows "✅ Backend ready!"
- [ ] Health check returns OK
- [ ] Can catch a fish in frontend
- [ ] Backend processes the event
- [ ] NFT becomes claimable
- [ ] Can claim NFT successfully

---

## 🎉 That's It!

Once you complete these steps, your backend will:
- ✅ Automatically listen for fish catches
- ✅ Generate unique NFT metadata with AI
- ✅ Upload to IPFS
- ✅ Make NFTs claimable
- ✅ Work seamlessly with frontend

**Total setup time: ~20 minutes**

---

## 📞 Quick Reference

### Start Backend:
```bash
cd backend
npm run dev
```

### Stop Backend:
```bash
# Press Ctrl+C in the terminal
```

### Check Logs:
```bash
# Logs appear in the terminal where you ran npm run dev
```

### Test Health:
```bash
curl http://localhost:3001/health
```

---

## 🚀 Next Steps After Testing

Once everything works:

1. **Deploy to Production**:
   - Railway: https://railway.app/
   - Render: https://render.com/
   - Or any VPS

2. **Monitor**:
   - Keep an eye on gas usage
   - Check IPFS uploads
   - Monitor error rates

3. **Scale**:
   - Add more features
   - Improve AI prompts
   - Add image generation

---

**You got this! 🎣✨**

Need help? Check:
- `README.md` - Full documentation
- `SETUP_GUIDE.md` - Detailed setup guide
- Backend logs - Error messages
