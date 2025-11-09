# 🔧 Optimasi RPC Calls & NFT Generation Loop Fix

**Tanggal**: 8 November 2025  
**Status**: ✅ SELESAI

---

## 📊 MASALAH YANG DITEMUKAN

### 1. **Frontend - RPC Calls Berlebihan**

Dari analisis DevTools Network, ditemukan **30-40 RPC calls dalam 10 detik** karena polling yang terlalu agresif:

| Hook | Interval Lama | Frekuensi (10 detik) |
|------|---------------|----------------------|
| `useCastingTimeRemaining` | 1000ms | 10x |
| `useStrikeTimeRemaining` | 1000ms | 10x |
| `useStakeInfo` | 3000ms | 3x |
| `useTokenBalance` | 5000ms | 2x |
| `useTokenAllowance` | 5000ms | 2x |
| `useBaitInventory` | 5000ms | 2x |
| `useNFTBalance` | 10000ms | 1x |
| `useTokensOfOwner` | 10000ms | 1x |
| `useTokenURIsOfOwner` | 10000ms | 1x |

**Total: ~32 RPC calls per 10 detik** 🔥

### 2. **Backend - Duplicate Event Processing**

- Tidak ada persistent tracking untuk event yang sudah diproses
- Jika backend restart, bisa memproses event lama lagi
- "Generating NFT..." notifikasi muncul terus menerus
- Setiap event trigger multiple SSE messages

---

## ✅ SOLUSI YANG DIIMPLEMENTASIKAN

### **Frontend Optimizations** (`frontend/lib/hooks/useContracts.ts`)

#### Polling Intervals yang Diubah:

```typescript
// Token hooks (jarang berubah kecuali ada transaksi)
useTokenBalance: 5000ms → 30000ms (30 detik)
useTokenAllowance: 5000ms → 30000ms (30 detik)

// Faucet hooks (cooldown 24 jam, tidak perlu sering check)
useFaucetCanClaim: 10000ms → 60000ms (60 detik)
useFaucetNextClaimTime: 10000ms → 60000ms (60 detik)

// Bait inventory (hanya berubah saat beli/pakai)
useBaitInventory: 5000ms → 15000ms (15 detik)

// Staking hooks (penting, tapi tidak perlu 3 detik)
useStakeInfo: 3000ms → 10000ms (10 detik)

// Timer hooks (countdown bisa disimulate client-side)
useCastingTimeRemaining: 1000ms → 5000ms (5 detik)
useStrikeTimeRemaining: 1000ms → 5000ms (5 detik)

// NFT hooks (jarang berubah)
useNFTBalance: 10000ms → 30000ms (30 detik)
useTokensOfOwner: 10000ms → 30000ms (30 detik)
useTokenURIsOfOwner: 10000ms → 30000ms (30 detik)
```

#### Hasil:
**Dari ~32 calls menjadi ~8 calls per 10 detik** ✨ (pengurangan 75%!)

---

### **Backend Event Tracking System** 

#### 1. **New File: `backend/src/services/eventTracker.ts`**

Fitur:
- ✅ Persistent storage (JSON file) untuk tracking processed events
- ✅ Deduplication berdasarkan `user + timestamp + transactionHash`
- ✅ Auto-cleanup events lebih dari 7 hari
- ✅ Memory-efficient (hanya simpan 1000 events terakhir)
- ✅ Statistics & monitoring

```typescript
class EventTracker {
  - isProcessed(): Check if event already processed
  - markAsProcessed(): Mark event sebagai sudah diproses
  - cleanup(): Cleanup old events (> 7 hari)
  - getStats(): Get processing statistics
}
```

#### 2. **Updated: `backend/src/services/nftGenerator.ts`**

```typescript
// Double-check sebelum proses:
1. Check persistent storage (EventTracker)
2. Check in-memory Set (sedang diproses)
3. Process NFT generation
4. Mark sebagai processed di EventTracker
5. Save to disk
```

