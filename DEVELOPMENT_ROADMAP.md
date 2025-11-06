# 🗺️ FishIt - Rencana Pengembangan Bertahap

## 📊 Status Proyek Saat Ini

### ✅ Sudah Selesai
- [x] Smart Contract Development (5 contracts)
- [x] Contract Deployment ke Lisk Sepolia
- [x] Frontend UI Structure (Next.js + Tailwind)
- [x] Component Library (shadcn/ui)
- [x] Visual Design System

### 🔄 Sedang Berjalan / Belum
- [ ] Wallet Integration (MetaMask/WalletConnect)
- [ ] Blockchain Interaction Layer
- [ ] Real-time State Management
- [ ] Backend AI NFT Generation Service
- [ ] IPFS Integration (Pinata)
- [ ] Event Listening & Notifications
- [ ] Fishing Flow Integration

---

## 🎯 TAHAPAN PENGEMBANGAN

---

## **FASE 1: Foundation & Wallet Integration** 
**Durasi Estimasi: 3-5 hari**  
**Prioritas: 🔴 CRITICAL**

### Tujuan
Mengintegrasikan wallet dan membangun layer komunikasi dasar dengan blockchain.

### Task Breakdown

#### 1.1 Setup Dependencies
- [ ] Install `viem` atau `ethers.js` untuk blockchain interaction
- [ ] Install `wagmi` atau `@web3modal` untuk wallet connection
- [ ] Install `@tanstack/react-query` untuk state management & caching
- [ ] Setup environment variables dengan address contract yang sudah deployed

#### 1.2 Wallet Connection Provider
- [ ] Buat `WalletProvider` component untuk manage wallet state
- [ ] Implementasi MetaMask connection
- [ ] Implementasi WalletConnect (optional, bisa ditunda)
- [ ] Handle network switching (Lisk Sepolia)
- [ ] Error handling untuk wallet tidak terinstall
- [ ] Persist wallet connection state

#### 1.3 Contract Configuration
- [ ] Buat file `lib/contracts.ts` dengan:
  - Contract ABIs (import dari contract artifacts)
  - Contract addresses dari deployment
  - Contract instances dengan viem/wagmi
- [ ] Setup contract hooks menggunakan wagmi:
  - `useFishItToken()`
  - `useFishItNFT()`
  - `useFishItStaking()`
  - `useFishItBaitShop()`
  - `useFishItFaucet()`

#### 1.4 Basic Blockchain Reads
- [ ] Buat hooks untuk read operations:
  - `useTokenBalance(address)` - check FSHT balance
  - `useBaitInventory(address)` - check bait inventory
  - `useStakeInfo(address)` - check current fishing state
  - `useFaucetCooldown(address)` - check claim eligibility
  - `useNFTsOfOwner(address)` - fetch user's NFTs

#### Deliverables
- ✅ Wallet bisa connect/disconnect
- ✅ Network auto-detect & switch
- ✅ Bisa read data dari blockchain
- ✅ Error handling untuk common issues

---

## **FASE 2: Core Gameplay Integration**
**Durasi Estimasi: 5-7 hari**  
**Prioritas: 🔴 CRITICAL**

### Tujuan
Mengintegrasikan alur fishing lengkap dengan smart contract.

### Task Breakdown

#### 2.1 Faucet Integration
- [ ] Integrate `FishItFaucet.claim()` function
- [ ] UI untuk claim faucet dengan:
  - Button disabled jika masih cooldown
  - Countdown timer untuk next claim
  - Success/error toast notifications
- [ ] Auto-refresh balance setelah claim

#### 2.2 Bait Shop Integration
- [ ] Integrate `FishItBaitShop.buyBait()` function
- [ ] UI untuk membeli umpan:
  - Display harga per tipe umpan
  - Input quantity (optional, bisa default 1)
  - Approve token sebelum buy
  - Loading state & transaction status
- [ ] Update inventory setelah purchase berhasil

#### 2.3 Fishing Flow Integration
- [ ] **Start Fishing** (`startFishing`)
  - Modal untuk select bait type & stake amount
  - Validate minimum stake (1 FSHT)
  - Validate bait availability
  - Approve token sebelum start
  - Transaction handling dengan loading states

- [ ] **Casting Phase** (`enterCastingPhase`)
  - Auto-trigger setelah startFishing success
  - Countdown timer 60 detik
  - Visual indicator (progress bar / animation)
  - Polling stake info untuk state changes

