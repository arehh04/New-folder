# ⚜️ Id10T Maison de Luxe — Haute E-Commerce Platform

> An ultra-luxury, full-stack e-commerce sanctuary engineered with **React 19 + Vite**, **Node.js + Express**, **HTTP-Only Cookie Security**, **Bcrypt Hashing**, **Probabilistic Bloom Filters**, **Redis Caching**, and **Strict Tenant Data Isolation**.

---

## 🏛️ System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                          CLIENT TIER (React 19 + Vite)                 │
│                                                                        │
│   Pages: Home  ·  Details  ·  Checkout  ·  Wishlist  ·  Orders  ·  Admin │
│   Contexts: AuthContext  ·  CartContext  ·  WishlistContext            │
│   Business Layer: productBusiness · authBusiness · orderBusiness       │
│   Service Layer: productService · authService · orderService (Axios)   │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ HTTP-Only Cookie ('royal_session')
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        API TIER (Node.js + Express)                    │
│                                                                        │
│   Routes: /api/products  ·  /api/auth  ·  /api/orders  ·  /api/admin   │
│   Middleware: authenticateToken · requireRole('admin') · errorHandler  │
│   Envelopes: ApiResponse { success, data, message, meta }              │
└──────────────────┬─────────────────┬─────────────────┬─────────────────┘
                   │                 │                 │
                   ▼                 ▼                 ▼
          ┌─────────────────┐ ┌─────────────┐ ┌─────────────────┐
          │  BLOOM FILTER   │ │ REDIS CACHE │ │ MONGODB/MEMORY  │
          │ O(1) Penetration│ │  5-min TTL  │ │ Product, User,  │
          │ Defense Array   │ │ Cache Aside │ │ Order Documents │
          └─────────────────┘ └─────────────┘ └─────────────────┘
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0+ or v20.0+
- **npm**: v9.0+

### 1. Installation
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file from the provided template:
```bash
cp .env.example .env
```

### 3. Run Development Servers
You can start both the backend API and frontend Vite dev server concurrently with one command:
```bash
npm run dev:all
```
* **Frontend**: `http://localhost:5173`
* **Backend API**: `http://localhost:5000`

---

## 🧪 Automated System Test Suite

Run the full end-to-end API, security, Bloom filter, and data isolation test suite:
```bash
npm run test:api
```

---

## 🔐 Demo Accounts & Credentials

| Role | Username | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **👑 Store Custodian (Admin)** | `emilys` | `emilyspass` | Full CRUD catalog mutations, gross revenue telemetry, stock depletion alerts, fulfillment status updates. |
| **⚜️ Sovereign Patron** | `michaelw` | `michaelwpass` | Private wishlist, tenant-isolated order history & tracking timeline, checkout authorization. |

---

## 📚 API Reference Table

### 1. Authentication (`/api/auth`)
* `POST /api/auth/login` — Authenticates credentials with `bcryptjs`, sets HTTP-Only `royal_session` cookie.
* `POST /api/auth/register` — Registers new patron with cryptographic password hashing.
* `POST /api/auth/logout` — Clears session cookie.
* `GET /api/auth/me` — Returns sanitized current authenticated patron profile.

### 2. Catalog & Products (`/api/products`)
* `GET /api/products` — Paginated catalog with Bloom filter defense, Redis caching, category pills, and search.
* `GET /api/products/:id` — Single artifact lookup protected by $O(1)$ Bloom filter to eliminate cache penetration.
* `POST /api/products` *(Admin Only)* — Enshrines a new luxury artifact; invalidates Redis cache.
* `PUT /api/products/:id` *(Admin Only)* — Updates artifact pricing, inventory, or metadata.
* `DELETE /api/products/:id` *(Admin Only)* — Deletes artifact from vault archives.
* `POST /api/products/:id/reviews` — Submits verified patron review and recalculates average rating.

### 3. Orders & Tracking (`/api/orders`)
* `GET /api/orders` — Retrieves orders strictly scoped to the authenticated patron's tenant ledger.
* `POST /api/orders` — Authorizes new sovereign acquisition.
* `GET /api/orders/:orderId` — Single order detail with 4-stage tracking timeline. Blocks foreign users with `403`.

### 4. Admin Sanctuary (`/api/admin`)
* `GET /api/admin/metrics` *(Admin Only)* — Computes Gross Vault Revenue, Average Order Value, and catalog stats.
* `GET /api/admin/inventory-alerts` *(Admin Only)* — Lists pieces with critical stock ($\le 5$ units).
* `PATCH /api/admin/orders/:orderId/status` *(Admin Only)* — Updates live consignment fulfillment stage (*Authorized ➔ Sealed ➔ Courier ➔ Delivered*).

---

## 🛡️ Security & Enterprise Highlights

1. **HTTP-Only Cookies (`cookie-parser`)**: JWT tokens are issued in HTTP-Only cookies with `sameSite: 'lax'`, preventing XSS token theft.
2. **Password Hashing (`bcryptjs`)**: Passwords hashed with 10 cryptographic salt rounds. Hashes are stripped from all API outputs via DTO sanitizers (`sanitizer.js`).
3. **Probabilistic Bloom Filter (`Uint8Array`)**: Protects against Cache Penetration attacks on non-existent product IDs ($O(1)$ fast rejection) and checks username uniqueness.
4. **Resilient Redis Cache (`redis.js`)**: 5-minute TTL cache-aside layer with automated in-memory LRU fallback.
5. **Strict Tenant Data Isolation**: Patrons can only query their own ledger; foreign access attempts trigger `403 TENANT_ISOLATION_VIOLATION`.

---

## 📜 Available NPM Scripts

* `npm run dev` — Starts the Vite frontend server.
* `npm run server` — Starts the Express API server.
* `npm run dev:all` — Runs backend and frontend concurrently.
* `npm run build` — Compiles production bundle with Vite.
* `npm run test:api` — Executes the automated system test suite.
* `npm run lint` — Runs fast static analysis via Oxlint.
