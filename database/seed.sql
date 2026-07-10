-- =====================================================
-- KOPERASI POS SYSTEM - SEED DATA
-- =====================================================

-- =====================================================
-- 1. CHART OF ACCOUNTS (Daftar Akun)
-- =====================================================
INSERT INTO "ChartOfAccounts" ("accountCode", "accountName", "accountType", "normalBalance", "description") VALUES
-- ASET (1xxx)
('1010', 'Kas', 'asset', 'debit', 'Uang tunai di tangan'),
('1020', 'Bank', 'asset', 'debit', 'Saldo di bank'),
('1030', 'Piutang Anggota', 'asset', 'debit', 'Piutang dari anggota'),
('1050', 'Persediaan Barang', 'asset', 'debit', 'Stok barang dagang'),
('1100', 'Aset Tetap', 'asset', 'debit', 'Peralatan dan properti'),

-- KEWAJIBAN (2xxx)
('2010', 'Utang PPN', 'liability', 'credit', 'Utang pajak penjualan'),
('2020', 'Utang Supplier', 'liability', 'credit', 'Utang pembelian dari supplier'),
('2030', 'Utang Bunga', 'liability', 'credit', 'Utang bunga pinjaman'),

-- EKUITAS (3xxx)
('3010', 'Modal Koperasi', 'equity', 'credit', 'Modal awal koperasi'),
('3020', 'Laba Ditahan', 'equity', 'credit', 'Laba yang ditahan'),

-- PENDAPATAN (4xxx)
('4010', 'Pendapatan Penjualan', 'revenue', 'credit', 'Penjualan barang'),
('4020', 'Pendapatan Jasa', 'revenue', 'credit', 'Jasa koperasi'),
('4030', 'Potongan Penjualan', 'revenue', 'debit', 'Diskon dan potongan harga'),

-- BEBAN (6xxx)
('6010', 'Beban Gaji', 'expense', 'debit', 'Gaji karyawan'),
('6020', 'Beban Listrik', 'expense', 'debit', 'Biaya listrik'),
('6030', 'Beban Telepon', 'expense', 'debit', 'Biaya telekomunikasi'),
('6040', 'Beban Operasional', 'expense', 'debit', 'Biaya operasional lainnya'),
('6050', 'Beban Penyusutan', 'expense', 'debit', 'Penyusutan aset tetap'),
('6060', 'Beban HPP', 'expense', 'debit', 'Harga Pokok Penjualan');

-- =====================================================
-- 2. USERS (Admin & Kasir)
-- =====================================================
INSERT INTO "Users" ("id", "name", "email", "password", "role", "phone", "address", "isActive") VALUES
-- Password terenkripsi dengan bcrypt (password asli: admin123)
('550e8400-e29b-41d4-a716-446655440001', 'Admin Koperasi', 'admin@koperasi.local', '$2a$10$sHN6C0hG1cB1fLxEVzLPJeKRhZvP2N5mJ5F4Ke2R0FhKvJ8p9YqUC', 'admin', '+62812345678', 'Jl. Koperasi No. 1', true),
-- Password terenkripsi dengan bcrypt (password asli: kasir123)
('550e8400-e29b-41d4-a716-446655440002', 'Kasir 1 - Budi', 'kasir1@koperasi.local', '$2a$10$cxaJZ8EpCZLjGF8X9FkL5eLYjU9J2K7X6H5G4F3D2C1B0A9Z8Y7X', 'kasir', '+62812345679', 'Jl. Koperasi No. 2', true),
('550e8400-e29b-41d4-a716-446655440003', 'Kasir 2 - Siti', 'kasir2@koperasi.local', '$2a$10$cxaJZ8EpCZLjGF8X9FkL5eLYjU9J2K7X6H5G4F3D2C1B0A9Z8Y7X', 'kasir', '+62812345680', 'Jl. Koperasi No. 3', true);