- [ ] **Strike Phase** (`enterStrikePhase`)
  - Auto-trigger setelah casting >= 60s
  - Countdown timer 30 detik
  - Big "STRIKE NOW!" button
  - Real-time countdown dengan visual urgency

- [ ] **Unstake** (`unstake`)
  - Handle success (FishCaught event)
  - Handle timeout (FishEscaped event)
  - Show appropriate messages
  - Clean up state setelah unstake

#### 2.4 State Management
- [ ] Implement fishing state machine:
  ```
  Idle → Chumming → Casting → Strike → ReadyToClaim
  ```
- [ ] Polling mechanism untuk check state changes
- [ ] Optimistic updates untuk better UX
- [ ] Handle edge cases (user refresh page, multiple tabs)

#### 2.5 NFT Claiming
- [ ] Integrate `claimReward()` function
- [ ] UI untuk claim setelah NFT ready:
  - Show NFT preview (dari CID)
  - Display reward amount
  - Claim button dengan loading state
- [ ] Update user's NFT collection setelah claim

#### Deliverables
- ✅ User bisa claim faucet
- ✅ User bisa beli umpan
- ✅ User bisa complete fishing flow end-to-end
- ✅ State transitions smooth dengan visual feedback
- ✅ Error handling untuk semua edge cases

---

## **FASE 3: Backend AI NFT Generation**
**Durasi Estimasi: 7-10 hari**  
**Prioritas: 🟡 HIGH**

### Tujuan
Membangun backend service untuk generate NFT menggunakan AI dan upload ke IPFS.

### Task Breakdown

#### 3.1 Backend Setup
- [ ] Pilih stack: Node.js/Express atau Next.js API Routes
- [ ] Setup environment variables:
  - Gemini API key
  - Pinata API key & secret
  - Private key untuk call `prepareNFT()`
  - Contract addresses
- [ ] Setup project structure

#### 3.2 Event Listener Service
- [ ] Setup event listener untuk `FishCaught` event dari staking contract
- [ ] Parse event data:
  - User address
  - Stake amount
  - Bait type
  - Timestamp
- [ ] Store event data ke database (optional, bisa pakai in-memory atau file)
- [ ] Handle multiple concurrent events

#### 3.3 Rarity Calculation
- [ ] Implement formula dari README:
  ```js
  const baitMul = { Common: 1, Rare: 1.1, Epic: 1.25, Legendary: 1.5 }[bait];
  const base = (r0 % 10000) / 10000; // Random number
  const mStake = 1 + 0.35 * Math.log10(Math.max(stake, 100) / 100);
  const score = Math.min(1, base * baitMul * mStake);
  ```
- [ ] Determine rarity tier berdasarkan score:
  - Common: 0 - 0.5
  - Rare: 0.5 - 0.75
  - Epic: 0.75 - 0.9
  - Legendary: 0.9 - 1.0

#### 3.4 AI Generation (Gemini)
- [ ] Setup Gemini API client
- [ ] Create prompt untuk generate fish metadata:
  - Name (species name)
  - Description (detail tentang ikan)
  - Rarity tier
  - Attributes (weight, color, etc)
- [ ] Generate image prompt berdasarkan metadata
- [ ] Call Gemini untuk generate image (atau gunakan image generation API terpisah)
- [ ] Handle API errors & retries

#### 3.5 IPFS Upload (Pinata)
- [ ] Setup Pinata SDK
- [ ] Upload generated image ke Pinata
- [ ] Create metadata JSON dengan:
  - Image IPFS URL
  - Name, description, rarity
  - Attributes
  - External URL (optional)
- [ ] Upload metadata JSON ke Pinata
- [ ] Get CID untuk metadata

#### 3.6 On-chain Integration
- [ ] Call `staking.prepareNFT(userAddress, cid)` dengan private key
- [ ] Wait untuk transaction confirmation
- [ ] Emit event atau webhook untuk notify frontend (optional)
- [ ] Error handling & retry mechanism

#### 3.7 API Endpoint
- [ ] Create endpoint untuk check NFT status: `GET /api/nft-status/:userAddress`
- [ ] Create endpoint untuk manual trigger (dev only): `POST /api/generate-nft`
- [ ] Add logging untuk debugging
- [ ] Add rate limiting (optional)

#### Deliverables
- ✅ Event listener running & listening
- ✅ AI generation pipeline working
- ✅ IPFS upload successful
- ✅ NFT metadata on-chain
- ✅ Frontend bisa poll untuk check readiness

---

## **FASE 4: UI/UX Enhancement & NFT Display**
**Durasi Estimasi: 4-6 hari**  
**Prioritas: 🟡 HIGH**

