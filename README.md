# 🎣 FishIt – Web3 Gamified Staking Platform

**FishIt** adalah platform **Web3 gamified staking** dengan tema memancing ikan.  
Pengguna melakukan staking token untuk mendapatkan kesempatan memancing ikan virtual.  
Setiap ikan yang berhasil ditangkap akan menghasilkan **token FISH (ERC-20)** dan **NFT ikan (ERC-721)** yang dibuat secara unik oleh **AI**.

FishIt mengubah aktivitas staking menjadi pengalaman yang **menyenangkan, interaktif, dan menguntungkan**.

---

## 🧭 Ringkasan

FishIt menghadirkan konsep *“Stake to Fish”*, di mana setiap aksi memancing dilakukan melalui mekanisme on-chain.  
Prosesnya melibatkan **staking token, memilih umpan, menunggu hasil tangkapan, dan mendapatkan NFT ikan unik** yang nilainya ditentukan oleh algoritma kelangkaan dan AI generator.

---

## 🎯 Tujuan Produk

- Menjadikan aktivitas staking lebih menarik dan mudah dipahami.
- Menggabungkan pengalaman **bermain + berinvestasi**.
- Meningkatkan loyalitas pengguna terhadap token **FISH**.
- Memperkenalkan konsep **Web3 dan NFT** secara menyenangkan.

---

## 🪣 Toko Umpan (*Bait Shop*)

Sebelum memancing, pengguna perlu **membeli atau memilih umpan** dengan membayar token FISH.  
Kualitas umpan memengaruhi peluang mendapatkan ikan dengan kelangkaan tertentu:

| Tipe Umpan | Multiplikator | Peluang Kelangkaan Lebih Tinggi |
|-------------|----------------|--------------------------------|
| Common      | 1.0x           | 🐟 Rendah                      |
| Rare        | 1.1x           | 🐠 Sedang                      |
| Epic        | 1.25x          | 🦑 Tinggi                      |
| Legendary   | 1.5x           | 🐉 Sangat Tinggi               |

---

## 🎮 Alur Permainan (Gameplay Flow)

1. **Chumming** – Pengguna melakukan staking token FISH.  
   > Semakin besar jumlah staking, semakin tinggi peluang menangkap ikan langka.

2. **Casting** – Pengguna melempar kail dan menunggu hasil tangkapan (*waiting phase*, ±1 menit).

3. **Strike** – Saat ikan menggigit umpan, pengguna harus bereaksi cepat dalam **30 detik**.  
   - ✅ Jika berhasil → Mendapat token FISH + NFT ikan unik.  
   - ❌ Jika gagal → Token dan umpan hilang (dibakar/minted ulang ke supply).

4. **Unstake** – Pengguna bisa melakukan unstake untuk menerima reward token dan NFT.

---

## 🎁 Sistem Hadiah (Reward System)

- **Token FISH (ERC-20)**  
  Hadiah utama hasil staking dan aktivitas memancing.

- **NFT Ikan (ERC-721)**  
  Setiap ikan yang tertangkap adalah **NFT unik** yang dibuat oleh AI Image Generator dan disimpan di **Pinata (IPFS)**.  
  NFT memiliki tingkat kelangkaan: *Common, Rare, Epic, Legendary.*

---

## 💎 Tokenomics & NFT

| Komponen | Standar | Deskripsi |
|-----------|-----------|-----------|
| **FISH Token** | ERC-20 | Digunakan untuk staking, membeli umpan, dan mengikuti event. |
| **Fish NFT** | ERC-721 | NFT gambar ikan hasil AI berdasarkan RNG & data staking. |
| **NFT Storage** | Pinata (IPFS) | Menyimpan metadata dan gambar NFT. |
| **AI Generator** | Gemini AI | Menghasilkan gambar & metadata NFT unik. |

---

## ⚙️ NFT Generation Method

1. **On-chain data input:**  
   Bait type & stake amount dikirim dari smart contract.

2. **Backend formula for rarity:**
   ```js
   const baitMul = { Common: 1, Rare: 1.1, Epic: 1.25, Legendary: 1.5 }[bait];
   const base = (r0 % 10000) / 10000;
   const mStake = 1 + 0.35 * Math.log10(Math.max(stake, 100) / 100);
   const score = Math.min(1, base * baitMul * mStake);
   ```

3. **AI generation (Gemini):**  
   Membuat metadata NFT (name, description, rarity, species) dengan placeholder image & external URL.

4. **Upload image ke Pinata (IPFS).**

5. **Update metadata** dengan URL gambar dan external link.

6. **Mint NFT via smart contract** menggunakan `ethers.js`.

7. **Tampilkan NFT dan reward** di frontend.

---

## 🧩 Master Game Flow

1. User membuka website.  
2. User menghubungkan wallet (**MetaMask / WalletConnect**).  
3. User mengklaim token faucet (10 FISH, *on-chain*).  
4. User dapat membeli umpan atau menunggu 1 hari untuk faucet ulang.  
5. Data pembelian disimpan *on-chain* (tanpa backend intervensi).  
6. User memilih umpan dari *on-chain bait bag* + jumlah stake.  
7. User menekan tombol **Cast** → proses menunggu 1 menit.  
8. Sistem masuk ke mode **Strike (30 detik)**.  
9. Jika berhasil → Dapat NFT + reward token.  
10. Backend mengambil metadata NFT dari smart contract → Frontend menampilkan hasil tangkapan.

---

## 💰 Model Pendapatan (Revenue Model)

| Sumber | Deskripsi | Estimasi Fee |
|--------|------------|---------------|
| **Fee Staking** | Potongan kecil dari hasil staking | 2–5% |
| **Marketplace Fee** | Biaya transaksi NFT ikan | 2–3% |
| **Event & Partnership** | Kerja sama lintas proyek token atau brand NFT | Variatif |

---

## 🧱 Teknologi

| Layer | Teknologi |
|--------|------------|
| **Blockchain** | Lisk Sepolia |
| **Smart Contract** | Solidity |
| **Token Standard** | ERC-20 (FISH Token), ERC-721 (Fish NFT) |
| **Backend & API** | Panna (middleware untuk staking & transaksi) |
| **NFT Storage** | Pinata (IPFS) |
| **AI Image Generator** | Gemini |
| **Frontend** | Next.js |
| **Wallet Integration** | MetaMask, WalletConnect |

---

## 📈 Indikator Keberhasilan

- Jumlah pengguna aktif harian.  
- Total token yang di-stake.  
- Jumlah NFT ikan yang dihasilkan & diperdagangkan.  
- Volume transaksi marketplace.  
- Jumlah kolaborasi event & partnership baru.

---

## 🧠 Nilai Bisnis (Business Value)

- Mengubah aktivitas staking pasif menjadi **game aktif dan menyenangkan**.  
- Meningkatkan **interaksi dan loyalitas** pengguna.  
- Memanfaatkan tren **AI + Web3** untuk menghasilkan konten unik.  
- Menarik minat **mitra dari industri kreatif dan blockchain gaming**.  
- Menjadi fondasi untuk ekosistem **staking-based game lainnya.**

---

## 🚀 Roadmap (High-Level)

| Fase | Fokus | Output |
|------|--------|--------|
| **Q1** | Smart contract & staking logic | ERC-20, ERC-721, RNG |
| **Q2** | NFT AI integration & Pinata | NFT generation pipeline |
| **Q3** | Gameplay + frontend integration | Web app (Next.js) |
| **Q4** | Marketplace & partnership | NFT trading, collaboration events |

---

## 🧩 License

MIT License © 2025 FishIt Project  
Developed with ❤️ by the FishIt team.
