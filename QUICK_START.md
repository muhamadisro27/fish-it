# 🚀 FishIt - Quick Start Guide

## ✅ Fase 1 Selesai!

Wallet integration dan blockchain hooks sudah siap. Mari kita test!

---

## 📋 Prerequisites

- Node.js 18+ installed
- MetaMask browser extension installed
- Some test ETH di Lisk Sepolia (untuk gas fees)

---

## 🔧 Setup Steps

### 1. Setup Environment Variables

```bash
cd frontend
cp env.example .env.local
```

Edit `.env.local` dan update:

```env
# WalletConnect Project ID (get from https://cloud.walletconnect.com/)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_actual_project_id
```

> **Note**: Semua contract addresses sudah di-set. Hanya perlu WalletConnect ID jika ingin WalletConnect support.

### 2. Install Dependencies (Already Done)

Dependencies sudah terinstall. Jika perlu re-install:

```bash
cd frontend
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Server will start di `http://localhost:3000`

---

## 🧪 Testing Wallet Integration

### Test 1: Connect Wallet

1. Open browser ke `http://localhost:3000`
2. Click button **"Connect Wallet"** di header
3. MetaMask popup will open
4. Select account dan click "Connect"
5. ✅ Address should appear di header: `0x1234...5678`

### Test 2: Network Switching

MetaMask might ask to switch ke Lisk Sepolia:
- **Chain ID**: 4202
- **RPC URL**: https://rpc.sepolia-api.lisk.com
- **Currency**: ETH

Jika network tidak ada, tambahkan manual:
1. MetaMask → Networks → Add Network
2. Input details di atas
3. Click "Save"

### Test 3: Disconnect

1. Click **"Disconnect"** button
2. ✅ Button should change back to "Connect Wallet"
3. ✅ Address disappeared

### Test 4: Auto-Reconnect

1. Connect wallet
2. Refresh page (F5)
3. ✅ Should auto-reconnect without popup
4. ✅ Address muncul lagi

---

## 🎮 What Works Now

### Working Features

✅ **Wallet Connection**
- Connect via MetaMask
- Disconnect
- Auto-reconnect on page refresh
- Address display

✅ **Blockchain Hooks Ready**
- Token balance reading
- Faucet status checking
- Bait inventory checking
- Staking info reading
- NFT balance reading

### UI Components Updated

- ✅ `app-header.tsx` - Wallet button + address display
- ✅ `providers.tsx` - Wagmi + QueryClient setup

---

## 📁 Project Structure

```
frontend/
├── lib/
│   ├── abis/              # Contract ABIs
│   ├── config/
│   │   ├── chains.ts      # Lisk Sepolia config
│   │   ├── contracts.ts   # Contract addresses
│   │   └── wagmi.ts       # Wagmi configuration
│   └── hooks/
│       └── useContracts.ts # 20+ blockchain hooks
├── components/
│   ├── providers.tsx      # Wagmi provider
│   └── app-header.tsx     # Wallet UI
└── .env.local             # Environment variables
```

---

## 🔌 Available Hooks

### Token Hooks
```typescript
const { data: balance } = useTokenBalance(address)
const { approve } = useTokenApprove()
const { data: allowance } = useTokenAllowance(owner, spender)
```

### Faucet Hooks
```typescript
const { claim } = useFaucetClaim()
const { data: canClaim } = useFaucetCanClaim(address)
const { data: nextClaim } = useFaucetNextClaimTime(address)
```

### Bait Shop Hooks
```typescript
const { data: inventory } = useBaitInventory(address, baitType)
const { data: price } = useBaitPrice(baitType)
const { buyBait } = useBuyBait()
```

### Staking Hooks
```typescript
const { data: stakeInfo } = useStakeInfo(address)
const { startFishing } = useStartFishing()
const { enterCasting } = useEnterCastingPhase()
const { enterStrike } = useEnterStrikePhase()
const { unstake } = useUnstake()
const { claimReward } = useClaimReward()
```

### NFT Hooks
```typescript
const { data: nftBalance } = useNFTBalance(address)
const { data: tokenIds } = useTokensOfOwner(address)
const { data: tokenURIs } = useTokenURIsOfOwner(address)
```

---

## 🐛 Troubleshooting

### Issue: "Connect Wallet" tidak muncul popup

**Solution:**
- Check MetaMask installed
- Check browser allows popups
- Try refresh page
- Check console untuk errors

### Issue: Network error atau wrong network

**Solution:**
- Switch ke Lisk Sepolia di MetaMask
- Add Lisk Sepolia manually (details di atas)
- Check RPC URL correct

### Issue: "No provider found"

**Solution:**
- Install MetaMask
- Refresh page after install
- Check MetaMask enabled di browser

### Issue: Page tidak load

**Solution:**
```bash
cd frontend
rm -rf .next
npm run dev
```

---

## 📝 Console Testing

Open browser console dan test hooks:

```javascript
// In browser console (after connecting wallet)
// Check if wagmi working
window.localStorage.getItem('wagmi.store')

// Should see: account, connector info
```

---

## ✅ Success Criteria

Fase 1 berhasil jika:

- [x] Wallet connect works
- [x] Address displayed correctly
- [x] Disconnect works
- [x] Auto-reconnect works
- [x] No console errors
- [x] Network switching works

---

## 🎯 Next: Fase 2

Setelah Fase 1 verified, ready untuk:

### Fase 2.1: Faucet Integration
Build UI untuk claim faucet tokens

### Fase 2.2: Bait Shop
Build UI untuk buy bait

### Fase 2.3: Fishing Flow
Implement complete fishing cycle dengan countdown timers

---

## 💡 Tips

1. **Use Chrome DevTools**: Network tab untuk check RPC calls
2. **MetaMask Dev Mode**: Untuk better debugging
3. **Console Logs**: Check untuk transaction hashes
4. **React Query DevTools**: Optional, untuk state debugging

---

## 📞 Contract Addresses (Lisk Sepolia)

```
Token:     0xB4Fc4A3e0057F87a91B9f2CF8F6dC7A93d00a335
NFT:       0xAF0DE0d61af37BfF41471681C6283D7339dF92b0
BaitShop:  0x7Aa02e9B84270f1403b7F9ec00728A332b8153b5
Faucet:    0x0f03a6B2cEb40E7C34f7501e883BCBD72659a51A
Staking:   0x803DC34D7E692691A41877553894aa3E14bFF226
```

Explorer: https://sepolia-blockscout.lisk.com/

---

## 🎉 Ready!

Fase 1 complete dan tested. Lanjut ke Fase 2 untuk gameplay implementation!

**Happy Coding! 🚀**

