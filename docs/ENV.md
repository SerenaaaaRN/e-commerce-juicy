# ENV.md — Juicy
> All environment variables. Never commit actual values. Copy `.env.example` to `.env` and fill in.

---

## Backend (`server/.env`)

```env
# ─── Server ────────────────────────────────────────────
APP_PORT=8080
APP_ENV=development                  # development | production

# ─── Database ──────────────────────────────────────────
DB_HOST=localhost
DB_PORT=5432
DB_NAME=juicy
DB_USER=postgres
DB_PASSWORD=postgres
DB_SSLMODE=disable                   # disable (local) | require (Railway)
DATABASE_URL=                        # Full DSN — used in production (Railway sets this automatically)

# ─── JWT — Admin ───────────────────────────────────────
JWT_ADMIN_SECRET=                    # Random 32+ char string — admin token signing
JWT_ADMIN_ACCESS_EXPIRY_MINUTES=15   # Short-lived access token
JWT_ADMIN_REFRESH_EXPIRY_DAYS=7      # Long-lived refresh token (HttpOnly cookie)

# ─── JWT — Customer ────────────────────────────────────
JWT_CUSTOMER_SECRET=                 # Separate secret — random 32+ char string
JWT_CUSTOMER_EXPIRY_DAYS=7           # Customer token expiry (longer, not split token)

# ─── Cloudinary ────────────────────────────────────────
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_UPLOAD_FOLDER=juicy       # Folder prefix in Cloudinary

# ─── Resend (Email) ────────────────────────────────────
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@juicy.com
ADMIN_ALERT_EMAIL=admin@juicy.com    # Where to send new order alerts

# ─── CORS ──────────────────────────────────────────────
ALLOWED_ORIGINS=http://localhost:5173    # Comma-separated. In prod: https://juicy.com
```

---

## Frontend (`client/.env`)

```env
# ─── API ───────────────────────────────────────────────
VITE_API_BASE_URL=http://localhost:8080/api   # In prod: https://<railway-domain>/api
```

> Note: Only `VITE_` prefixed variables are exposed to the browser in Vite.

---

## Railway Production Notes

Railway auto-injects `DATABASE_URL` for PostgreSQL services. The backend config should prefer `DATABASE_URL` over individual `DB_*` vars when it's set.

```go
// config.go — preferred pattern
dsn := os.Getenv("DATABASE_URL")
if dsn == "" {
    dsn = fmt.Sprintf(
        "host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
        cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBSSLMode,
    )
}
```

---

## `.env.example` (commit this to repo)

```env
# Backend
APP_PORT=8080
APP_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=juicy
DB_USER=postgres
DB_PASSWORD=
DB_SSLMODE=disable
DATABASE_URL=

JWT_ADMIN_SECRET=change_me_to_random_32_chars
JWT_ADMIN_ACCESS_EXPIRY_MINUTES=15
JWT_ADMIN_REFRESH_EXPIRY_DAYS=7

JWT_CUSTOMER_SECRET=change_me_to_another_random_32_chars
JWT_CUSTOMER_EXPIRY_DAYS=7

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_UPLOAD_FOLDER=juicy

RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@juicy.com
ADMIN_ALERT_EMAIL=admin@juicy.com

ALLOWED_ORIGINS=http://localhost:5173

# Frontend
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## Where to Get Each Value

| Variable | Where |
|---|---|
| `JWT_ADMIN_SECRET` | Generate: `openssl rand -hex 32` |
| `JWT_CUSTOMER_SECRET` | Generate: `openssl rand -hex 32` (different from admin secret) |
| `DB_*` | pgAdmin 4 local setup |
| `DATABASE_URL` | Auto-set by Railway PostgreSQL plugin |
| `CLOUDINARY_*` | Cloudinary Dashboard → Settings → API Keys |
| `RESEND_API_KEY` | Resend Dashboard → API Keys |
| `ALLOWED_ORIGINS` | Your deployed frontend URL |

---

## Quick Setup — JWT Secrets

Generate JWT secrets before starting the backend. Run these commands in your terminal:

```bash
# Generate admin JWT secret (copy output to JWT_ADMIN_SECRET in .env)
openssl rand -hex 32

# Generate customer JWT secret (copy output to JWT_CUSTOMER_SECRET in .env)
# IMPORTANT: must be DIFFERENT from admin secret
openssl rand -hex 32
```

Or on Windows PowerShell:
```powershell
# Native PowerShell (No dependencies needed, generates random 32-byte hex string)
-join ((1..32) | ForEach-Object { "{0:x2}" -f (Get-Random -Minimum 0 -Maximum 256) })

# Alternative using Python (if Python is installed)
python -c "import secrets; print(secrets.token_hex(32))"
```
