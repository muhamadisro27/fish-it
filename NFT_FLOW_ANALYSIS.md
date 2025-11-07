# 🐟 Analisis Flow NFT Generation - FishIt

## 📋 Current State (Fase 1 & 2 DONE)

### ✅ Yang Sudah Berfungsi:
1. **Wallet Integration** - Connect/disconnect wallet
2. **Faucet** - Claim 10 FSHT setiap 24 jam
3. **Bait Shop** - Buy bait dengan approve + buy flow
4. **Fishing Flow** - Start → Casting (60s) → Strike (30s) → Unstake
5. **NFT Claim UI** - Sidebar menampilkan button claim jika state = ReadyToClaim

### ❌ Yang Belum Berfungsi:
1. **NFT Generation** - Tidak ada backend untuk generate AI image & metadata
2. **prepareNFT()** - Tidak ada yang memanggil fungsi ini setelah FishCaught event
3. **NFT Display** - Aquarium masih menampilkan MOCK_FISH, bukan real NFT dari blockchain
4. **Event Listener** - Tidak ada backend yang listen event FishCaught

---

## 🔄 Smart Contract Flow (FishItStaking.sol)

### State Machine:
```
Idle → Chumming → Casting → Strike → ReadyToClaim → Idle
         ↓          ↓         ↓          ↓
       stake     wait 60s  unstake   claim NFT
```

### Detailed Flow:

#### 1. **startFishing(amount, baitType)**
- User stake tokens + consume bait
- State: `Chumming`
- Event: `FishingStarted` + `StateChanged`

#### 2. **enterCastingPhase()**
- User enter casting phase
- State: `Casting`
- Wait 60 seconds
- Event: `StateChanged`

#### 3. **enterStrikePhase()**
- After 60s, enter strike
- State: `Strike`
- User has 30 seconds window
- Event: `StateChanged`

#### 4. **unstake()**
**CRITICAL LOGIC:**
```solidity
if (timeInStrike <= 30 seconds) {
    // SUCCESS - Fish caught!
    emit FishCaught(...)
    // State stays Strike
    // Backend will change to ReadyToClaim via prepareNFT()
} else {
    // FAILED - Fish escaped
    emit FishEscaped(...)
    delete stakes[msg.sender]
    // State becomes Idle
}
```

⚠️ **PENTING:** 
- Jika berhasil, state TETAP `Strike` (bukan langsung ReadyToClaim)
- Backend harus listen `FishCaught` event
- Backend call `prepareNFT(user, cid)` untuk ubah state ke `ReadyToClaim`

#### 5. **prepareNFT(user, cid)** - Owner Only
- Called by backend after AI generation done
- Set `nftCID` field
- State: `ReadyToClaim`
- Event: `NFTReady`

#### 6. **claimReward()** - User
- Mint NFT via `nft.safeMint(user, cid)`
- Transfer tokens back + 1% reward
- Delete stake
- State: `Idle`
- Event: `NFTClaimed`

---

## 🚨 Missing Components

### 1. Backend Event Listener
**Belum ada!** Perlu dibuat service untuk:
- Listen `FishCaught` event dari smart contract
- Extract `user`, `amount`, `baitType` dari event
- Trigger AI generation pipeline

### 2. AI NFT Generator
**Belum ada!** Perlu dibuat service untuk:
- Generate fish metadata (species, rarity, weight) based on RNG
- Generate AI image via Gemini AI
- Upload image ke Pinata (IPFS)
- Get IPFS CID

### 3. prepareNFT Caller
**Belum ada!** Perlu dibuat service untuk:
- Call `prepareNFT(user, cid)` setelah upload selesai
- Menggunakan owner wallet private key
- Handle transaction confirmation

### 4. Real NFT Display
**Belum ada!** Frontend perlu:
- Fetch NFT IDs dari `tokensOfOwner(address)`
- Fetch token URIs dari `tokenURIsOfOwner(address)`
- Parse metadata JSON dari IPFS
- Display di AquariumGrid

---

## 🎯 Solusi yang Harus Diimplementasi

### **FASE 3: Backend AI NFT Generation**

#### A. Backend Service (Node.js)
```
backend/
├── src/
│   ├── listeners/
│   │   └── fishCaughtListener.ts    # Listen FishCaught event
│   ├── generators/
│   │   ├── rarityCalculator.ts       # Calculate rarity from stake/bait
│   │   ├── aiGenerator.ts            # Gemini AI for metadata
│   │   └── nftMinter.ts              # Call prepareNFT()
│   ├── services/
│   │   └── pinataService.ts          # Upload to IPFS
│   ├── config/
│   │   ├── contracts.ts              # Contract addresses & ABIs
│   │   └── env.ts                    # Environment variables
│   └── index.ts                      # Main entry point
```

#### B. Environment Variables
```env
# Blockchain
RPC_URL=https://rpc.sepolia-api.lisk.com
CHAIN_ID=4202
OWNER_PRIVATE_KEY=0x...

# Contracts
STAKING_CONTRACT=0x803DC34D7E692691A41877553894aa3E14bFF226
NFT_CONTRACT=0xAF0DE0d61af37BfF41471681C6283D7339dF92b0

# Pinata
PINATA_API_KEY=...
PINATA_SECRET_KEY=...

# Gemini AI
GEMINI_API_KEY=...
```

