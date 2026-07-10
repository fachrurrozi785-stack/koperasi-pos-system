# 🏗️ System Architecture - Koperasi POS System

## Overall Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                            │
│  ┌──────────────────┐                ┌────────────────────┐  │
│  │  React Frontend  │                │  Admin Dashboard   │  │
│  │   (POS Kasir)    │◄──────────────►│   (Laporan & etc)  │  │
│  └──────────────────┘                └────────────────────┘  │
│         │                                      │              │
│         │ HTTP/REST                            │ HTTP/REST    │
│         └────────────────┬─────────────────────┘              │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   API GATEWAY LAYER                          │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │         Express.js Server (Port 5000)                   │ │
│  │  ├── Authentication Middleware (JWT)                    │ │
│  │  ├── RBAC Authorization Middleware                      │ │
│  │  ├── Error Handler Middleware                           │ │
│  │  └── Request Validation Middleware                      │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│   Auth Routes    │ │  Product Routes  │ │Transaction Routes│
│  ├── Login       │ │  ├── Get All     │ │  ├── Create      │
│  ├── Logout      │ │  ├── Get By ID   │ │  ├── Get All     │
│  └── Refresh     │ │  ├── Create      │ │  ├── Get Detail  │
│                  │ │  ├── Update      │ │  └── Void        │
│   User Routes    │ │  └── Delete      │ │                  │
│  ├── Profile     │ │                  │ │  Report Routes   │
│  ├── Update      │ │   Stock Routes   │ │  ├── Sales       │
│  └── List        │ │  ├── Movements   │ │  ├── P&L         │
│                  │ │  └── Opname      │ │  ├── Balance     │
│                  │ │                  │ │  └── SHU         │
└──────────────────┘ └──────────────────┘ └──────────────────┘
         │                 │                     │
         └─────────────────┼─────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ Auth Controller  │ │Product Controller│ │ Transaction      │
│                  │ │                  │ │ Controller       │
│ Business Logic:  │ │ Business Logic:  │ │                  │
│ - Authenticate   │ │ - Validate data  │ │ Business Logic:  │
│ - Generate Token │ │ - Query DB       │ │ - Calculate      │
│ - Verify Password│ │ - Check stock    │ │   totals         │
│                  │ │                  │ │ - Auto Journal   │
│                  │ │                  │ │ - Update stock   │
└──────────────────┘ └──────────────────┘ └──────────────────┘
         │                 │                     │
         └─────────────────┼─────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   DATA ACCESS LAYER                         │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │         Sequelize ORM (Object-Relational Mapping)       │ │
│  │  ├── User Model                                         │ │
│  │  ├── Product Model                                      │ │
│  │  ├── Transaction Model                                  │ │
│  │  ├── TransactionItem Model                              │ │
│  │  ├── Journal Model                                      │ │
│  │  ├── JournalDetail Model                                │ │
│  │  ├── ChartOfAccounts Model                              │ │
│  │  └── Member Model                                       │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  DATABASE LAYER                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │    PostgreSQL Database (Port 5432)                      │ │
│  │                                                         │ │
│  │  ┌──────────────────────────────────────────────────┐   │ │
│  │  │ Core Tables                                      │   │ │
│  │  │ ├── users                                        │   │ │
│  │  │ ├── products                                     │   │ │
│  │  │ ├── members                                      │   │ │
│  │  │ ├── transactions                                 │   │ │
│  │  │ └── transaction_items                            │   │ │
│  │  └──────────────────────────────────────────────────┘   │ │
│  │                                                         │ │
│  │  ┌──────────────────────────────────────────────────┐   │ │
│  │  │ Accounting Tables                                │   │ │
│  │  │ ├── chart_of_accounts (COA)                      │   │ │
│  │  │ ├── journals                                     │   │ │
│  │  │ ├── journal_details                              │   │ │
│  │  │ └── general_ledgers                              │   │ │
│  │  └──────────────────────────────────────────────────┘   │ │
│  │                                                         │ │
│  │  ┌──────────────────────────────────────────────────┐   │ │
│  │  │ Additional Tables                                │   │ │
│  │  │ ├── shifts                                       │   │ │
│  │  │ └── stock_movements                              │   │ │
│  │  └──────────────────────────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow - Transaction Creation

