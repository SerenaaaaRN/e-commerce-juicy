# Juicy Backend — Refactoring Master Plan

> 23 temuan dari 2 sesi code review (struktur, penamaan, clean code, optimasi, bug).
> 5 phase, estimasi total ~8-12 jam.

---

## 🧩 Phase 1: Foundation Helpers & Zero-Risk Cleanup

**Tujuan**: Hilangkan boilerplate massif, tanpa perubahan behavior.

| # | Item | Tipe |
|---|------|------|
| 1 | Buat `handler/helper.go` — `getCustomerID()`, `okJSON()`, `errJSON()`, `createdJSON()`, `validationErrJSON()` | Refactor |
| 2 | Refactor semua handler method — ganti 7 baris `customerID` extraction jadi 1 baris helper | Refactor |
| 3 | Refactor 40+ response — `gin.H{...}` boilerplate jadi helper call 1 baris | Refactor |
| 4 | Ekstrak primary image logic → method `Product.PrimaryImageURL()` di `model/product.go` | Refactor |
| 5 | `go mod tidy` — perbaiki dependency status | Housekeeping |

**File touched**: `handler/helper.go` (baru) + semua file handler + `model/product.go`
**Estimasi**: ~2-3 jam

---

## 🧩 Phase 2: Type System & Naming Consistency

**Tujuan**: Hilangkan string magic, konsistenkan penamaan.

| # | Item | Tipe |
|---|------|------|
| 6 | Buat typed constants — `OrderStatus`, `PaymentStatus` (ganti semua string literal `"pending"`, `"delivered"`, dll) | Refactor |
| 7 | Rename `DeleteVariant` → `DeactivateVariant` (soalnya soft-delete) | Rename |
| 8 | Konsistenkan suffix DTO — `ProductVariantRes` → `ProductVariantResponse`, dll | Rename |
| 9 | Rename `getSafeString` → `strOrDash` | Rename |
| 10 | Rename `cldService` → `cloudinaryService` di `main.go` | Rename |
| 11 | Error codes konsisten — standarisasi format pesan | Refactor |

**File touched**: `model/*.go`, `dto/*.go`, `service/*.go`, `repository/product.go`, `main.go`
**Estimasi**: ~1-2 jam

---

## 🧩 Phase 3: Data Layer Architecture

**Tujuan**: Hentikan pelanggaran Dependency Inversion, perbaiki N+1 queries.

| # | Item | Tipe |
|---|------|------|
| 12 | Pindahkan semua direct `*gorm.DB` dari service ke repository – buat method agregat: | Refactor |
|    | - `GetProductReviewStats(ctx, productIDs) → map[UUID]Stats` | |
|    | - `GetCategoryProductCounts(ctx) → map[UUID]int64` | |
|    | - `GetOrderItemCounts(ctx, orderIDs) → map[UUID]int` | |
|    | - `GetVariantProductID(ctx, variantID) → UUID` | |
| 13 | Fix N+1 di Cart Service — ganti loop `FindByID` dengan batch query | 🔴 Fix |
| 14 | Fix N+1 di Order Service — ganti `Count()` per-order dengan subquery/preload | 🔴 Fix |
| 15 | Split `productRepo` — extract method Image dan Variant ke file/struct terpisah | Refactor |
| 16 | Hilangkan duplikasi `FindBySlug` vs `FindByID` — ekstrak query builder | Refactor |
| 17 | Config cleanup — konsistenkan `getEnv()` vs `os.Getenv()` | Refactor |

**File touched**: `repository/*.go`, `service/*.go`
**Estimasi**: ~3-4 jam (paling berat, perlu test ulang query)

---

## 🧩 Phase 4: Business Logic Fixes

**Tujuan**: Perbaiki bug dan potensi data inconsistency.

| # | Item | Tipe |
|---|------|------|
| 18 | Bungkus `CompleteOrder` dengan DB transaction — atomic: status + payment_status | 🔴 Fix |
| 19 | Fix `generateRandomAlphanumeric` — handle error `crypto/rand`, tambah retry/uniqueness | 🟠 Fix |
| 20 | Fix shutdown race condition — panggil `worker.Shutdown()` di `defer`, sebelum `srv.Shutdown` | 🟠 Fix |
| 21 | Jadikan Shipping Fee configurable — pindahkan `25000` ke config | Refactor |
| 22 | Fix `drainRemaining` — jangan eksekusi task baru setelah context cancel | 🟠 Fix |
| 23 | Fix email error logging — log error task di `worker.Submit` / di dalam task func | 🟡 Fix |

**File touched**: `service/order.go`, `main.go`, `config/config.go`, `service/background.go`
**Estimasi**: ~1-2 jam

---

## 🧩 Phase 5: Infrastructure & Polish

**Tujuan**: Ganti implementasi manual dengan library, simplifikasi kode.

| # | Item | Tipe |
|---|------|------|
| 24 | Ganti CORS manual → `gin-contrib/cors` (yang sudah di go.mod) | Refactor |
| 25 | Simplifikasi Router constructor — gunakan `RouterConfig` struct atau option pattern | Refactor |
| 26 | Ekstrak cookie setting — helper `setRefreshCookie(c, token, maxAge, isSecure)` | Refactor |

**File touched**: `middleware/cors.go`, `router/router.go`, `main.go`, `handler/admin.go`
**Estimasi**: ~1 jam

---

## ⚠️ Dependencies Antar Phase

```
Phase 1 ──► Phase 2 ──► Phase 3 ──► Phase 4 ──► Phase 5
                                          │
                                          └── Bisa parallel dengan Phase 3
                                              setelah method repository baru siap
```

- **Phase 1** harus pertama — semua refactor handler bergantung padanya
- **Phase 2** independen dari Phase 1 — bisa dikerjakan parallel
- **Phase 3** butuh Phase 2 selesai (typed constants agar query baru rapi)
- **Phase 4** butuh Phase 3 selesai (method repository baru untuk transaction)
- **Phase 5** paling independen — bisa dikerjakan kapan saja

---

## Distribusi Temuan per Phase

| Severity | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Phase 5 | Total |
|----------|:-------:|:-------:|:-------:|:-------:|:-------:|:-----:|
| 🔴 Critical | 3 | 0 | 2 | 0 | 0 | 5 |
| 🟠 High | 1 | 2 | 1 | 3 | 0 | 7 |
| 🟡 Medium | 1 | 1 | 3 | 1 | 1 | 7 |
| 🔵 Minor | 0 | 3 | 0 | 0 | 1 | 4 |
| **Total** | **5** | **6** | **6** | **4** | **3** | **23** |
