# 💼 Business Logic - Koperasi POS System

## 1. Harga Produk & Pricing Strategy

### Price Layers
```
Product {
  priceCost:     32000  (Harga pokok/beli dari supplier)
  priceRetail:   40000  (Harga untuk non-anggota)
  priceMember:   38000  (Harga spesial untuk anggota koperasi)
}
```

### Logic di POS
```javascript
if (isMemberPurchase) {
  hargaSatuan = product.priceMember;  // Diskon otomatis
} else {
  hargaSatuan = product.priceRetail;  // Harga normal
}

subtotal = hargaSatuan × quantity;
```

**Contoh:**
- Anggota beli 1 item: 38,000 (hemat 2,000)
- Non-anggota beli 1 item: 40,000

---

## 2. Diskon & Promosi

### Jenis Diskon

**A. Diskon Manual (Kasir Input)**
```
Diskon Persentase: Subtotal × (discount% / 100)
Diskon Nominal: Rp. 5.000 (fixed amount)
```

**B. Diskon Otomatis (Grosir)**
```
Jika quantity >= 5 item:
  Diskon = Subtotal × 5%
Jika quantity >= 10 item:
  Diskon = Subtotal × 10%
Jika quantity >= 20 item:
  Diskon = Subtotal × 15%
```

**C. Diskon Member (Sudah otomatis di harga)**

### Perhitungan Total
```
Subtotal          = Σ(quantity × hargaSatuan)
Diskon            = (manual input) atau (auto calculation)
Taxable Amount    = Subtotal - Diskon
Pajak (PPN 10%)   = Taxable Amount × 10%
TOTAL AKHIR       = Taxable Amount + Pajak
```

**Contoh Transaksi:**
```
Item 1: Minyak Goreng 2L × 2 = 80,000 (member price)
Item 2: Gula Pasir 1kg × 1   = 11,000 (member price)
───────────────────────────────────────
Subtotal                        = 91,000
Diskon Manual                   = 1,000
Taxable Amount                  = 90,000
Pajak PPN (10%)                = 9,000
───────────────────────────────────────
TOTAL PEMBAYARAN                = 99,000
```

---

## 3. Metode Pembayaran

### 1. Tunai (Cash)
```
User bayar cash → Sistem hitung kembalian otomatis
Kembalian = (uang diterima) - (total bayar)

Contoh:
  Total Bayar: 99,000
  Uang Diterima: 100,000
  Kembalian: 1,000 ✓
```

### 2. QRIS / E-Wallet
```
User scan QRIS → Verifikasi pembayaran
Status: Pending → Completed (auto)
```

### 3. Debit / Kredit
```
User input nomor kartu → Proses pembayaran
Status: Pending → Completed (manual verify)
```

### 4. Potong Simpanan (Member Only)
```
Bersyarat:
  - Member aktif terdaftar
  - Saldo simpanan >= total transaksi
  
Proses:
  - Verifikasi saldo member
  - Debit saldo simpanan member
  - Kredit kas koperasi
  - Update mutasi member

Contoh:
  Member A punya simpanan: Rp 500,000
  Total transaksi: Rp 99,000
  ✓ Bisa potong simpanan
  
  Saldo baru = 500,000 - 99,000 = 401,000
```

### 5. Cicilan / Potong Gaji (Member Premium)
```
Bersyarat:
  - Member Premium
  - Credit limit > total transaksi
  
Proses:
  - Cek credit limit available
  - Update piutang member
  - Buat jurnal piutang
  - Jadwal pembayaran otomatis (potong gaji)
```

---

## 4. Otomasi Akuntansi (Double-Entry Bookkeeping)

### Jurnal Otomatis untuk Setiap Penjualan

**Transaksi Penjualan Tunai:**
```
Debit: 1010 (Kas)                           99,000
  Kredit: 4010 (Pendapatan Penjualan)                 90,000
  Kredit: 2010 (Utang PPN)                             9,000
```

**Transaksi Penjualan Kredit (Member):**
```
Debit: 1030 (Piutang Anggota)               99,000
  Kredit: 4010 (Pendapatan Penjualan)                 90,000
  Kredit: 2010 (Utang PPN)                             9,000
```

**Jurnal Untuk HPP (Harga Pokok Penjualan):**
```
Debit: 6060 (Beban HPP)                     64,000
  Kredit: 1050 (Persediaan Barang)                    64,000
```