### Tujuan
Meningkatkan UX dan menampilkan NFT collection dengan benar.

### Task Breakdown

#### 4.1 NFT Display Integration
- [ ] Fetch NFTs dari smart contract menggunakan `tokensOfOwner()`
- [ ] Fetch metadata dari IPFS (Pinata gateway)
- [ ] Display NFT images di AquariumGrid
- [ ] Handle loading states & error states
- [ ] Cache NFT metadata untuk performance

#### 4.2 Fishing Flow UI Enhancement
- [ ] Add progress indicators di setiap phase:
  - Chumming: "Preparing bait..."
  - Casting: Animated fishing rod + countdown
  - Strike: Urgent visual dengan timer
- [ ] Add sound effects (optional)
- [ ] Add confetti animation untuk success
- [ ] Better error messages dengan actionable steps

#### 4.3 NFT Details Modal
- [ ] Fetch full metadata dari IPFS
- [ ] Display:
  - NFT image
  - Name, description, rarity
  - Attributes (weight, species, etc)
  - Token ID & contract address
  - Owner address
  - Catch timestamp
- [ ] Add share functionality (optional)

#### 4.4 Stats Sidebar Enhancement
- [ ] Display real stats:
  - Total fish caught
  - Total FSHT earned
  - Rarity distribution
  - Best catch (highest rarity)
- [ ] Add leaderboard (optional, perlu contract modification)

#### 4.5 Notifications System
- [ ] Toast notifications untuk:
  - Transaction success/failure
  - Phase transitions
  - NFT ready to claim
  - Low balance warnings
- [ ] Optional: Browser notifications untuk strike phase

#### Deliverables
- ✅ NFT collection displayed dengan benar
- ✅ Fishing flow UX smooth & intuitive
- ✅ Real stats & data displayed
- ✅ Good error handling & user feedback

---

## **FASE 5: Advanced Features & Optimization**
**Durasi Estimasi: 5-7 hari**  
**Prioritas: 🟢 MEDIUM**

### Tujuan
Menambahkan fitur lanjutan dan optimasi performa.

### Task Breakdown

#### 5.1 Performance Optimization
- [ ] Implement caching untuk:
  - Contract reads (React Query)
  - NFT metadata (localStorage/cache API)
  - User balances
- [ ] Optimize re-renders dengan React.memo
- [ ] Lazy load images & components
- [ ] Code splitting untuk better bundle size

#### 5.2 Multi-user Support
- [ ] Support untuk view other users' collections
- [ ] Public profile page (optional)
- [ ] Share fishing results

#### 5.3 Advanced Fishing Features
- [ ] History tracking (fishing attempts, results)
- [ ] Achievement system (optional, perlu contract)
- [ ] Streak tracking (daily fishing)
- [ ] Rare fish notifications

#### 5.4 Mobile Responsiveness
- [ ] Test & fix mobile UI
- [ ] Touch-friendly buttons
- [ ] Mobile wallet connection optimization
- [ ] Responsive NFT grid

#### 5.5 Analytics & Monitoring
- [ ] Add analytics (Google Analytics / PostHog)
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] User behavior tracking

#### 5.6 Testing
- [ ] Unit tests untuk hooks & utilities
- [ ] Integration tests untuk fishing flow
- [ ] E2E tests untuk critical paths
- [ ] Contract interaction tests

#### Deliverables
- ✅ Fast & responsive app
- ✅ Good mobile experience
- ✅ Analytics & monitoring setup
- ✅ Test coverage untuk critical features

---

## **FASE 6: Production Ready**
**Durasi Estimasi: 3-5 hari**  
**Prioritas: 🟢 MEDIUM**

### Tujuan
Preparing untuk production deployment.

### Task Breakdown

#### 6.1 Security Audit
- [ ] Review smart contract interactions
- [ ] Check for common vulnerabilities
- [ ] Validate input sanitization
- [ ] Review API security

#### 6.2 Documentation
- [ ] User guide / tutorial
- [ ] Developer documentation
- [ ] API documentation
- [ ] Deployment guide

#### 6.3 Production Deployment
- [ ] Setup production environment
- [ ] Configure production RPC endpoints
- [ ] Setup domain & SSL
- [ ] Deploy frontend (Vercel/Netlify)
- [ ] Deploy backend (Railway/Render/AWS)
- [ ] Setup monitoring & alerts

#### 6.4 Post-Launch
- [ ] Monitor for issues
- [ ] Gather user feedback
- [ ] Plan for improvements
- [ ] Marketing materials (optional)

