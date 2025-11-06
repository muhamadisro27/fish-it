# ✅ FishIt - Development Checklist

## 📊 Quick Status Overview

| Fase | Progress | Status |
|------|----------|--------|
| Fase 1: Foundation & Wallet | 0% | ⏳ Not Started |
| Fase 2: Core Gameplay | 0% | ⏳ Not Started |
| Fase 3: Backend AI NFT | 0% | ⏳ Not Started |
| Fase 4: UI/UX Enhancement | 0% | ⏳ Not Started |
| Fase 5: Advanced Features | 0% | ⏳ Not Started |
| Fase 6: Production Ready | 0% | ⏳ Not Started |

---

## 🎯 FASE 1: Foundation & Wallet Integration

### Setup Dependencies
- [ ] Install `viem` atau `ethers.js`
- [ ] Install `wagmi` atau `@web3modal/react`
- [ ] Install `@tanstack/react-query`
- [ ] Setup `.env` dengan contract addresses

### Wallet Connection
- [ ] Create `WalletProvider` component
- [ ] Implement MetaMask connection
- [ ] Handle network switching (Lisk Sepolia)
- [ ] Error handling untuk wallet issues
- [ ] Persist connection state

### Contract Configuration
- [ ] Create `lib/contracts.ts` dengan ABIs & addresses
- [ ] Setup contract hooks:
  - [ ] `useFishItToken()`
  - [ ] `useFishItNFT()`
  - [ ] `useFishItStaking()`
  - [ ] `useFishItBaitShop()`
  - [ ] `useFishItFaucet()`

### Basic Blockchain Reads
- [ ] `useTokenBalance(address)`
- [ ] `useBaitInventory(address)`
- [ ] `useStakeInfo(address)`
- [ ] `useFaucetCooldown(address)`
- [ ] `useNFTsOfOwner(address)`

**Status**: ⏳ Not Started | **ETA**: 3-5 hari

---

## 🎮 FASE 2: Core Gameplay Integration

### Faucet Integration
- [ ] Integrate `claim()` function
- [ ] UI dengan countdown timer
- [ ] Toast notifications
- [ ] Auto-refresh balance

### Bait Shop Integration
- [ ] Integrate `buyBait()` function
- [ ] UI untuk purchase dengan approve
- [ ] Update inventory setelah purchase
- [ ] Loading states

### Fishing Flow
- [ ] **Start Fishing**
  - [ ] Modal untuk select bait & amount
  - [ ] Validate minimum stake
  - [ ] Approve token
  - [ ] Transaction handling

- [ ] **Casting Phase**
  - [ ] Auto-trigger setelah start
  - [ ] 60s countdown timer
  - [ ] Visual progress indicator

- [ ] **Strike Phase**
  - [ ] Auto-trigger setelah casting
  - [ ] 30s countdown timer
  - [ ] Big "STRIKE NOW!" button

- [ ] **Unstake**
  - [ ] Handle success (FishCaught)
  - [ ] Handle timeout (FishEscaped)
  - [ ] Show messages

### NFT Claiming
- [ ] Integrate `claimReward()` function
- [ ] UI untuk claim dengan NFT preview
- [ ] Update NFT collection

### State Management
- [ ] Fishing state machine
- [ ] Polling mechanism
- [ ] Handle page refresh

**Status**: ⏳ Not Started | **ETA**: 5-7 hari

---

## 🤖 FASE 3: Backend AI NFT Generation

### Backend Setup
- [ ] Choose stack (Node.js/Express atau Next.js API)
- [ ] Setup environment variables (Gemini, Pinata, Private Key)
- [ ] Project structure

### Event Listener
- [ ] Listen `FishCaught` events
- [ ] Parse event data
- [ ] Store event data

### Rarity Calculation
- [ ] Implement formula dari README
- [ ] Determine rarity tier

### AI Generation
- [ ] Setup Gemini API client
- [ ] Create prompt untuk metadata
- [ ] Generate image (check if Gemini supports atau perlu API lain)
- [ ] Error handling & retries