*Catatan: HPP = Σ(quantity × priceCost) untuk produk yang terjual*

### Contoh Jurnal Kompleks

**Transaksi:**
- Minyak Goreng (cost 32,000) × 2 → harga jual 80,000
- Gula Pasir (cost 9,000) × 1 → harga jual 11,000
- Total: 91,000, Pajak: 9,100, TOTAL: 100,100
- Pembayaran: Potong Simpanan

**Journal Entry:**
```
Debit: 1030 (Piutang Anggota)               100,100
  Kredit: 4010 (Pendapatan Penjualan)                 91,000
  Kredit: 2010 (Utang PPN)                             9,100

Debit: 6060 (Beban HPP)                     73,000
  Kredit: 1050 (Persediaan Barang)                    73,000

Debit: 1010 (Kas)                           100,100
  Kredit: 1030 (Piutang Anggota)                     100,100
```

### Void/Refund Transaction

**Jika transaksi di-void:**
```
Jurnal Reversal (Balik semua entry):

Debit: 4010 (Pendapatan Penjualan)          91,000
Debit: 2010 (Utang PPN)                      9,100
  Kredit: 1010 (Kas)                                 100,100

Debit: 1050 (Persediaan Barang)             73,000
  Kredit: 6060 (Beban HPP)                           73,000
```

---

## 5. Manajemen Stok

### Stock Update Otomatis
```
Saat Transaksi:
  stock_sebelum = 50
  - quantity_terjual = 2
  ──────────────────
  stock_sesudah = 48 ✓ (otomatis update)
```

### Low Stock Alert
```
Jika stock <= minimumStock:
  Trigger Alert ke Admin
  
Contoh:
  Produk: Minyak Goreng
  Stock: 8 item
  Minimum Stock: 10
  ⚠️ ALERT: Stok rendah! (8 ≤ 10)
```

### Stock Opname (Pencatatan Fisik)
```
Proses:
  1. Admin input stok fisik setiap produk
  2. Sistem compare: stok_sistem vs stok_fisik
  3. Buat laporan selisih
  4. Adjust dengan jurnal koreksi:
     
     Jika lebih:
     Debit: 1050 (Persediaan)      500
       Kredit: 6040 (Beban Operasional) 500
     
     Jika kurang:
     Debit: 6040 (Beban Operasional)    500
       Kredit: 1050 (Persediaan)        500
```

---

## 6. Laporan Keuangan

### A. Laporan Penjualan (Sales Report)
```
Periode: 1-31 Januari 2024

Produk          | Qty | Harga Unit | Subtotal | HPP    | Margin
─────────────────────────────────────────────────────────────────
Minyak Goreng   | 150 | 40,000     | 6,000,000| 4,800,000| 1,200,000
Gula Pasir      | 200 | 12,000     | 2,400,000| 1,800,000| 600,000
Beras           | 100 | 80,000     | 8,000,000| 6,500,000| 1,500,000
─────────────────────────────────────────────────────────────────
TOTAL           |     |            |16,400,000|13,100,000| 3,300,000

Trend:
  ✓ Top 3 Produk Terlaris (Fast Moving)
  ✓ Penjualan per Kasir
  ✓ Performa per Shift
```

### B. Laporan Laba-Rugi (P&L Statement)
```
PERIODE: JANUARI 2024

PENDAPATAN:
  Pendapatan Penjualan           Rp 16,400,000
  Diskon Penjualan              (Rp    200,000)
  ───────────────────────────────────────────
  Pendapatan Bersih             Rp 16,200,000

HARGA POKOK PENJUALAN:
  Persediaan Awal               Rp  5,000,000
  Pembelian                     +Rp 10,000,000
  ───────────────────────────────────────────
  Tersedia untuk Dijual         Rp 15,000,000
  Persediaan Akhir              -Rp  1,900,000
  ───────────────────────────────────────────
  HPP                           (Rp 13,100,000)
  ───────────────────────────────────────────
  LABA KOTOR                    Rp  3,100,000

BEBAN OPERASIONAL:
  Beban Gaji Karyawan           (Rp  2,000,000)
  Beban Listrik                 (Rp    300,000)
  Beban Operasional Lain        (Rp    200,000)
  ───────────────────────────────────────────
  Total Beban                   (Rp  2,500,000)
  ───────────────────────────────────────────
LABA BERSIH                      Rp    600,000
```

