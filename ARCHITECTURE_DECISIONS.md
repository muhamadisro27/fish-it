# 🏗️ FishIt - Architecture & Technical Decisions

## 📋 Executive Summary

Dokumen ini menjelaskan arsitektur sistem FishIt dan keputusan teknis yang perlu dibuat sebelum development.

---

## 🎯 System Overview

```
┌─────────────────┐
│   Frontend      │  Next.js + React + Tailwind
│   (User UI)     │  Wallet Connection
└────────┬────────┘
         │
         │ Web3 Calls
         ▼
┌─────────────────┐
│   Blockchain     │  Lisk Sepolia (Chain ID: 4202)
│   Smart          │  5 Contracts Deployed
│   Contracts      │
└────────┬────────┘
         │
         │ Events
         ▼
┌─────────────────┐
│   Backend       │  Node.js/Express atau Next.js API
│   Service       │  Event Listener
│   (NFT Gen)     │  AI Generation (Gemini)
└────────┬────────┘
         │
         │ Upload
         ▼
┌─────────────────┐
│   IPFS          │  Pinata Gateway
│   (Storage)     │  NFT Metadata & Images
└─────────────────┘
```

---

## 🔧 Technical Stack Decisions Needed

### Frontend Stack

#### Option 1: wagmi + viem (Recommended)
**Pros:**
- ✅ Modern, type-safe
- ✅ Great React integration
- ✅ Built-in hooks
- ✅ Active community

**Cons:**
- ❌ Learning curve untuk Solidity types
- ❌ Need to generate types dari ABI

**Setup:**
```bash
npm install wagmi viem @tanstack/react-query
```

#### Option 2: ethers.js + web3-react
**Pros:**
- ✅ Mature, well-documented
- ✅ Easy to use
- ✅ Many examples

**Cons:**
- ❌ Less type-safe
- ❌ More boilerplate

**Recommendation: wagmi + viem** (lebih modern & type-safe)

---

### Wallet Connection

#### Option 1: wagmi + @web3modal/react (Recommended)
**Pros:**
- ✅ Multiple wallet support (MetaMask, WalletConnect, Coinbase, etc)
- ✅ Beautiful UI
- ✅ Easy integration

**Cons:**
- ❌ Extra dependency

#### Option 2: Custom MetaMask + WalletConnect
**Pros:**
- ✅ Full control
- ✅ Smaller bundle

**Cons:**
- ❌ More code to maintain
- ❌ Need to handle multiple wallets manually

**Recommendation: wagmi + @web3modal/react** (better UX)

---

### State Management

#### Option 1: @tanstack/react-query (Recommended)
**Pros:**
- ✅ Perfect untuk server state (blockchain data)
- ✅ Built-in caching
- ✅ Auto-refetching
- ✅ Optimistic updates

**Use Cases:**
- Token balances
- NFT data
- Contract reads
- Transaction status

#### Option 2: Zustand / Jotai
**Pros:**
- ✅ Simple client state
- ✅ Lightweight

**Use Cases:**
- UI state (modals, selected fish)
- Client-side preferences

**Recommendation:**
- **@tanstack/react-query** untuk blockchain state
- **Zustand** untuk client UI state (optional)

---

### Backend Stack

#### Option 1: Next.js API Routes (Recommended untuk MVP)
**Pros:**
- ✅ Same repo as frontend
- ✅ Easy deployment (Vercel)
- ✅ No separate server needed

**Cons:**
- ❌ Serverless cold starts
- ❌ Event listener might be tricky

**Use Cases:**
- API endpoints untuk NFT status
- Webhook handlers

#### Option 2: Express.js Server
**Pros:**
- ✅ Better untuk long-running processes (event listener)
- ✅ More control
- ✅ Easy to add database

**Cons:**
- ❌ Need separate deployment
- ❌ More infrastructure

**Recommendation:**
- **MVP**: Next.js API Routes
- **Production**: Express.js server untuk event listener

