-- =====================================================
-- KOPERASI POS SYSTEM - DATABASE SCHEMA
-- =====================================================

-- =====================================================
-- 1. USERS TABLE (Kasir & Admin)
-- =====================================================
CREATE TABLE IF NOT EXISTS "Users" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "password" VARCHAR(255) NOT NULL,
  "role" VARCHAR(50) NOT NULL CHECK ("role" IN ('kasir', 'admin')),
  "phone" VARCHAR(20),
  "address" TEXT,
  "isActive" BOOLEAN DEFAULT true,
  "lastLogin" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON "Users"("email");
CREATE INDEX idx_users_role ON "Users"("role");

-- =====================================================
-- 2. PRODUCTS TABLE (Inventori)
-- =====================================================
CREATE TABLE IF NOT EXISTS "Products" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "sku" VARCHAR(100) NOT NULL UNIQUE,
  "barcode" VARCHAR(100) UNIQUE,
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "category" VARCHAR(100),
  "priceCost" DECIMAL(12, 2) NOT NULL,
  "priceRetail" DECIMAL(12, 2) NOT NULL,
  "priceMember" DECIMAL(12, 2) NOT NULL,
  "stock" INTEGER DEFAULT 0,
  "minimumStock" INTEGER DEFAULT 10,
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_sku ON "Products"("sku");
CREATE INDEX idx_products_barcode ON "Products"("barcode");
CREATE INDEX idx_products_category ON "Products"("category");

-- =====================================================
-- 3. MEMBERS TABLE (Anggota Koperasi)
-- =====================================================
CREATE TABLE IF NOT EXISTS "Members" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "memberNumber" VARCHAR(50) NOT NULL UNIQUE,
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255),
  "phone" VARCHAR(20),
  "address" TEXT,
  "memberType" VARCHAR(50) CHECK ("memberType" IN ('regular', 'premium')),
  "savings" DECIMAL(14, 2) DEFAULT 0,
  "creditLimit" DECIMAL(14, 2) DEFAULT 0,
  "isActive" BOOLEAN DEFAULT true,
  "joinDate" DATE DEFAULT CURRENT_DATE,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_members_number ON "Members"("memberNumber");
CREATE INDEX idx_members_email ON "Members"("email");

-- =====================================================
-- 4. TRANSACTIONS TABLE (Penjualan)
-- =====================================================
CREATE TABLE IF NOT EXISTS "Transactions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "transactionNumber" VARCHAR(100) NOT NULL UNIQUE,
  "userId" UUID NOT NULL REFERENCES "Users"("id"),
  "memberId" UUID REFERENCES "Members"("id"),
  "subtotal" DECIMAL(14, 2) DEFAULT 0,
  "discount" DECIMAL(14, 2) DEFAULT 0,
  "tax" DECIMAL(14, 2) DEFAULT 0,
  "total" DECIMAL(14, 2) NOT NULL,
  "paymentMethod" VARCHAR(50) CHECK ("paymentMethod" IN ('cash', 'qris', 'debit', 'credit', 'potong_simpanan')),
  "paymentStatus" VARCHAR(50) CHECK ("paymentStatus" IN ('pending', 'completed', 'cancelled')),
  "notes" TEXT,
  "isVoid" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_number ON "Transactions"("transactionNumber");
CREATE INDEX idx_transactions_user ON "Transactions"("userId");
CREATE INDEX idx_transactions_member ON "Transactions"("memberId");
CREATE INDEX idx_transactions_date ON "Transactions"("createdAt");

-- =====================================================
-- 5. TRANSACTION ITEMS TABLE (Detail Penjualan)
-- =====================================================
CREATE TABLE IF NOT EXISTS "TransactionItems" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "transactionId" UUID NOT NULL REFERENCES "Transactions"("id") ON DELETE CASCADE,
  "productId" UUID NOT NULL REFERENCES "Products"("id"),
  "quantity" INTEGER NOT NULL,
  "price" DECIMAL(12, 2) NOT NULL,
  "subtotal" DECIMAL(14, 2) NOT NULL,
  "discount" DECIMAL(14, 2) DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transaction_items_transaction ON "TransactionItems"("transactionId");
CREATE INDEX idx_transaction_items_product ON "TransactionItems"("productId");