### IPFS Upload
- [ ] Setup Pinata SDK
- [ ] Upload image ke Pinata
- [ ] Create & upload metadata JSON
- [ ] Get CID

### On-chain Integration
- [ ] Call `prepareNFT()` dengan private key
- [ ] Wait transaction confirmation
- [ ] Error handling & retry

### API Endpoint
- [ ] `GET /api/nft-status/:userAddress`
- [ ] Logging & monitoring

**Status**: ⏳ Not Started | **ETA**: 7-10 hari

---

## 🎨 FASE 4: UI/UX Enhancement

### NFT Display
- [ ] Fetch NFTs dari contract
- [ ] Fetch metadata dari IPFS
- [ ] Display di AquariumGrid
- [ ] Loading & error states
- [ ] Cache metadata

### Fishing Flow UI
- [ ] Progress indicators per phase
- [ ] Animated fishing rod
- [ ] Confetti untuk success
- [ ] Better error messages

### NFT Details Modal
- [ ] Full metadata display
- [ ] Image, attributes, rarity
- [ ] Share functionality (optional)

### Stats Sidebar
- [ ] Real stats (total caught, earned, etc)
- [ ] Rarity distribution
- [ ] Best catch

### Notifications
- [ ] Toast untuk transactions
- [ ] Phase transitions
- [ ] NFT ready notifications
- [ ] Browser notifications (optional)

**Status**: ⏳ Not Started | **ETA**: 4-6 hari

---

## ⚡ FASE 5: Advanced Features

### Performance
- [ ] Caching untuk contract reads
- [ ] NFT metadata caching
- [ ] React.memo optimization
- [ ] Lazy loading
- [ ] Code splitting

### Multi-user Support
- [ ] View other users' collections
- [ ] Public profiles (optional)

### Advanced Features
- [ ] History tracking
- [ ] Achievement system (optional)
- [ ] Streak tracking
- [ ] Mobile responsiveness

### Analytics
- [ ] Google Analytics / PostHog
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring

### Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests

**Status**: ⏳ Not Started | **ETA**: 5-7 hari

---

## 🚀 FASE 6: Production Ready

### Security
- [ ] Review smart contract interactions
- [ ] Input validation
- [ ] API security review

### Documentation
- [ ] User guide
- [ ] Developer docs
- [ ] API docs
- [ ] Deployment guide

### Deployment
- [ ] Production environment setup
- [ ] Configure production RPC
- [ ] Deploy frontend
- [ ] Deploy backend
- [ ] Setup monitoring

### Post-Launch
- [ ] Monitor issues
- [ ] Gather feedback
- [ ] Plan improvements

**Status**: ⏳ Not Started | **ETA**: 3-5 hari

---

## 📝 Quick Reference

### Contract Addresses (Lisk Sepolia)
```
FishItToken:    0xB4Fc4A3e0057F87a91B9f2CF8F6dC7A93d00a335
FishItNFT:      0xAF0DE0d61af37BfF41471681C6283D7339dF92b0
FishItBaitShop: 0x7Aa02e9B84270f1403b7F9ec00728A332b8153b5
FishItFaucet:   0x0f03a6B2cEb40E7C34f7501e883BCBD72659a51A
FishItStaking:  0x803DC34D7E692691A41877553894aa3E14bFF226
```

### Key Constants
- Minimum Stake: 1 FSHT
- Casting Duration: 60 seconds
- Strike Window: 30 seconds
- Reward: 1% dari staked amount
- Faucet: 10 FSHT per 24 hours

### Dependencies Order
1. Fase 1 → Fase 2 (wajib)
2. Fase 2 + Fase 3 → Fase 4 (parallel mungkin, tapi Fase 3 harus selesai untuk NFT claim)
3. Fase 4 → Fase 5 → Fase 6

---

**Last Updated**: 2025-01-27