---

### Event Listener Strategy

#### Option 1: Polling (Recommended untuk MVP)
**Pros:**
- ✅ Simple to implement
- ✅ No infrastructure needed
- ✅ Works with serverless

**Cons:**
- ❌ Less efficient
- ❌ Delayed detection

**Implementation:**
```js
// Poll setiap 10 detik
setInterval(() => {
  checkForNewEvents();
}, 10000);
```

#### Option 2: WebSocket / Event Subscription
**Pros:**
- ✅ Real-time
- ✅ Efficient

**Cons:**
- ❌ Need persistent connection
- ❌ More complex
- ❌ Not suitable untuk serverless

**Recommendation: Polling untuk MVP**, upgrade ke WebSocket later

---

### AI Image Generation

#### Option 1: Gemini API (Jika support image generation)
**Pros:**
- ✅ Already plan untuk metadata
- ✅ Single API

**Check:** Need to verify if Gemini supports image generation

#### Option 2: DALL-E 3 / Midjourney API
**Pros:**
- ✅ High quality images
- ✅ Reliable

**Cons:**
- ❌ Cost per image
- ❌ Extra API integration

#### Option 3: Stable Diffusion API
**Pros:**
- ✅ Open source
- ✅ Lower cost

**Cons:**
- ❌ Need to host atau use service
- ❌ Quality might vary

**Recommendation:** Start dengan Gemini (if supported), fallback ke DALL-E 3

---

### Database (Optional)

#### Option 1: No Database (MVP)
**Pros:**
- ✅ Simple
- ✅ No infrastructure

**Cons:**
- ❌ No history tracking
- ❌ Event data lost on restart

#### Option 2: SQLite (Development)
**Pros:**
- ✅ Simple file-based
- ✅ No setup needed

#### Option 3: PostgreSQL (Production)
**Pros:**
- ✅ Reliable
- ✅ Can store history, analytics

**Recommendation:**
- **MVP**: No database (pure on-chain)
- **Later**: Add database untuk analytics & history

---

## 📐 Architecture Patterns

### Contract Interaction Pattern

```typescript
// 1. Setup Contract Hooks
const useFishItStaking = () => {
  const { data, isLoading } = useReadContract({
    address: STAKING_ADDRESS,
    abi: FishItStakingABI,
    functionName: 'getStakeInfo',
    args: [userAddress],
  });
  
  return { stakeInfo: data, isLoading };
};

// 2. Write Operations
const { writeContract, isLoading, isSuccess } = useWriteContract();

const startFishing = async (amount: bigint, baitType: number) => {
  // 1. Approve token
  await writeContract({
    address: TOKEN_ADDRESS,
    abi: TokenABI,
    functionName: 'approve',
    args: [STAKING_ADDRESS, amount],
  });
  
  // 2. Start fishing
  await writeContract({
    address: STAKING_ADDRESS,
    abi: StakingABI,
    functionName: 'startFishing',
    args: [amount, baitType],
  });
};
```

### State Management Pattern

```typescript
// Blockchain State (React Query)
const { data: balance } = useQuery({
  queryKey: ['tokenBalance', address],
  queryFn: () => getTokenBalance(address),
  refetchInterval: 5000, // Poll every 5s
});

// Client State (Zustand)
const useFishingStore = create((set) => ({
  currentPhase: 'idle',
  setPhase: (phase) => set({ currentPhase: phase }),
}));
```

### NFT Generation Flow

```
1. User unstake() → FishCaught event emitted
2. Backend event listener detects event
3. Backend calculates rarity
4. Backend calls Gemini API untuk metadata
5. Backend generates atau fetches image
6. Backend uploads image ke Pinata → get image CID
7. Backend creates metadata JSON → upload ke Pinata → get metadata CID
8. Backend calls staking.prepareNFT(user, metadataCID)
9. Frontend polls getStakeInfo() → state = ReadyToClaim
10. User calls claimReward() → NFT minted + tokens transferred
```

