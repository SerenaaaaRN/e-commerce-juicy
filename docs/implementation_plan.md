# Implementation Plan - Admin Dashboard for Juicy

This plan details the design and implementation of the Admin Dashboard for the **Juicy** storefront. It will align with the existing Golang Gin backend routes (per `API.md`) and adhere to the project's hybrid domain-based structure, zinc styling with terracotta accents, and strict type-safety.

## User Review Required

> [!IMPORTANT]
> **Strict Coding Rules Verified & Followed:**
> - Always use arrow function components (e.g. `export const ProductsPage = () => { ... }`).
> - Always use `type` for props (never `interface`).
> - Use absolute imports (e.g. `@/components/...`) — never relative imports that go up more than one level.
> - Never hardcode raw HTML equivalents of existing components (use `Button`, `Badge`, `Card`, etc.).
> - Separate business logic from UI components: API fetching and status changes will be kept clean and modular.
> - No `any` type in TS files.

## Proposed Changes

We will implement the complete administrative suite in the frontend. Since Phase 3 items are already listed as checked in `TASKS.md` but their source code is missing from the directory, we will construct them cleanly.

---

### 🔑 1. API and Auth Infrastructure

#### [MODIFY] [client.ts](file:///d:/Study/backend/juicy/juicy/src/lib/api/client.ts)
We will update the admin Axios client to handle request interceptors (injecting the `Authorization: Bearer <adminToken>`) and response interceptors (catching `401 Unauthorized` and logging out the admin automatically to keep store state synced).

#### [MODIFY] [admin.ts](file:///d:/Study/backend/juicy/juicy/src/lib/api/admin.ts)
We will expand the API client to include all admin operations:
- **Auth**: `login`, `logout`, `refresh`
- **Analytics**: `getOverview` (`/admin/analytics/overview`), `getChart` (`/admin/analytics/orders/chart`)
- **Categories**: `getCategories`, `createCategory`, `updateCategory`, `deleteCategory`
- **Products**: `getProducts` (with query filters), `createProduct`, `updateProduct`, `deleteProduct`, `uploadImages`, `deleteImage`, `setPrimaryImage`
- **Variants**: `getVariants`, `addVariant`, `updateVariant`, `deleteVariant`
- **Orders**: `getOrders`, `getOrderDetail`, `updateOrderStatus`, `updateOrderPaymentStatus`
- **Customers**: `getCustomers`, `getCustomerDetail`, `toggleCustomerStatus`
- **Reviews**: `getReviews`, `toggleReviewPublish`, `deleteReview`

---

### 🛡️ 2. Route Guard & Main Routing

#### [NEW] [AdminRoute.tsx](file:///d:/Study/backend/juicy/juicy/src/features/admin/components/AdminRoute.tsx)
An arrow component route guard that checks `useAdminAuthStore.getState().isAuthenticated`. If authenticated, it renders children. Otherwise, it redirects to `/admin/login`.

#### [MODIFY] [App.tsx](file:///d:/Study/backend/juicy/juicy/src/App.tsx)
We will register the new admin pages under the `/admin` path namespace:
- `/admin/login` -> `LoginPage` (accessible to guests only, redirects if logged in)
- Protected under `AdminRoute` & `AdminLayout`:
  - `/admin/dashboard` -> `DashboardPage`
  - `/admin/products` -> `ProductsPage`
  - `/admin/orders` -> `OrdersPage`
  - `/admin/customers` -> `CustomersPage`
  - `/admin/reviews` -> `ReviewsPage`

---

### 🏛️ 3. Layout and Shell Components

#### [NEW] [AdminLayout.tsx](file:///d:/Study/backend/juicy/juicy/src/components/layout/AdminLayout.tsx)
A robust container layout utilizing the pre-installed shadcn `SidebarProvider`, `Sidebar`, and `SidebarInset` components.
- Sidebar menu options: **Dashboard**, **Products**, **Orders**, **Customers**, **Reviews**, **Back to Store**.
- A custom horizontal header containing a breadcrumb trailing indicator, a dark mode toggle, and a `ProfileDropdown` displaying the current admin user info and a sign-out trigger.

---

### 🖥️ 4. Administration Pages

#### [NEW] [LoginPage.tsx](file:///d:/Study/backend/juicy/juicy/src/features/admin/LoginPage.tsx)
A premium editorial auth screen with terracotta color scheme accents, custom credentials fields using shadcn `InputGroup`, `Input`, and `Button` components.

#### [NEW] [DashboardPage.tsx](file:///d:/Study/backend/juicy/juicy/src/features/admin/DashboardPage.tsx)
An analytics dashboard:
- Top metrics row showing **Revenue**, **Orders**, **New Customers**, and **Out-of-stock items** using the concurrent Gin analytical endpoint data.
- Dual interactive Recharts visualizations: a beautiful Bar chart showing monthly revenue, and a smooth spline Area chart showing order counts.
- A list of recent sales or top products.

#### [NEW] [ProductsPage.tsx](file:///d:/Study/backend/juicy/juicy/src/features/admin/ProductsPage.tsx)
A product inventory console using a paginated data table:
- A custom "Add Product" drawer/dialog with form fields (name, slug, description, category, base price, compare price, availability, featured toggles).
- **Variant Manager**: Create variant combinations of (Size, Color, Hex Code, SKU, Stock, and Price offset) on-the-fly inside the dialog.
- **Cloudinary Image Panel**: Drag-and-drop file uploader supporting multi-image upload directly to Cloudinary, with ability to change order or set primary.

#### [NEW] [OrdersPage.tsx](file:///d:/Study/backend/juicy/juicy/src/features/admin/OrdersPage.tsx)
An order fulfillment center:
- Data table listing order number, buyer email, status badge, total, and created date.
- Detail drawer containing snapshotted products (sizes/colors/thumbnails), delivery address, buyer notes, and tracking dates.
- Status and payment step controllers to easily mark orders as *Confirmed*, *Processing*, *Shipped*, or *Delivered*.

#### [NEW] [CustomersPage.tsx](file:///d:/Study/backend/juicy/juicy/src/features/admin/CustomersPage.tsx)
A customer relations table:
- Customer grid containing full name, email, order count, total amount spent, and sign-up date.
- Status toggle to suspend or reactivate customer accounts.
- Detail panel displaying historically placed orders.

#### [NEW] [ReviewsPage.tsx](file:///d:/Study/backend/juicy/juicy/src/features/admin/ReviewsPage.tsx)
A product review management board:
- Product filter dropdown, rating selector, and publish/unpublish filters.
- List displaying reviewer name, comment body, ratings stars, and publish status.
- Action triggers to toggle publishing or delete malicious ratings.

---

## Verification Plan

### Automated Verification
- We will execute the TypeScript typecheck (`powershell -ExecutionPolicy Bypass -Command "npm run typecheck"`) to ensure 100% type safety.
- We will run a production build test (`powershell -ExecutionPolicy Bypass -Command "npm run build"`) to check for packing errors.

### Manual Verification
- We will review DOM elements, styles, absolute imports, and arrow-function conventions to confirm strict compliance with the project guidelines.
