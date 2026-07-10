# 📚 Setup Guide - Koperasi POS System

## Prerequisites

Sebelum memulai, pastikan Anda sudah install:

- **Node.js** >= 16 ([Download](https://nodejs.org))
- **PostgreSQL** >= 12 ([Download](https://www.postgresql.org/download))
- **Git** ([Download](https://git-scm.com))
- **Docker & Docker Compose** (Opsional, untuk setup lebih mudah)

## 🚀 Quick Start dengan Docker (RECOMMENDED)

Ini adalah cara paling mudah dan cepat!

### Step 1: Clone Repository
```bash
git clone https://github.com/fachrurrozi785-stack/koperasi-pos-system.git
cd koperasi-pos-system
```

### Step 2: Setup Environment
```bash
cp .env.example .env
```

### Step 3: Run dengan Docker Compose
```bash
docker-compose up -d
```

**Tunggu 2-3 menit sampai semua container siap.**

### Step 4: Akses Aplikasi
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Database**: localhost:5432

---

## 🛠️ Setup Manual (Tanpa Docker)

### Step 1: Setup Database

```bash
# Buat database baru di PostgreSQL
psql -U postgres

# Di dalam psql console:
CREATE DATABASE koperasi_pos;
CREATE USER koperasi WITH PASSWORD 'password123';
ALTER ROLE koperasi WITH CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE koperasi_pos TO koperasi;
\q
```

### Step 2: Import Schema & Seed Data

```bash
# Import schema
psql -U koperasi -d koperasi_pos -f database/schema.sql

# Import seed data
psql -U koperasi -d koperasi_pos -f database/seed.sql
```

### Step 3: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Edit .env dengan konfigurasi database:
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=koperasi_pos
# DB_USER=koperasi
# DB_PASSWORD=password123

# Jalankan server
npm run dev
```

Server akan berjalan di **http://localhost:5000**

### Step 4: Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Edit .env (opsional, sudah default)
# VITE_API_URL=http://localhost:5000/api

# Jalankan development server
npm run dev
```

Aplikasi akan berjalan di **http://localhost:5173**

---

## 🔐 Default Login Credentials

### Admin Account
```
Email: admin@koperasi.local
Password: admin123
```

### Kasir Account
```
Email: kasir1@koperasi.local
Password: kasir123

Email: kasir2@koperasi.local
Password: kasir123
```

---

## 📋 Verifikasi Installation

### Check Backend
```bash
curl http://localhost:5000/health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-10T10:30:00Z"
}
```

### Check Database Connection
```bash
psql -U koperasi -d koperasi_pos -c "SELECT COUNT(*) FROM \"Users\";"
```

Should return: **3** (1 admin + 2 kasir)

---

## 🐛 Troubleshooting

### Error: "connection refused"
- Pastikan PostgreSQL running
- Check di port 5432

### Error: "Module not found"
```bash
# Clear node_modules dan reinstall
rm -rf node_modules package-lock.json
npm install
```

### Error: "EADDRINUSE: address already in use"
```bash
# Port sudah digunakan, change di .env
PORT=5001  # atau port lainnya
```

### Docker Error: "Cannot connect to Docker daemon"
- Pastikan Docker Desktop sedang running
- Restart Docker

---

## 📊 Database Schema Overview

```
users (Kasir & Admin)
├── id
├── email
├── password
├── role (kasir/admin)
└── ...

products (Inventori)
├── id
├── sku
├── barcode
├── name
├── price_retail
├── price_member
├── stock
└── ...

transactions (Penjualan)
├── id
├── transaction_number
├── user_id
├── total
├── payment_method
└── ...

transaction_items (Detail Penjualan)
├── id
├── transaction_id
├── product_id
├── quantity
└── ...

journals (Jurnal Akuntansi)
├── id
├── journal_number
├── reference_type
└── ...

journal_details (Detail Jurnal)
├── id
├── journal_id
├── account_code
├── debit
├── credit
└── ...
```

---

## 🚢 Production Deployment

### Build Frontend
```bash
cd frontend
npm run build
# Output ada di folder 'dist/'
```

### Deploy dengan Heroku
```bash
# Pastikan sudah install Heroku CLI
heroku login
heroku create nama-app-anda
git push heroku main
```

---

## 📞 Support

Jika ada masalah:
1. Cek file `.env` konfigurasi
2. Baca error message dengan teliti
3. Lihat logs: `docker-compose logs`
4. Buka issue di GitHub

---

**Happy Coding!** 🎉