-- =====================================================
-- 6. CHART OF ACCOUNTS (COA) - Daftar Akun
-- =====================================================
CREATE TABLE IF NOT EXISTS "ChartOfAccounts" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "accountCode" VARCHAR(20) NOT NULL UNIQUE,
  "accountName" VARCHAR(255) NOT NULL,
  "accountType" VARCHAR(50) NOT NULL CHECK ("accountType" IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
  "parentCode" VARCHAR(20),
  "description" TEXT,
  "normalBalance" VARCHAR(10) CHECK ("normalBalance" IN ('debit', 'credit')),
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_coa_code ON "ChartOfAccounts"("accountCode");
CREATE INDEX idx_coa_type ON "ChartOfAccounts"("accountType");

-- =====================================================
-- 7. JOURNALS TABLE (Jurnal Umum)
-- =====================================================
CREATE TABLE IF NOT EXISTS "Journals" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "journalNumber" VARCHAR(100) NOT NULL UNIQUE,
  "referenceType" VARCHAR(50) CHECK ("referenceType" IN ('transaction', 'expense', 'adjustment', 'opening_balance')),
  "referenceId" UUID,
  "description" TEXT,
  "journalDate" DATE DEFAULT CURRENT_DATE,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_journals_number ON "Journals"("journalNumber");
CREATE INDEX idx_journals_date ON "Journals"("journalDate");

-- =====================================================
-- 8. JOURNAL DETAILS TABLE (Detail Jurnal)
-- =====================================================
CREATE TABLE IF NOT EXISTS "JournalDetails" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "journalId" UUID NOT NULL REFERENCES "Journals"("id") ON DELETE CASCADE,
  "accountCode" VARCHAR(20) NOT NULL REFERENCES "ChartOfAccounts"("accountCode"),
  "debit" DECIMAL(14, 2) DEFAULT 0,
  "credit" DECIMAL(14, 2) DEFAULT 0,
  "description" TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_journal_details_journal ON "JournalDetails"("journalId");
CREATE INDEX idx_journal_details_account ON "JournalDetails"("accountCode");

-- =====================================================
-- 9. SHIFT MANAGEMENT (Shift Kasir)
-- =====================================================
CREATE TABLE IF NOT EXISTS "Shifts" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "shiftNumber" VARCHAR(50) NOT NULL UNIQUE,
  "userId" UUID NOT NULL REFERENCES "Users"("id"),
  "shiftDate" DATE NOT NULL,
  "startTime" TIMESTAMP NOT NULL,
  "endTime" TIMESTAMP,
  "openingBalance" DECIMAL(14, 2) NOT NULL,
  "closingBalance" DECIMAL(14, 2),
  "totalSales" DECIMAL(14, 2) DEFAULT 0,
  "cashReceived" DECIMAL(14, 2),
  "variance" DECIMAL(14, 2),
  "notes" TEXT,
  "status" VARCHAR(50) CHECK ("status" IN ('open', 'closed')),
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_shifts_user ON "Shifts"("userId");
CREATE INDEX idx_shifts_date ON "Shifts"("shiftDate");

-- =====================================================
-- 10. STOCK MOVEMENTS (Mutasi Stok)
-- =====================================================
CREATE TABLE IF NOT EXISTS "StockMovements" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "productId" UUID NOT NULL REFERENCES "Products"("id"),
  "movementType" VARCHAR(50) CHECK ("movementType" IN ('in', 'out', 'adjustment', 'opname')),
  "quantity" INTEGER NOT NULL,
  "reference" VARCHAR(100),
  "notes" TEXT,
  "createdBy" UUID REFERENCES "Users"("id"),
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stock_movements_product ON "StockMovements"("productId");
CREATE INDEX idx_stock_movements_date ON "StockMovements"("createdAt");

-- =====================================================
-- 11. GENERAL LEDGER (Buku Besar)
-- =====================================================
CREATE TABLE IF NOT EXISTS "GeneralLedgers" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "accountCode" VARCHAR(20) NOT NULL REFERENCES "ChartOfAccounts"("accountCode"),
  "journalDetailId" UUID NOT NULL REFERENCES "JournalDetails"("id"),
  "debit" DECIMAL(14, 2) DEFAULT 0,
  "credit" DECIMAL(14, 2) DEFAULT 0,
  "balance" DECIMAL(14, 2) DEFAULT 0,
  "transactionDate" DATE DEFAULT CURRENT_DATE,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gl_account ON "GeneralLedgers"("accountCode");
CREATE INDEX idx_gl_date ON "GeneralLedgers"("transactionDate");

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Update timestamp otomatis
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger ke semua tabel
CREATE TRIGGER trg_users_timestamp BEFORE UPDATE ON "Users" FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_products_timestamp BEFORE UPDATE ON "Products" FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_transactions_timestamp BEFORE UPDATE ON "Transactions" FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_journals_timestamp BEFORE UPDATE ON "Journals" FOR EACH ROW EXECUTE FUNCTION update_timestamp();

COMMIT;