```
1. KASIR INPUT
   ↓
   Kasir memindai barcode produk di POS
   ├── Product ditambahkan ke cart
   ├── Harga disesuaikan (member/non-member)
   └── Diskon dihitung otomatis
   
2. CHECKOUT
   ↓
   Frontend mengirim request:
   POST /api/transactions
   {
     items: [...],
     discount: 5000,
     paymentMethod: 'cash'
   }
   
3. BACKEND PROCESSING
   ↓
   Transaction Controller:
   a. Validasi data input
   b. Generate transaction number (TRX-timestamp)
   c. Hitung: subtotal, tax, total
   d. Create transaction record
   e. Create transaction items
   f. Update product stocks
   g. AUTO JOURNAL (Double-Entry):
      • Debit Kas 95700 → Kredit Pendapatan 92000
      • Create Journal Entry
      • Create Journal Details
      • Update General Ledger
   h. Return response ke frontend
   
4. DATABASE UPDATES
   ↓
   Tables yang ter-update:
   • transactions (1 row)
   • transaction_items (N rows)
   • products (N rows, stock)
   • journals (1 row)
   • journal_details (2+ rows)
   • general_ledgers (2+ rows)
   
5. ACCOUNTING AUTOMATION
   ↓
   Chart of Accounts yang terpengaruh:
   • 1010 (Kas) → Debit +95700
   • 4010 (Pendapatan Penjualan) → Kredit +92000
   • 2010 (Utang PPN) → Kredit +3700
   
6. RESPONSE KE FRONTEND
   ↓
   {
     success: true,
     data: {
       transaction: {...},
       items: [...]
     }
   }
   
7. STRUK DICETAK
   ↓
   Fisik: Thermal Printer (58mm)
   Digital: Email / WhatsApp (Optional)
```

## Role-Based Access Control (RBAC)

```
┌─────────────────────────────────────┐
│           KASIR (Cashier)           │
├─────────────────────────────────────┤
│ ✅ Akses:                           │
│  • Lihat produk (read)              │
│  • Input transaksi (create)         │
│  • Lihat riwayat transaksi sendiri  │
│  • Shift opening/closing            │
│                                     │
│ ❌ Tidak Boleh:                     │
│  • Edit harga produk                │
│  • Hapus transaksi                  │
│  • Lihat laporan keuangan total     │
│  • Manajemen user                   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│        ADMIN (Pengurus)             │
├─────────────────────────────────────┤
│ ✅ Akses:                           │
│  • Semua fitur kasir                │
│  • Manajemen produk (CRUD)          │
│  • Manajemen user (CRUD)            │
│  • Lihat semua transaksi            │
│  • Void/Refund transaksi            │
│  • Laporan keuangan lengkap         │
│  • Laporan SHU                      │
│  • Manajemen member                 │
│  • Stock opname                     │
│  • Export laporan (Excel/PDF)       │
│                                     │
│ ✅ Full Access ke:                  │
│  • Semua modul sistem               │
└─────────────────────────────────────┘
```

## Database Relationships

```
users (1) ──────────→ (N) transactions
  │
  └──→ role: 'admin' atau 'kasir'

products (1) ─────────→ (N) transaction_items
                ↓
           (N) stock_movements

transactions (1) ──────→ (N) transaction_items
         │
         └──→ (N) journals

members (1) ──────────→ (N) transactions

journals (1) ──────────→ (N) journal_details

chart_of_accounts (1) ──→ (N) journal_details
                    ↓
                   (N) general_ledgers
```

## Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Database**: PostgreSQL 12+
- **ORM**: Sequelize 6.x
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Data Fetching**: React Query
- **Charts**: Recharts

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Version Control**: Git

## Security Measures

1. **Authentication**: JWT dengan expiry time
2. **Password**: Hashed dengan bcryptjs (salt rounds: 10)
3. **Authorization**: RBAC middleware
4. **Validation**: Express-validator
5. **CORS**: Configured untuk frontend domain
6. **Helmet**: Security headers
7. **Rate Limiting**: (implementasi di production)
8. **SQL Injection Prevention**: Sequelize parameterized queries

## Performance Optimization

1. **Database Indexing**: Pada foreign keys dan frequently queried columns
2. **Caching**: (implementasi di production)
3. **Pagination**: Support untuk list endpoints
4. **Lazy Loading**: React components
5. **Code Splitting**: Frontend build optimization

---

**Architecture Documentation Complete!** 🏗️
