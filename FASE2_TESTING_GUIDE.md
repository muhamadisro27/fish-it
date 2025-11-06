# 🧪 FASE 2 - Testing Guide

**Quick reference untuk test semua fitur Fase 2**

---

## 🚀 Setup (One-time)

### 1. Environment Setup
```bash
cd frontend
cp env.example .env.local
```

Edit `.env.local`:
```bash
NEXT_PUBLIC_CHAIN_RPC=https://rpc.sepolia-api.lisk.com
NEXT_PUBLIC_CHAIN_ID=4202
NEXT_PUBLIC_CHAIN_NAME=Lisk Sepolia

# Contract Addresses (Already deployed)
NEXT_PUBLIC_FSHT_TOKEN_ADDRESS=0xB4Fc4A3e0057F87a91B9f2CF8F6dC7A93d00a335
NEXT_PUBLIC_NFT_ADDRESS=0xAF0DE0d61af37BfF41471681C6283D7339dF92b0
NEXT_PUBLIC_BAITSHOP_ADDRESS=0x7Aa02e9B84270f1403b7F9ec00728A332b8153b5
NEXT_PUBLIC_FAUCET_ADDRESS=0x0f03a6B2cEb40E7C34f7501e883BCBD72659a51A
NEXT_PUBLIC_STAKING_ADDRESS=0x803DC34D7E692691A41877553894aa3E14bFF226

# Optional (untuk WalletConnect support)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### 2. Start Development Server
```bash
npm run dev
```

Open: http://localhost:3000

### 3. MetaMask Setup
- Add Lisk Sepolia network
- Get test ETH from faucet
- Connect wallet to app

---

## ✅ Test Checklist

### Test 1: Wallet Connection (30 seconds)

**Steps**:
1. Click "Connect Wallet"
2. Approve in MetaMask
3. See wallet address displayed
4. Check sidebar shows "0.00 FSHT"

**Expected**:
✅ Address shows as `0x1234...5678`  
✅ Balance displays  
✅ Faucet card appears  
✅ No console errors

---

### Test 2: Faucet Claim (1 minute)

**Steps**:
1. Find "Free FSHT Faucet" card (top of sidebar)
2. Should show "🎁 Claim 10 FSHT" button
3. Click button
4. Approve transaction in MetaMask
5. Wait for confirmation (5-10s)
6. Check "FSHT Balance" updates to 10.00

**Expected**:
✅ Button shows loading spinner  
✅ Toast notification appears  
✅ Balance updates to 10.00 FSHT  
✅ Button changes to countdown timer  

**Note**: After first claim, must wait 24 hours for next claim.

---

### Test 3: Buy Bait (2 minutes)

**Steps**:
1. Scroll to "Bait Shop" card
2. Click "Buy" on "Common Bait" (10 FSHT)
3. Modal opens
4. Keep quantity as "1"
5. Click "Approve FSHT" (first time only)
6. Approve in MetaMask
7. Wait for approval confirmation
8. Click "Buy Bait"
9. Approve in MetaMask
10. Wait for confirmation
11. Modal closes
12. Check "Owned" count increases to 1

**Expected**:
✅ Modal shows price (10 FSHT)  
✅ Approval transaction succeeds  
✅ Buy transaction succeeds  
✅ Inventory updates immediately  
✅ Toast notifications appear  

**Tip**: Approval only needed once per contract!

---

### Test 4: Complete Fishing Flow (2 minutes)

#### Phase 1: Start Fishing
**Steps**:
1. Click "Cast Line" button (main area, or any cast button)
2. Fishing modal opens
3. Select bait type (e.g., Common - should show "Owned: 1")
4. Enter stake amount: `1` (minimum)
5. If first time, click "Approve FSHT"
6. Approve in MetaMask
7. Click "🎣 Start Fishing"
8. Approve in MetaMask

**Expected**:
✅ Bait selection works  
✅ Stake validation shows  
✅ Approval succeeds  
✅ Transaction succeeds  
✅ Modal shows "Preparing..."  

#### Phase 2: Casting (60 seconds)
**What happens**:
- Modal auto-updates to "Line Cast!"
- Shows 🎣 emoji (bouncing)
- Countdown from 60 to 0
- Progress bar fills up

**Expected**:
✅ Countdown updates every second  
✅ Progress bar animates  
✅ No errors in console  

**Important**: 
- ⚠️ DON'T close modal
- ⚠️ DON'T navigate away
- ⚠️ Wait for Strike phase!

#### Phase 3: Strike (30 seconds)
**What happens**:
- Modal changes to red/orange theme
- Shows ⚡ emoji (pulsing)
- Text: "STRIKE NOW!"
- Big pulsing button appears
- Countdown from 30 to 0

**Steps**:
1. **QUICKLY** click "⚡ UNSTAKE NOW! ⚡"
2. Approve in MetaMask
3. Wait for confirmation

**Expected**:
✅ UI is urgent (red, pulsing)  
✅ Countdown is fast  
✅ Button is prominent  

**Critical**: Must unstake within 30 seconds or fish escapes!

#### Phase 4: Result
**Success Scenario** (if unstaked within 30s):
- Shows 🏆 trophy icon
- Text: "Fish Caught! 🎉"
- Message: "Your NFT is being generated..."
- "Awesome!" button

**Fail Scenario** (if too slow):
- Shows ❌ icon
- Text: "Fish Escaped! 😢"
- Message: "You were too slow..."
- "Try Again" button

**Expected**:
✅ Correct result based on timing  
✅ Toast notification  
✅ Modal shows appropriate message  

---

### Test 5: NFT Claim (1 minute)

**Note**: This only works if you successfully caught a fish!

**Steps**:
1. Close fishing modal
2. Look for "NFT Ready!" card (golden, pulsing)
3. Should appear at top of sidebar
4. Click "🎁 Claim NFT Now!"
5. Approve in MetaMask
6. Wait for confirmation

**Expected**:
✅ Golden pulsing card appears  
✅ Claim transaction succeeds  
✅ Card disappears after claim  
✅ Toast notification  

**Note**: Actual NFT image generation requires Fase 3 backend!

---

## 🐛 Troubleshooting

### Problem: "No bait available!"
**Solution**: Buy bait from Bait Shop first

### Problem: "Cannot Claim Yet" (Faucet)
**Solution**: Wait 24 hours from last claim

### Problem: "Minimum Stake" error
**Solution**: Enter at least 1 FSHT

### Problem: Transaction fails
**Solutions**:
- Check you have enough gas (ETH)
- Check you have enough FSHT
- Try increasing gas limit in MetaMask

### Problem: Countdown not updating
**Solutions**:
- Don't navigate away during fishing
- Keep tab active
- Refresh page and try again

### Problem: Modal stuck on "Preparing..."
**Solutions**:
- Check transaction in MetaMask
- If failed, close and try again
- Check contract state on blockchain explorer

---

## 📊 Test Scenarios

### Scenario A: Full Happy Path (5 min)
```
Connect Wallet → Claim Faucet → Buy Bait → 
Fish → Strike in time → Success → Claim NFT ✅
```

### Scenario B: Fishing Fail Path (2 min)
```
Start Fishing → Wait during Strike phase → 
Miss 30s window → Fish Escapes ❌
```

### Scenario C: Multiple Baits (3 min)
```
Buy Common Bait → Buy Rare Bait → 
Fish with Common → Fish with Rare → 
Compare results
```

### Scenario D: Edge Cases (5 min)
```
Try fishing with 0 bait (should fail) →
Try staking < 1 FSHT (should fail) →
Try claiming faucet twice (should show countdown) →
Try buying bait without approval (should show approve button)
```

---

## 🎯 Performance Checks

### What to Monitor:

✅ **Transaction Speed**: Should confirm in 5-15 seconds  
✅ **UI Updates**: Balance/inventory should update within 5 seconds  
✅ **Countdown Accuracy**: Timers should be accurate (±1s)  
✅ **Loading States**: All buttons should show loading during tx  
✅ **Error Handling**: Failed tx should show error toast  
✅ **Memory**: No memory leaks during multiple fishing sessions  

---

## 📸 Screenshots Checklist

Document these screens for reference:

- [ ] Faucet card before claim
- [ ] Faucet card during claim (loading)
- [ ] Faucet card after claim (countdown)
- [ ] Bait Shop with inventory
- [ ] Buy Bait modal (approve step)
- [ ] Buy Bait modal (buy step)
- [ ] Fishing modal - Select phase
- [ ] Fishing modal - Casting phase
- [ ] Fishing modal - Strike phase
- [ ] Fishing modal - Success result
- [ ] Fishing modal - Failed result
- [ ] NFT Ready card

---

## 🎮 Advanced Testing

### Test Auto-Refetch (2 min)
1. Open app in 2 browser tabs
2. Claim faucet in tab 1
3. Watch balance update in tab 2
4. Should update within 5 seconds

### Test Page Refresh (1 min)
1. Start fishing
2. During Casting phase, refresh page
3. Should resume from correct phase
4. Countdown should be accurate

### Test Network Switch (1 min)
1. Connect to app
2. Switch network in MetaMask
3. Should detect and show warning
4. Switch back to Lisk Sepolia
5. Should resume normally

---

## ✅ Final Checklist

Before reporting Fase 2 as tested:

- [ ] Wallet connection works
- [ ] Faucet claim succeeds
- [ ] Faucet countdown shows correctly
- [ ] All 4 bait types can be purchased
- [ ] Bait inventory updates correctly
- [ ] Token approval works
- [ ] Fishing start succeeds
- [ ] Casting countdown works (60s)
- [ ] Strike countdown works (30s)
- [ ] Success result shows correctly
- [ ] Fail result shows correctly
- [ ] NFT claim works (if NFT ready)
- [ ] All toast notifications appear
- [ ] No console errors
- [ ] Loading states work on all buttons
- [ ] UI is responsive

---

## 🎊 Success Criteria

**Fase 2 is considered fully functional if:**

✅ All transactions succeed without errors  
✅ All timers countdown accurately  
✅ UI responds to blockchain state  
✅ Notifications appear at correct times  
✅ State persists across page refreshes  
✅ Multiple fishing sessions work  
✅ Edge cases are handled gracefully  

---

*Happy Testing! 🎣*

*Last Updated: 2025-01-27*