### C. Laporan Neraca (Balance Sheet)
```
POSISI: 31 JANUARI 2024

AKTIVA (Aset):
  ASET LANCAR:
    Kas                         Rp 50,000,000
    Bank                        Rp 25,000,000
    Piutang Anggota             Rp  5,000,000
    Persediaan Barang           Rp  1,900,000
    ─────────────────────────────────────────
    Total Aset Lancar           Rp 81,900,000
  
  ASET TETAP:
    Peralatan Kasir             Rp 10,000,000
    Furniture                   Rp  5,000,000
    ─────────────────────────────────────────
    Total Aset Tetap            Rp 15,000,000
  ─────────────────────────────────────────
  TOTAL AKTIVA                  Rp 96,900,000

KEWAJIBAN (Utang):
  KEWAJIBAN JANGKA PENDEK:
    Utang PPN                   Rp  2,300,000
    Utang Supplier              Rp  5,000,000
    ─────────────────────────────────────────
    Total Kewajiban             Rp  7,300,000

EKUITAS (Modal):
  Modal Awal                    Rp 50,000,000
  Laba Ditahan                  Rp 39,600,000
  ─────────────────────────────────────────
  Total Ekuitas                 Rp 89,600,000
  ─────────────────────────────────────────
TOTAL KEWAJIBAN + EKUITAS       Rp 96,900,000

✓ Persamaan Akuntansi: Aset = Utang + Ekuitas ✓
```

### D. Laporan SHU (Sisa Hasil Usaha)
```
PERIODE: TAHUN 2024

TOTAL LABA BERSIH TAHUN INI    Rp 50,000,000

ALOKASI SHU:
  1. Dana Cadangan (20%)        Rp 10,000,000
  2. Jasa Modal (15%)           Rp  7,500,000
     Pembagian berdasarkan:
     = (Simpanan Anggota / Total Simpanan) × Dana
  
  3. Jasa Usaha (40%)           Rp 20,000,000
     Pembagian berdasarkan:
     = (Belanja Anggota / Total Belanja) × Dana
  
  4. Dana Khusus (15%)          Rp  7,500,000
     Untuk kesejahteraan anggota
  
  5. Dana Operasional (10%)     Rp  5,000,000
     Untuk operasional koperasi

CONTOH PEMBAGIAN UNTUK SATU ANGGOTA:
  Member A memiliki:
    • Simpanan: Rp 1,000,000 (dari total Rp 50,000,000)
    • Belanja: Rp 500,000 (dari total Rp 100,000,000)
  
  SHU Jasa Modal:
    = (1,000,000 / 50,000,000) × 7,500,000 = 150,000
  
  SHU Jasa Usaha:
    = (500,000 / 100,000,000) × 20,000,000 = 100,000
  
  Total SHU Member A = 150,000 + 100,000 = Rp 250,000
```

---

## 7. Shift Management

### Shift Opening
```
Kasir login & buka shift:
  1. Masukkan saldo awal kas (opening balance)
  2. Sistem catat waktu shift mulai
  3. Status: OPEN
  4. Stok awal tercatat

Contoh:
  Shift Date: 10 Januari 2024
  Opening Balance: Rp 1,000,000
  Start Time: 08:00
  Kasir: Budi
```

### Shift Closing
```
Kasir tutup shift (akhir hari):
  1. Input saldo akhir (closing balance)
  2. Sistem hitung: closing - opening = variance
  3. Jika variance ≠ 0: Alert admin
  4. Sistem generate Shift Report
  5. Status: CLOSED

Contoh:
  Opening Balance: Rp 1,000,000
  Closing Balance: Rp 1,950,000
  Total Penjualan Hari Ini: Rp 950,000 (dari transaksi tunai)
  Variance: Rp 0 ✓ (Match!)
```

### Shift Report
```
SHIFT REPORT - 10 JANUARI 2024
Kasir: BUDI

Opening Balance:     Rp 1,000,000
Total Cash In:       Rp 3,200,000
Total Cash Out:      Rp 2,500,000
───────────────────────────────────
Cash Expected:       Rp 1,700,000
Cash Actual:         Rp 1,700,000
───────────────────────────────────
Variance:            Rp 0 ✓

Transactions Today:  45 transaksi
Total Revenue:       Rp 3,200,000
Average Transaction: Rp 71,111
```

---

**Business Logic Documentation Complete!** 💼
