# 🔧 Environment Setup Guide

## Quick Setup (Recommended)

MetaMask akan bekerja tanpa setup tambahan! Cukup:

```bash
npm run dev
```

Lalu connect dengan MetaMask di browser.

---

## Optional: WalletConnect Support

Jika ingin support WalletConnect (untuk mobile wallets), follow steps ini:

### 1. Create `.env.local` file

```bash
# From frontend directory
cp .env.example .env.local
```

### 2. Get WalletConnect Project ID

1. Visit: https://cloud.walletconnect.com/
2. Sign up (free)
3. Create new project
4. Copy Project ID

### 3. Update `.env.local`

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_actual_project_id
```

### 4. Restart Dev Server

```bash
npm run dev
```

---

## What You'll See

### Without WalletConnect ID (Default)
- ✅ MetaMask connection works
- ✅ No warnings about WalletConnect
- ✅ Faster startup
- ❌ No mobile wallet support

### With WalletConnect ID
- ✅ MetaMask connection works
- ✅ Mobile wallet support (Trust Wallet, Rainbow, etc)
- ✅ QR code scanning
- ⚠️ Slightly slower initialization

---

## Troubleshooting

### Error: "Failed to fetch remote project configuration"

**This is OKAY!** It means:
- WalletConnect is disabled (no valid project ID)
- MetaMask will still work perfectly
- This is the recommended setup for development

**To fix (if you want WalletConnect):**
1. Get valid project ID from https://cloud.walletconnect.com/
2. Add to `.env.local`
3. Restart dev server

### Warning: "WalletConnect Core is already initialized"

**This is NORMAL in development!** It's caused by:
- React Strict Mode (development only)
- Will not appear in production build

**To silence it:** Already fixed in code, ignore the warning.

### Warning: "Multiple versions of Lit loaded"

**This is HARMLESS!** It's from dependencies. Ignore it.

---

## Default Configuration (Already Set)

These are pre-configured and DON'T need to be changed:

```env
# Network
NEXT_PUBLIC_CHAIN_RPC=https://rpc.sepolia-api.lisk.com
NEXT_PUBLIC_CHAIN_ID=4202

# Contract Addresses (Lisk Sepolia)
NEXT_PUBLIC_FSHT_TOKEN_ADDRESS=0xB4Fc4A3e0057F87a91B9f2CF8F6dC7A93d00a335
NEXT_PUBLIC_NFT_ADDRESS=0xAF0DE0d61af37BfF41471681C6283D7339dF92b0
NEXT_PUBLIC_BAITSHOP_ADDRESS=0x7Aa02e9B84270f1403b7F9ec00728A332b8153b5
NEXT_PUBLIC_FAUCET_ADDRESS=0x0f03a6B2cEb40E7C34f7501e883BCBD72659a51A
NEXT_PUBLIC_STAKING_ADDRESS=0x803DC34D7E692691A41877553894aa3E14bFF226
```

---

## Summary

**For Development (Recommended):**
```bash
# Just run it! No .env.local needed
npm run dev
```

**For Production / Mobile Support:**
```bash
# Create .env.local with WalletConnect ID
cp .env.example .env.local
# Edit .env.local
npm run dev
```

**Current Status: ✅ Working with MetaMask only**