-- =====================================================
-- 3. PRODUCTS (Barang Dagangan)
-- =====================================================
INSERT INTO "Products" ("sku", "barcode", "name", "description", "category", "priceCost", "priceRetail", "priceMember", "stock", "minimumStock", "isActive") VALUES
('SKU001', '8992830000001', 'Minyak Goreng 2L', 'Minyak goreng berkualitas tinggi', 'Minyak', 32000, 40000, 38000, 50, 10, true),
('SKU002', '8992830000002', 'Gula Pasir 1kg', 'Gula pasir putih premium', 'Gula', 9000, 12000, 11000, 100, 20, true),
('SKU003', '8992830000003', 'Beras 5kg', 'Beras putih premium', 'Beras', 65000, 80000, 77000, 30, 5, true),
('SKU004', '8992830000004', 'Telur Ayam (10pc)', 'Telur ayam segar', 'Telur', 35000, 45000, 42000, 40, 10, true),
('SKU005', '8992830000005', 'Susu Cair 1L', 'Susu cair segar berstandar', 'Susu', 15000, 22000, 20000, 60, 15, true),
('SKU006', '8992830000006', 'Roti Tawar', 'Roti tawar premium', 'Roti', 18000, 25000, 23000, 45, 10, true),
('SKU007', '8992830000007', 'Tepung Terigu 1kg', 'Tepung terigu berkualitas', 'Tepung', 9000, 12000, 11000, 80, 15, true),
('SKU008', '8992830000008', 'Garam Halus 500g', 'Garam halus kemasan', 'Garam', 3000, 5000, 4500, 150, 30, true),
('SKU009', '8992830000009', 'Kopi Bubuk 100g', 'Kopi bubuk premium', 'Kopi', 25000, 35000, 32000, 50, 10, true),
('SKU010', '8992830000010', 'Teh Celup (20 pack)', 'Teh celup premium', 'Teh', 12000, 18000, 16000, 70, 15, true);

-- =====================================================
-- 4. MEMBERS (Anggota Koperasi)
-- =====================================================
INSERT INTO "Members" ("memberNumber", "name", "email", "phone", "address", "memberType", "savings", "creditLimit", "isActive") VALUES
('ANG001', 'Sdr. Ahmad Wijaya', 'ahmad@email.com', '+62812345681', 'Jl. Merdeka No. 10', 'regular', 5000000, 2000000, true),
('ANG002', 'Ibu Ratna Sari', 'ratna@email.com', '+62812345682', 'Jl. Ahmad Yani No. 25', 'premium', 10000000, 5000000, true),
('ANG003', 'Sdr. Edi Kurniawan', 'edi@email.com', '+62812345683', 'Jl. Sudirman No. 5', 'regular', 3000000, 1000000, true),
('ANG004', 'Ibu Sinta Dewi', 'sinta@email.com', '+62812345684', 'Jl. Gajah Mada No. 15', 'premium', 8000000, 4000000, true),
('ANG005', 'Sdr. Bambang Haris', 'bambang@email.com', '+62812345685', 'Jl. Diponegoro No. 30', 'regular', 2500000, 800000, true);

-- =====================================================
-- 5. OPENING BALANCE - JURNAL AWAL
-- =====================================================
INSERT INTO "Journals" ("journalNumber", "referenceType", "description", "journalDate") VALUES
('JNL-OPENING-001', 'opening_balance', 'Opening Balance - Modal Awal', CURRENT_DATE);

INSERT INTO "JournalDetails" ("journalId", "accountCode", "debit", "credit", "description") 
SELECT id, '1010', 50000000, 0, 'Kas awal koperasi' FROM "Journals" WHERE "journalNumber" = 'JNL-OPENING-001';

INSERT INTO "JournalDetails" ("journalId", "accountCode", "debit", "credit", "description") 
SELECT id, '3010', 0, 50000000, 'Modal awal koperasi' FROM "Journals" WHERE "journalNumber" = 'JNL-OPENING-001';

-- =====================================================
-- 6. GENERAL LEDGER - INISIALISASI
-- =====================================================
INSERT INTO "GeneralLedgers" ("accountCode", "journalDetailId", "debit", "credit", "balance") 
SELECT '1010', id, 50000000, 0, 50000000 FROM "JournalDetails" WHERE "accountCode" = '1010';

INSERT INTO "GeneralLedgers" ("accountCode", "journalDetailId", "debit", "credit", "balance") 
SELECT '3010', id, 0, 50000000, -50000000 FROM "JournalDetails" WHERE "accountCode" = '3010';

COMMIT;