#### C. AI Generation Algorithm
```typescript
// Rarity calculation (from README.md)
const baitMul = { Common: 1, Rare: 1.1, Epic: 1.25, Legendary: 1.5 }[bait]
const base = (randomSeed % 10000) / 10000
const mStake = 1 + 0.35 * Math.log10(Math.max(stake, 100) / 100)
const score = Math.min(1, base * baitMul * mStake)

// Determine rarity
if (score < 0.5) → Common
if (score < 0.75) → Rare
if (score < 0.95) → Epic
else → Legendary

// Generate metadata via Gemini AI
{
  "name": "Golden Tuna #123",
  "description": "A majestic golden tuna...",
  "image": "ipfs://QmXxx...",
  "external_url": "https://fishit.app/fish/123",
  "attributes": [
    { "trait_type": "Species", "value": "Tuna" },
    { "trait_type": "Rarity", "value": "Epic" },
    { "trait_type": "Weight", "value": "45.8 kg" },
    { "trait_type": "Bait Used", "value": "Epic" },
    { "trait_type": "Staked Amount", "value": "500 FSHT" }
  ]
}
```

#### D. Frontend Updates
1. **useNFTData Hook** - Fetch real NFT data
2. **AquariumGrid** - Replace MOCK_FISH dengan real data
3. **NFT Metadata Parser** - Parse IPFS JSON
4. **Loading States** - Show "Generating NFT..." saat ReadyToClaim

---

## 📝 Implementation Steps

### Phase 1: Backend Setup (2-3 hours)
- [ ] Create backend folder structure
- [ ] Setup dependencies (ethers, viem, pinata, gemini)
- [ ] Configure environment variables
- [ ] Create contract config & ABIs

### Phase 2: Event Listener (1-2 hours)
- [ ] Create FishCaught event listener
- [ ] Test event detection
- [ ] Log event data (user, amount, baitType)

### Phase 3: Rarity Calculator (1 hour)
- [ ] Implement rarity formula
- [ ] Generate random seed
- [ ] Calculate fish attributes

### Phase 4: AI Generation (2-3 hours)
- [ ] Integrate Gemini AI API
- [ ] Generate fish metadata
- [ ] Generate placeholder image URL
- [ ] Format NFT metadata JSON

### Phase 5: IPFS Upload (1-2 hours)
- [ ] Setup Pinata client
- [ ] Upload metadata JSON
- [ ] Get IPFS CID
- [ ] Test IPFS gateway

### Phase 6: prepareNFT Caller (1-2 hours)
- [ ] Create transaction signer
- [ ] Call prepareNFT(user, cid)
- [ ] Wait for confirmation
- [ ] Handle errors

### Phase 7: Frontend NFT Display (2-3 hours)
- [ ] Create useNFTCollection hook
- [ ] Fetch tokensOfOwner
- [ ] Fetch & parse metadata
- [ ] Update AquariumGrid
- [ ] Add loading states

### Phase 8: Testing & Polish (2-3 hours)
- [ ] End-to-end test full flow
- [ ] Fix bugs
- [ ] Add error handling
- [ ] Add retry logic

**Total Estimate:** 12-19 hours of development

---

## 🎮 Expected User Flow (After Implementation)

1. User stakes tokens + bait → `FishingStarted` event
2. Wait 60 seconds → `Casting` phase
3. Strike window (30s) → User clicks unstake within time
4. **Backend detects `FishCaught` event** ✨
5. **Backend calculates rarity based on stake + bait** ✨
6. **Backend generates AI metadata via Gemini** ✨
7. **Backend uploads to Pinata IPFS** ✨
8. **Backend calls `prepareNFT(user, cid)`** ✨
9. State changes to `ReadyToClaim` → **Sidebar shows claim button**
10. User clicks "Claim NFT" → Mint NFT + get rewards
11. **Frontend fetches NFT and displays in Aquarium** ✨

---

## 🔐 Security Considerations

1. **Owner Private Key** - Store securely, never commit to git
2. **Rate Limiting** - Prevent spam event processing
3. **Transaction Nonce** - Handle concurrent transactions
4. **Error Recovery** - Retry failed IPFS uploads
5. **Gas Management** - Estimate gas before transactions

---

## 📊 Success Metrics

- ✅ FishCaught events detected within 5 seconds
- ✅ NFT metadata generated in < 30 seconds
- ✅ IPFS upload successful in < 10 seconds
- ✅ prepareNFT transaction confirmed in < 30 seconds
- ✅ Total time: Fish caught → NFT ready < 90 seconds
- ✅ Frontend displays NFT within 10 seconds of claim

---

## 🚀 Next Steps

**FASE 3 adalah CRITICAL untuk MVP!**

Tanpa backend AI NFT generation:
- ❌ User tidak bisa claim NFT
- ❌ State stuck di Strike setelah unstake
- ❌ Aquarium tetap kosong

**Recommendation:** Prioritas develop Fase 3 sekarang!

