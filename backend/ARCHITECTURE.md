# 🏗️ Backend Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FISHIT ECOSYSTEM                         │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Frontend   │         │  Blockchain  │         │   Backend    │
│  (Next.js)   │◄───────►│ (Lisk Sep.)  │◄───────►│  (Node.js)   │
└──────────────┘         └──────────────┘         └──────────────┘
       │                        │                         │
       │                        │                         │
       ▼                        ▼                         ▼
  User Actions          Smart Contracts           NFT Generation
  - Connect Wallet      - FishItStaking           - Event Listener
  - Start Fishing       - FishItNFT               - AI Generation
  - Claim NFT           - FishItToken             - IPFS Upload
```

---

## Detailed Flow

### 1. User Catches Fish (Frontend → Blockchain)

```
User (Frontend)
    │
    │ 1. startFishing(amount, baitType)
    ▼
Smart Contract (FishItStaking)
    │
    │ 2. State: Idle → Chumming → Casting → Strike
    ▼
User clicks "Unstake"
    │
    │ 3. unstake() within 30s
    ▼
Smart Contract
    │
    │ 4. Emits: FishCaught(user, amount, baitType, timestamp)
    ▼
Event emitted to blockchain
```

---

### 2. Backend Processes Event (Blockchain → Backend)

```
Blockchain Event
    │
    │ FishCaught event
    ▼
Backend Event Listener (blockchain.ts)
    │
    │ Detects event
    ▼
NFT Generator (nftGenerator.ts)
    │
    ├─► 1. Calculate Rarity (rarity.ts)
    │   │   - Input: baitType, stakeAmount
    │   │   - Formula: score = base * baitMul * stakeMul
    │   │   - Output: common/rare/epic/legendary
    │   │
    ├─► 2. Generate Metadata (gemini.ts)
    │   │   - Call Gemini AI API
    │   │   - Prompt: rarity, bait, stake
    │   │   - Output: name, description, attributes
    │   │
    ├─► 3. Upload to IPFS (pinata.ts)
    │   │   - Upload metadata JSON
    │   │   - Get CID (Content Identifier)
    │   │   - Output: ipfs://QmXxx...
    │   │
    └─► 4. Prepare NFT (blockchain.ts)
        │   - Call prepareNFT(user, cid)
        │   - Wait for transaction
        │   - State: Strike → ReadyToClaim
        │
        ▼
    NFT Ready!
```

---

### 3. User Claims NFT (Frontend → Blockchain)

```
Frontend Polling
    │
    │ Every 3 seconds: getStakeInfo(user)
    ▼
Check State
    │
    │ If state === ReadyToClaim
    ▼
Show "Claim NFT" Button
    │
    │ User clicks
    ▼
Call claimReward()
    │
    ├─► Mint NFT with CID
    ├─► Transfer tokens + reward
    └─► State: ReadyToClaim → Idle
        │
        ▼
    User receives NFT! 🎉
```

---

## Component Architecture

### Backend Services

```
src/
├── index.ts                    # Entry Point
│   ├─► Express Server (port 3001)
│   ├─► Health Check Endpoint
│   └─► Initialize Services
│
├── services/
│   ├── blockchain.ts           # Blockchain Interaction
│   │   ├─► Connect to RPC
│   │   ├─► Listen to events
│   │   └─► Call prepareNFT()
│   │
│   ├── nftGenerator.ts         # Main Orchestrator
│   │   ├─► Process events
│   │   ├─► Coordinate services
│   │   └─► Error handling
│   │
│   ├── gemini.ts               # AI Generation
│   │   ├─► Call Gemini API
│   │   ├─► Parse response
│   │   └─► Return metadata
│   │
│   └── pinata.ts               # IPFS Upload
│       ├─► Upload JSON
│       ├─► Get CID
│       └─► Test connection
│
├── utils/
│   └── rarity.ts               # Rarity Calculation
│       ├─► Calculate score
│       └─► Determine tier
│
└── types/
    └── index.ts                # TypeScript Types
        ├─► BaitType enum
        ├─► FishCaughtEvent
        └─► NFTMetadata
