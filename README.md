# 🏪 Sistem POS Koperasi Modern

Sistem Point of Sale (POS) terintegrasi dengan Akuntansi Otomatis untuk Koperasi Modern.

## 🎯 Fitur Utama

### 1. Manajemen Hak Akses (RBAC)
- **Kasir/User Biasa**: Transaksi penjualan, shift opening/closing
- **Admin/Pengurus**: Akses penuh, manajemen stok, laporan keuangan

### 2. Modul Kasir (POS)
- Scan Barcode/QR Code
- Harga bertingkat (Anggota vs Non-Anggota)
- Multi-metode pembayaran (Tunai, QRIS, Debit, Potong Simpanan)
- Struk digital & fisik
- Kalkulasi otomatis diskon & pajak

### 3. Manajemen Stok
- Stok real-time
- Low stock alert
- Stock opname
- Purchase order tracking

### 4. Sistem Akuntansi Otomatis
- Double-entry bookkeeping
- Chart of Accounts (COA)
- Jurnal otomatis setiap transaksi
- Buku besar (General Ledger)

### 5. Laporan Keuangan
- Laporan Penjualan
- Laporan Laba-Rugi (P&L)
- Laporan Neraca (Balance Sheet)
- Laporan SHU (Sisa Hasil Usaha)
- Export Excel/PDF

## 📁 Struktur Project

```
koperasi-pos-system/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── config/         # Database & Environment
│   │   ├── controllers/    # Business Logic
│   │   ├── routes/         # API Endpoints
│   │   ├── models/         # Database Models
│   │   ├── middleware/     # Authentication & Validation
│   │   └── utils/          # Helper Functions
│   ├── package.json
│   └── .env.example
├── frontend/                # React + Vite
│   ├── src/
│   │   ├── components/     # Reusable Components
│   │   ├── pages/          # Page Components
│   │   ├── api/            # API Client
│   │   ├── store/          # State Management
│   │   └── styles/         # CSS/Tailwind
│   ├── package.json
│   └── vite.config.js
├── database/
│   ├── schema.sql          # Database Schema
│   ├── seed.sql            # Initial Data
│   └── migrations/         # Database Migrations
├── docs/
│   ├── API.md              # API Documentation
│   ├── SETUP.md            # Setup Guide
│   ├── ARCHITECTURE.md     # System Architecture
│   └── BUSINESS_LOGIC.md   # Business Logic
├── docker-compose.yml      # Docker Setup
├── .gitignore
├── .env.example
└── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 16
- PostgreSQL >= 12
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/fachrurrozi785-stack/koperasi-pos-system.git
cd koperasi-pos-system

# Setup Backend
cd backend
npm install
cp .env.example .env
# Edit .env dengan konfigurasi database Anda
npm run migrate
npm run seed
npm start

# Setup Frontend (terminal baru)
cd frontend
npm install
npm run dev
```

## 📊 Default Login

**Admin:**
- Email: `admin@koperasi.local`
- Password: `admin123`

**Kasir:**
- Email: `kasir@koperasi.local`
- Password: `kasir123`

## 📚 Dokumentasi

- [Setup Guide](./docs/SETUP.md)
- [API Documentation](./docs/API.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Business Logic](./docs/BUSINESS_LOGIC.md)

## 🔧 Tech Stack

**Backend:**
- Node.js + Express.js
- PostgreSQL
- JWT Authentication
- Sequelize ORM

**Frontend:**
- React 18+
- Vite
- Tailwind CSS
- Axios
- React Query

**DevOps:**
- Docker & Docker Compose
- GitHub Actions (CI/CD)

## 📝 License

MIT License

## 👨‍💻 Author

Created for Koperasi Modern Indonesia