#### 3. **Updated: `backend/.gitignore`**

```
# Event tracking (persistent data)
processed_events.json
```

---

## 📈 IMPROVEMENT METRICS

### Before:
- 🔴 **RPC Calls**: ~32 calls per 10 detik
- 🔴 **Network Load**: Tinggi (banyak duplicate requests)
- 🔴 **Backend**: Bisa process event yang sama multiple kali
- 🔴 **User Experience**: Notifikasi "Generating NFT..." loop

### After:
- 🟢 **RPC Calls**: ~8 calls per 10 detik (↓ 75%)
- 🟢 **Network Load**: Rendah (optimal polling)
- 🟢 **Backend**: Event hanya diproses sekali (persistent tracking)
- 🟢 **User Experience**: Notifikasi muncul sekali per event

---

## 🧪 TESTING CHECKLIST

### Frontend Testing:
- [ ] Check DevTools Network tab - pastikan RPC calls berkurang
- [ ] Test timer countdown masih smooth (casting/strike)
- [ ] Test balance update setelah transaksi
- [ ] Test NFT collection refresh setelah mint

### Backend Testing:
- [ ] Test NFT generation hanya trigger sekali per event
- [ ] Test restart backend - tidak reprocess event lama
- [ ] Check `processed_events.json` file terbuat
- [ ] Test cleanup function (manual trigger)

### Integration Testing:
- [ ] Cast line → Catch fish → NFT generated → Notifikasi muncul 1x
- [ ] Restart backend → NFT tidak di-generate ulang
- [ ] Multiple users fishing simultaneously

---

## 🚀 CARA TESTING

### 1. Start Backend (Terminal 1):
```bash
cd backend
npm run dev
```

### 2. Start Frontend (Terminal 2):
```bash
cd frontend
npm run dev
```

### 3. Monitor RPC Calls:
- Buka DevTools → Network tab
- Filter: `rpc.sepolia-api.lisk.com`
- Observe frequency (seharusnya jauh lebih sedikit)

### 4. Test NFT Generation:
- Beli bait di shop
- Cast line & catch fish
- Observe SSE notification (seharusnya muncul 1x saja)
- Check backend logs untuk "Event already processed"

### 5. Test Backend Restart:
```bash
# Di terminal backend
Ctrl+C (stop)
npm run dev (start lagi)

# Backend seharusnya load processed events dari disk
# Tidak akan reprocess event yang sudah ada
```

---

## 📝 CATATAN TAMBAHAN

### Countdown Timer Client-Side
Untuk meningkatkan UX, bisa implementasi countdown timer di client-side:
```typescript
// Ambil initial time dari RPC (setiap 5 detik)
// Hitung countdown di client menggunakan setInterval
// Sync dengan RPC setiap 5 detik untuk akurasi
```

### Event-Based Updates (Future Enhancement)
Gunakan Wagmi `watchContractEvent` untuk real-time updates tanpa polling:
```typescript
watchContractEvent({
  address: CONTRACTS.FishItToken,
  abi: FishItTokenABI,
  eventName: 'Transfer',
  onLogs: (logs) => {
    // Update balance instantly
  }
})
```

---

## 🔍 FILE YANG DIUBAH

### Frontend:
- ✅ `frontend/lib/hooks/useContracts.ts` - Reduced polling intervals

### Backend:
- ✅ `backend/src/services/eventTracker.ts` - **NEW FILE**
- ✅ `backend/src/services/nftGenerator.ts` - Added event tracking
- ✅ `backend/.gitignore` - Ignore processed_events.json

### Documentation:
- ✅ `RPC_OPTIMIZATION_SUMMARY.md` - **THIS FILE**

---

## ✨ KESIMPULAN

Optimasi ini mengurangi:
- **75% RPC calls** (dari 32 → 8 per 10 detik)
- **100% duplicate NFT generation** (persistent tracking)
- **Network bandwidth** usage
- **Better user experience** (no looping notifications)

**Status**: ✅ Ready for testing

