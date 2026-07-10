# 📖 API Documentation - Koperasi POS System

## Base URL
```
http://localhost:5000/api
```

## Authentication

Semua request (kecuali login) harus menyertakan token JWT di header:

```
Authorization: Bearer <TOKEN>
```

---

## 🔐 Authentication Endpoints

### 1. Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@koperasi.local",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Admin Koperasi",
    "email": "admin@koperasi.local",
    "role": "admin"
  }
}
```

### 2. Logout
```http
POST /auth/logout
Authorization: Bearer <TOKEN>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 👤 User Endpoints

### 3. Get Profile
```http
GET /users/profile
Authorization: Bearer <TOKEN>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Admin Koperasi",
    "email": "admin@koperasi.local",
    "role": "admin",
    "phone": "+62812345678",
    "address": "Jl. Koperasi No. 1"
  }
}
```

### 4. Update Profile
```http
PUT /users/profile
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "name": "Admin Koperasi Updated",
  "phone": "+62812345679",
  "address": "Jl. Koperasi No. 2"
}
```

### 5. List Users (Admin Only)
```http
GET /users
Authorization: Bearer <TOKEN>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Admin Koperasi",
      "email": "admin@koperasi.local",
      "role": "admin"
    },
    ...
  ]
}
```

### 6. Create User (Admin Only)
```http
POST /users
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "name": "Kasir Baru",
  "email": "kasir3@koperasi.local",
  "password": "kasir123",
  "role": "kasir"
}
```

---

## 📦 Product Endpoints

### 7. Get All Products
```http
GET /products
Authorization: Bearer <TOKEN>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440010",
      "sku": "SKU001",
      "barcode": "8992830000001",
      "name": "Minyak Goreng 2L",
      "priceCost": 32000,
      "priceRetail": 40000,
      "priceMember": 38000,
      "stock": 50,
      "minimumStock": 10
    },
    ...
  ]
}
```

### 8. Get Product by Barcode
```http
GET /products/barcode/8992830000001
Authorization: Bearer <TOKEN>
```

### 9. Create Product (Admin Only)
```http
POST /products
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "sku": "SKU011",
  "barcode": "8992830000011",
  "name": "Produk Baru",
  "category": "Kategori",
  "priceCost": 10000,
  "priceRetail": 15000,
  "priceMember": 14000,
  "stock": 100,
  "minimumStock": 10
}
```

### 10. Update Product (Admin Only)
```http
PUT /products/:id
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "name": "Nama Produk Updated",
  "stock": 75
}
```

### 11. Delete Product (Admin Only)
```http
DELETE /products/:id
Authorization: Bearer <TOKEN>
```

---

## 💳 Transaction Endpoints

### 12. Create Transaction (POS)
```http
POST /transactions
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "items": [
    {
      "productId": "550e8400-e29b-41d4-a716-446655440010",
      "quantity": 2,
      "price": 40000,
      "subtotal": 80000
    },
    {
      "productId": "550e8400-e29b-41d4-a716-446655440020",
      "quantity": 1,
      "price": 12000,
      "subtotal": 12000
    }
  ],
  "discount": 5000,
  "paymentMethod": "cash",
  "memberId": null
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "transaction": {
      "id": "550e8400-e29b-41d4-a716-446655440100",
      "transactionNumber": "TRX-1704876600000",
      "subtotal": 92000,
      "discount": 5000,
      "tax": 8700,
      "total": 95700,
      "paymentMethod": "cash",
      "paymentStatus": "completed"
    },
    "items": [...]
  }
}
```

### 13. Get All Transactions
```http
GET /transactions
Authorization: Bearer <TOKEN>
```

### 14. Get Transaction Detail
```http
GET /transactions/:id
Authorization: Bearer <TOKEN>
```

### 15. Void Transaction (Admin Only)
```http
POST /transactions/:id/void
Authorization: Bearer <TOKEN>
```

---

## 📊 Report Endpoints (Admin Only)

### 16. Sales Report
```http
GET /reports/sales?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <TOKEN>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "transactions": [...],
    "totalSales": 5000000
  }
}
```

### 17. Profit & Loss Report
```http
GET /reports/profit-loss?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <TOKEN>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "revenue": { "total": 5000000 },
    "expenses": { "total": 2000000 },
    "profitLoss": 3000000
  }
}
```

### 18. Balance Sheet
```http
GET /reports/balance-sheet
Authorization: Bearer <TOKEN>
```

### 19. SHU Report
```http
GET /reports/shu
Authorization: Bearer <TOKEN>
```

---

## ❌ Error Responses

### 400 - Bad Request
```json
{
  "success": false,
  "status": 400,
  "message": "Invalid request data"
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "status": 401,
  "message": "Invalid token"
}
```

### 403 - Forbidden
```json
{
  "success": false,
  "status": 403,
  "message": "Access denied"
}
```

### 404 - Not Found
```json
{
  "success": false,
  "status": 404,
  "message": "Resource not found"
}
```

### 500 - Internal Server Error
```json
{
  "success": false,
  "status": 500,
  "message": "Internal Server Error"
}
```

---

## 📝 HTTP Status Codes

| Code | Meaning |
|------|----------|
| 200  | OK - Request berhasil |
| 201  | Created - Resource berhasil dibuat |
| 400  | Bad Request - Data invalid |
| 401  | Unauthorized - Token diperlukan |
| 403  | Forbidden - Akses ditolak |
| 404  | Not Found - Resource tidak ditemukan |
| 500  | Internal Server Error - Kesalahan server |

---

## 🧪 Testing dengan Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Import collection dari repository
3. Set environment variable: `{{base_url}}` = `http://localhost:5000/api`
4. Login dan copy token ke Postman
5. Gunakan token di header Authorization

---

**API Documentation Complete!** 📚