```

---

## Data Flow

### Event Data Structure

```typescript
FishCaught Event {
  user: "0x1234...5678",
  amount: 5000000000000000000n,  // 5 FSHT in wei
  baitType: 2,                    // Epic bait
  timestamp: 1706123456n
}
```

### Rarity Calculation

```typescript
Input:
  baitType: Epic (2)
  amount: 5 FSHT

Process:
  baitMul = 1.25 (Epic multiplier)
  base = 0.7 (random)
  stakeMul = 1 + 0.35 * log10(5/100) = 1.15
  score = min(1, 0.7 * 1.25 * 1.15) = 1.0

Output:
  rarity: "legendary" (score >= 0.9)
```

### AI Metadata Generation

```typescript
Input:
  rarity: "legendary"
  baitUsed: "Epic"
  stakeAmount: "5.0 FSHT"

Gemini AI Prompt:
  "Generate a unique fish NFT metadata in JSON format.
   Rarity: legendary
   Bait Used: Epic
   Stake Amount: 5.0 FSHT
   ..."

Output:
  {
    name: "Golden Leviathan",
    description: "A majestic golden fish...",
    species: "Mythical Koi",
    attributes: [
      { trait_type: "Rarity", value: "legendary" },
      { trait_type: "Species", value: "Mythical Koi" },
      { trait_type: "Weight", value: 15.5 },
      { trait_type: "Bait Used", value: "Epic" },
      { trait_type: "Stake Amount", value: "5.0" }
    ]
  }
```

### IPFS Upload

```typescript
Input:
  metadata: { name, description, attributes, ... }

Pinata Upload:
  POST to Pinata API
  Upload JSON to IPFS

Output:
  CID: "QmXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  Full URI: "ipfs://QmXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Smart Contract Call

```typescript
Input:
  user: "0x1234...5678"
  cid: "QmXxx..."

Contract Call:
  prepareNFT(user, cid)

Transaction:
  - Gas: ~0.001 ETH
  - Wait for confirmation
  - Update state: Strike → ReadyToClaim

Output:
  Transaction Hash: "0xabc...def"
```

---

## State Machine

### Fishing States

```
┌──────┐
│ Idle │ ◄─────────────────────────────┐
└───┬──┘                                │
    │ startFishing()                    │
    ▼                                   │
┌──────────┐                            │
│ Chumming │                            │
└─────┬────┘                            │
      │ enterCastingPhase()             │
      ▼                                 │
┌──────────┐                            │
│ Casting  │ (60 seconds)               │
└─────┬────┘                            │
      │ enterStrikePhase()              │
      ▼                                 │
┌──────────┐                            │
│  Strike  │ (30 seconds)               │
└─────┬────┘                            │
      │ unstake()                       │
      ├─► Success ──┐                   │
      │             ▼                   │
      │      ┌──────────────┐           │
      │      │ ReadyToClaim │           │
      │      └──────┬───────┘           │
      │             │ claimReward()     │
      │             └───────────────────┘
      │
      └─► Timeout ──────────────────────┘
```

---

## API Endpoints

### Health Check

```
GET /health

Response:
{
  "status": "ok",
  "service": "FishIt NFT Generator"
}
```

---

## Error Handling

### Event Processing Errors

```typescript
try {
  // Process event
  await nftGenerator.processEvent(event);
} catch (error) {
  console.error('❌ Error processing event:', error);
  // Event is skipped, user can try fishing again
}
```

### Duplicate Prevention

```typescript
const processing = new Set<string>();
const key = `${user}-${timestamp}`;

if (processing.has(key)) {
  console.log('⚠️  Already processing');
  return;
}

processing.add(key);
// ... process event
processing.delete(key);
```

### Retry Logic