---

## 🔐 Security Considerations

### Frontend Security
- [ ] ✅ Never expose private keys
- [ ] ✅ Validate all user inputs
- [ ] ✅ Sanitize metadata sebelum display
- [ ] ✅ Rate limit API calls
- [ ] ✅ Validate contract addresses dari env

### Backend Security
- [ ] ✅ Store private key di environment variable (never in code)
- [ ] ✅ Rate limit AI generation API
- [ ] ✅ Validate event data sebelum processing
- [ ] ✅ Add retry limits untuk API calls
- [ ] ✅ Monitor for suspicious activity

### Smart Contract Security
- [ ] ✅ Use OpenZeppelin contracts (already done)
- [ ] ✅ ReentrancyGuard (already done)
- [ ] ✅ Validate minimum stake
- [ ] ✅ Check bait availability

---

## 📊 Performance Considerations

### Frontend Optimization
- **Caching Strategy:**
  - NFT metadata: Cache di localStorage (24 hours)
  - Token balances: React Query cache (5 seconds)
  - Contract reads: React Query cache (10 seconds)

- **Code Splitting:**
  - Lazy load NFT images
  - Dynamic import untuk heavy components

- **Image Optimization:**
  - Use Next.js Image component
  - Lazy load images below fold

### Backend Optimization
- **Event Processing:**
  - Batch multiple events
  - Queue system untuk concurrent requests
  - Rate limit AI generation

- **IPFS Upload:**
  - Retry mechanism
  - Cache CID untuk same inputs

---

## 🧪 Testing Strategy

### Frontend Testing
- **Unit Tests:**
  - Hooks (useTokenBalance, useStakeInfo, etc)
  - Utility functions
  - Component rendering

- **Integration Tests:**
  - Wallet connection flow
  - Fishing flow end-to-end
  - NFT claiming flow

- **E2E Tests:**
  - Complete user journey
  - Error scenarios

### Backend Testing
- **Unit Tests:**
  - Rarity calculation
  - Event parsing
  - API clients

- **Integration Tests:**
  - Event listener → NFT generation → On-chain
  - IPFS upload flow

### Contract Testing
- [ ] Already have test file (FishIt.test.ts) - perlu diaktifkan
- [ ] Test semua functions
- [ ] Test edge cases
- [ ] Test multi-user scenarios

---

## 📦 Deployment Strategy

### Frontend
- **Platform**: Vercel (recommended untuk Next.js)
- **Build**: `npm run build`
- **Environment**: Set env variables di Vercel dashboard

### Backend
- **Option 1**: Railway (easy setup)
- **Option 2**: Render (free tier available)
- **Option 3**: AWS EC2 (more control)
- **Environment**: Set env variables di platform

### Monitoring
- **Frontend**: Vercel Analytics (built-in)
- **Backend**: Logging ke console + optional Sentry
- **Errors**: Sentry untuk error tracking
- **Performance**: Vercel Analytics + custom metrics

---

## 🎯 Decision Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Frontend Stack** | wagmi + viem | Modern, type-safe |
| **Wallet** | @web3modal/react | Multiple wallet support |
| **State Management** | @tanstack/react-query | Perfect untuk blockchain state |
| **Backend** | Next.js API Routes (MVP) | Simple, same repo |
| **Event Listener** | Polling (MVP) | Simple, works with serverless |
| **AI Generation** | Gemini (if supported) | Already planned |
| **Database** | None (MVP) | Keep it simple, on-chain only |
| **Deployment** | Vercel (Frontend) + Railway (Backend) | Easy setup |

---

## 📝 Next Steps

1. **Review & Decide**: Review semua decisions di atas
2. **Setup Environment**: Prepare env variables
3. **Install Dependencies**: Install chosen stack
4. **Start Fase 1**: Begin dengan wallet integration

---

**Last Updated**: 2025-01-27

