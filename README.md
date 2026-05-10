# Juicy 🍊 — Premium Storefront & Admin Portal

Juicy is a state-of-the-art, high-end e-commerce platform featuring a modern hybrid domain-based React 19 storefront and a high-performance Go administrative backend. Drawing heavy design and UX inspiration from top-tier fashion platforms like Zalora, Juicy blends rich aesthetics (terracotta accents, glassmorphic structures, and smooth micro-animations) with production-grade backend design patterns.

---

## 🛠️ Technology Stack

### Frontend (Client)
* **Core:** React 19, Vite, TypeScript
* **Styling & Design:** Tailwind CSS, Shadcn/UI, Lucide Icons, Outfit & Inter Google Fonts
* **State Management:** Zustand (Memory-only JWT storage for robust XSS protection)
* **Charts & Analytics:** Recharts (responsive, clean visualizations bound to CSS variables)
* **Data Fetching:** Axios (with dual client instances & silent token refresh interceptors)

### Backend (Server)
* **Language:** Go (Golang) 1.20+
* **HTTP Router:** Gin Gonic Web Framework
* **Database & ORM:** PostgreSQL & GORM
* **Migrations:** Raw SQL PostgreSQL schema management via `golang-migrate`
* **Images & Media:** Cloudinary API integration (safe local staging with auto-cleanup)
* **Transactional Emails:** Resend API (asynchronous background dispatch queues)

---

## 🏗️ Core Architecture & Features

### 🛍️ Storefront (Customer Experience)
* **Dynamic Home Page:** Multi-section landing page with editorial lookbooks, newsletter signups, trending carousels, and recent views (local storage).
* **Zalora-Style Catalog Filter:** Multi-category catalog filtering, nested subcategory recursive trees, size filtering, and sorting systems.
* **Product Detail Page (PDP):** Size/color selectors with real-time stock feedback, multi-image interactive carousels, and verified-purchase review system.
* **Shopping Cart & Wishlist:** Stateful Zustand stores with optimistic UI toggles and instant quantity sync.
* **COD Checkout Flow:** Integrated address selector (supports primary labels and inline editing) and payment stub configurations.

### 📊 Admin Dashboard (Operations Hub)
* **Analytical Insights:** Real-time metrics overview, concurrent db pipelines via `errgroup`, and weekly revenue/orders charts.
* **Inventory Management:** Product catalog manager, variant modifier dialogs, and instant multi-image galleries. Supports file uploads or direct paste image URL associations.
* **Order Processing Workflow:** Detailed status history tracking (`Pending` → `Confirmed` → `Shipped` → `Delivered` → `Cancelled`) with automatic inventory adjustments.
* **Customer CRM & Review Moderation:** CRM customer list actions (active/suspend status) and one-click review publishing controls.

---

## 🔒 Production-Grade Security Controls

During our comprehensive security audit, the Juicy platform was hardened to strictly mitigate top OWASP vulnerabilities:

1. **Hardened CORS Whitelist (Reflected CORS Shield):**
   The backend CORS middleware dynamically matches incoming browser `Origin` headers strictly against a comma-separated whitelist configured in `.env` (`ALLOWED_ORIGINS`). Cross-Origin requests from unauthorized domains are blocked, securing administrative cookies.
2. **JWT Token Type Protection (Substitution Shield):**
   Customer and Admin authorization are strictly isolated. Administrative JWTs include an explicit `token_type` claim (`access` or `refresh`):
   * **AdminAuth Middleware:** Rejects any authorization token not explicitly marked as `token_type == "access"`.
   * **Silent Refresh Endpoint:** Accepts tokens strictly matching `token_type == "refresh"`.
3. **Atomic Inventory Stock Protection:**
   To prevent overselling during concurrent checkout spikes, stock decrementing runs in an isolated PostgreSQL transaction locking variant records (`SELECT FOR UPDATE`).
4. **Verified-Purchase Reviews:**
   Reviews strictly require a valid foreign key referencing an order owned by that customer with a `delivered` status, mitigating spam.

---

## 📂 Project Structure

```
juicy/
├── client/                     # React 19 Frontend
│   ├── src/
│   │   ├── features/           # Domain-based components (home, shop, cart, checkout, admin...)
│   │   ├── components/         # Shared UI (shadcn/ui primitives, layout, common)
│   │   ├── lib/api/            # Axios client instances (client.ts & customerClient.ts)
│   │   ├── stores/             # Zustand global state (adminAuthStore, customerAuthStore...)
│   │   └── index.css           # Global Tailwind stylesheet with Terracotta themes
│
├── server/                     # Go Backend
│   ├── cmd/main.go             # Application entrypoint (Dependency Injection & server boot)
│   ├── internal/
│   │   ├── middleware/         # CORS protection, AdminAuth & CustomerAuth
│   │   ├── model/              # Database entities (GORM bindings)
│   │   ├── repository/         # Database persistence layers
│   │   ├── service/            # Core business logic (analytics, order transaction, auth...)
│   │   ├── handler/            # Gin handlers mapping JSON payloads to services
│   │   └── router/             # REST route group declarations
│   └── migrations/             # SQL schema migrations (000001 to 000014)
│
└── docs/                       # Comprehensive System Documentation
```

---

## 🚀 Getting Started

### Prerequisites
* Go 1.20 or higher installed
* Node.js v18 or higher installed
* PostgreSQL database instance running locally or hosted

### 1. Database Setup
Create a PostgreSQL database named `juicy` and run migrations to create the schemas:
```bash
# Using golang-migrate CLI
migrate -path server/migrations -database "postgres://postgres:postgres@localhost:5432/juicy?sslmode=disable" up
```

### 2. Environment Variables Configuration
Copy the `.env.example` in `/server` and configure your credentials:
```bash
cp server/.env.example server/.env
```
Key configuration variables inside `server/.env`:
* `JWT_ADMIN_SECRET` / `JWT_CUSTOMER_SECRET`: Random 32+ character secrets (Generate via `openssl rand -hex 32`).
* `ALLOWED_ORIGINS`: `http://localhost:5173` (comma-separated for production domains).
* `CLOUDINARY_*` & `RESEND_API_KEY`: External keys for image staging and transactional emails.

Configure your frontend configuration:
```bash
# client/.env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 3. Launching the Backend
Navigate to `/server` and run the development command:
```bash
cd server
go run cmd/main.go
```
The server will boot on `http://localhost:8080` (or configured `APP_PORT`).

### 4. Launching the Frontend
Navigate to `/client`, install the dependencies, and start Vite:
```bash
cd client
npm install
npm run dev
```
The web application will launch on `http://localhost:5173`.

---

## 📖 System Documentation

Detailed technical design notes are maintained inside the **`docs/`** directory:
* 📄 **[ARCHITECTURE.md](docs/ARCHITECTURE.md):** Deep-dive into folder structures, atomic stock decrement transactions, and token flows.
* 📄 **[API.md](docs/API.md):** Complete REST API references (requests, response formats, and query parameters).
* 📄 **[ENV.md](docs/ENV.md):** Detailed guide to all environment variables and secrets creation.
* 📄 **[ERD.md](docs/ERD.md):** Database ERD mapping model relationships and constraints.
* 📄 **[TASKS.md](docs/TASKS.md):** Implementation checklists.
* 📄 **[CHANGELOG.md](docs/CHANGELOG.md):** Version-by-version audit trail of security updates and feature additions.