Currently: No automatic retries (fail fast)
Future: Add exponential backoff for:
- IPFS uploads
- AI generation
- Blockchain transactions

---

## Performance Considerations

### Event Listening

- **Method**: WebSocket connection to RPC
- **Latency**: ~1-3 seconds to detect event
- **Reliability**: Auto-reconnect on disconnect

### AI Generation

- **Provider**: Google Gemini
- **Latency**: ~2-5 seconds per request
- **Rate Limit**: 60 requests/minute (free tier)
- **Cost**: Free for development

### IPFS Upload

- **Provider**: Pinata
- **Latency**: ~1-3 seconds per upload
- **Storage**: 1GB free tier
- **Cost**: Free for development

### Blockchain Transactions

- **Gas Cost**: ~0.001 ETH per prepareNFT()
- **Confirmation**: ~2-5 seconds on Lisk Sepolia
- **Reliability**: High (testnet)

### Total Processing Time

```
Event Detection:     1-3s
Rarity Calculation:  <1s
AI Generation:       2-5s
IPFS Upload:         1-3s
Blockchain Call:     2-5s
─────────────────────────
Total:              6-17s
```

**Average: ~10 seconds from fish caught to NFT ready**

---

## Security

### Private Key Management

```
✅ Stored in .env file
✅ Never committed to git
✅ Only used for prepareNFT() calls
✅ Separate wallet recommended
```

### API Key Security

```
✅ Pinata: Scoped permissions (only pin operations)
✅ Gemini: Rate limited by Google
✅ Environment variables only
```

### Input Validation

```typescript
// Validate event data
if (!event.user || !event.amount || event.baitType === undefined) {
  throw new Error('Invalid event data');
}

// Validate CID format
if (!cid.startsWith('Qm')) {
  throw new Error('Invalid IPFS CID');
}
```

---

## Monitoring & Logging

### Console Logs

```
🚀 Startup
🔍 Testing connections
✅ Success indicators
📡 Blockchain connection
🎣 Event listening
🐟 Fish caught
🎨 NFT generation
📤 IPFS upload
📝 Contract call
⏳ Transaction pending
✅ Transaction confirmed
🎉 Process complete
❌ Errors
⚠️  Warnings
```

### Metrics to Track

- Events processed per hour
- Average processing time
- IPFS upload success rate
- AI generation success rate
- Gas usage per day
- Error rate

---

## Scalability

### Current Capacity

- **Events**: ~100/hour (limited by AI rate limit)
- **Concurrent**: 1 event at a time (can be parallelized)
- **Storage**: 1GB IPFS (free tier)

### Scaling Options

1. **Horizontal Scaling**:
   - Run multiple backend instances
   - Use message queue (Redis/RabbitMQ)
   - Distribute event processing

2. **Vertical Scaling**:
   - Upgrade Pinata plan
   - Upgrade Gemini API tier
   - Use faster RPC provider

3. **Optimization**:
   - Cache AI responses for similar inputs
   - Batch IPFS uploads
   - Optimize gas usage

---

## Future Enhancements

### Phase 1 (Current)
- ✅ Event listening
- ✅ AI metadata generation
- ✅ IPFS upload
- ✅ NFT preparation

### Phase 2 (Future)
- [ ] AI image generation (not just metadata)
- [ ] Database for history tracking
- [ ] Admin dashboard
- [ ] Analytics API

### Phase 3 (Advanced)
- [ ] Multiple AI providers (fallback)
- [ ] Image caching
- [ ] Batch processing
- [ ] WebSocket API for real-time updates

---

## Dependencies

```json
{
  "ethers": "^6.13.4",           // Blockchain interaction
  "@google/generative-ai": "^0.21.0",  // AI generation
  "@pinata/sdk": "^2.1.0",       // IPFS upload
  "express": "^4.21.2",          // HTTP server
  "dotenv": "^16.4.5"            // Environment variables
}
```

---

**Architecture designed for simplicity, reliability, and scalability.**