#### Deliverables
- ✅ Production-ready deployment
- ✅ Documentation complete
- ✅ Security reviewed
- ✅ Monitoring active

---

## 📋 DEPENDENCIES & TECHNICAL NOTES

### Dependencies Antara Fase
- **Fase 1** harus selesai sebelum Fase 2
- **Fase 2** bisa parallel dengan Fase 3 (backend), tapi Fase 3 harus selesai sebelum claim NFT bekerja
- **Fase 4** depends on Fase 2 & 3
- **Fase 5 & 6** bisa dilakukan setelah core functionality ready

### Technical Stack Recommendations

#### Frontend
- **Wallet**: `wagmi` + `@web3modal/react` atau `viem` + custom hooks
- **State Management**: `@tanstack/react-query` untuk server state, `zustand` untuk client state
- **Blockchain**: `viem` (modern, type-safe)

#### Backend
- **Runtime**: Node.js dengan Express atau Next.js API Routes
- **Event Listener**: `viem` public client dengan `watchEvent`
- **AI**: Google Gemini API
- **IPFS**: Pinata SDK
- **Database**: Optional - bisa pakai SQLite untuk dev, PostgreSQL untuk production

### Environment Variables Needed

```env
# Frontend
NEXT_PUBLIC_CHAIN_RPC=https://rpc.sepolia-api.lisk.com
NEXT_PUBLIC_CHAIN_ID=4202

NEXT_PUBLIC_FSHT_TOKEN_ADDRESS=0xB4Fc4A3e0057F87a91B9f2CF8F6dC7A93d00a335
NEXT_PUBLIC_STAKING_ADDRESS=0x803DC34D7E692691A41877553894aa3E14bFF226
NEXT_PUBLIC_NFT_ADDRESS=0xAF0DE0d61af37BfF41471681C6283D7339dF92b0
NEXT_PUBLIC_BAITSHOP_ADDRESS=0x7Aa02e9B84270f1403b7F9ec00728A332b8153b5
NEXT_PUBLIC_FAUCET_ADDRESS=0x0f03a6B2cEb40E7C34f7501e883BCBD72659a51A

# Backend
GEMINI_API_KEY=your_gemini_key
PINATA_API_KEY=your_pinata_key
PINATA_SECRET_KEY=your_pinata_secret
PRIVATE_KEY=your_backend_wallet_private_key
CHAIN_RPC=https://rpc.sepolia-api.lisk.com
```

---

## 🎯 PRIORITAS & MILESTONE

### Milestone 1: MVP (Fase 1 + 2)
**Target**: User bisa fishing end-to-end tanpa NFT generation
- Wallet connection ✅
- Faucet claim ✅
- Buy bait ✅
- Complete fishing flow ✅
- **Estimated**: ~8-12 hari

### Milestone 2: Full Feature (Fase 1-3)
**Target**: NFT generation bekerja
- Semua dari Milestone 1 ✅
- Backend AI generation ✅
- NFT ready to claim ✅
- **Estimated**: ~15-22 hari

### Milestone 3: Production Ready (Fase 1-6)
**Target**: Siap untuk public launch
- Semua features ✅
- Optimized ✅
- Tested ✅
- Deployed ✅
- **Estimated**: ~23-35 hari

---

## 📝 NOTES & CONSIDERATIONS

1. **Backend Private Key**: Perlu wallet dengan private key untuk call `prepareNFT()`. Jangan commit ke git!

2. **Event Listener**: Bisa pakai polling atau WebSocket. Polling lebih simple untuk start.

3. **NFT Image Generation**: Gemini mungkin tidak langsung generate image. Perlu check apakah perlu DALL-E atau Midjourney API.

4. **Gas Costs**: Consider gas optimization untuk user experience. Lisk Sepolia mungkin lebih murah.

5. **Error Handling**: Critical untuk blockchain apps. User harus tahu apa yang salah dan bagaimana fix.

6. **Testing**: Test dengan small amounts first. Jangan langsung besar-besaran.

7. **Rate Limiting**: Backend perlu rate limiting untuk prevent abuse AI generation.

---

## 🔄 ITERATION APPROACH

1. **Start Small**: Fase 1 minimal viable integration
2. **Test Thoroughly**: Test setiap fase sebelum lanjut
3. **Gather Feedback**: Test dengan real users di setiap milestone
4. **Iterate**: Improve berdasarkan feedback
5. **Scale**: Add advanced features setelah core stable

---

**Total Estimated Timeline**: 23-35 hari development (1-1.5 bulan dengan 1-2 developer)

**Last Updated**: 2025-01-27

