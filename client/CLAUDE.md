# CLAUDE.md — JUICY Client Project

## Ringkasan

React SPA e-commerce fashion premium (Champagne Gold branding) dengan dua portal:
**Customer Portal** (toko online) dan **Admin Portal** (manajemen toko).
Tema "Quiet Luxury" dengan aksen gold, zero-radius, grain texture, dan font Inter + Playfair Display.

---

## 👑 Tech Stack Lengkap

### Core
- **React** 19 (StrictMode, useTransition, useDeferredValue, lazy, Suspense)
- **TypeScript** 5 (type inference dari Zod, `as const` untuk konstanta)
- **Vite** (bundler, env var via `import.meta.env`)
- **React DOM** 19 (`createRoot`)

### Styling
- **Tailwind CSS v4** (`@import "tailwindcss"`) dengan **Oklch** color space
- **tw-animate-css** — utility animasi Tailwind
- **shadcn/tailwind.css** — base theme shadcn/ui
- **Custom CSS variables** di `:root` / `.dark` untuk semua token warna
- **Zero radius** (`--radius: 0rem`) — square aesthetic

### State Management
| Concern | Tool | Keterangan |
|---|---|---|
| Server state | **TanStack React Query v5** | staleTime 30s, gcTime 5m, refetchOnWindowFocus: false |
| Client state (auth) | **Zustand** + `persist` middleware | localStorage via `partialize` |
| Theme state | **Zustand** (no persist) | Manual localStorage + cross-tab sync |
| Form state | **react-hook-form** + `@hookform/resolvers/zod` | ZodResolver |

### Routing
- **react-router-dom v6** — BrowserRouter, Routes, Route, Outlet, useParams, useSearchParams, useNavigate, useLocation, Link, Navigate
- **Route config array** (`RouteConfig[]`) + recursive `renderRoutes()` — bukan JSX tree

### HTTP Client
- **Axios** — 2 instance terpisah dengan interceptor berbeda:
  - `adminClient.ts` → 401 silent refresh via `/admin/refresh`, queue concurrent failed requests
  - `customerClient.ts` → 401 auto-logout langsung
  - `baseURL` dari `VITE_API_BASE_URL` (fallback `http://localhost:8080/api`)

### Form & Validasi
- **Zod** — schema validasi runtime + type inference
- **react-hook-form** dengan `zodResolver`
- Password strength: `^ (?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$`

### Animation
- **Motion** (Framer Motion v12 / `motion/react`):
  - `useScroll`, `useTransform`, `useSpring` — scroll-based parallax
  - `AnimatePresence` — entry/exit transitions
  - `whileInView` — viewport-triggered reveals
  - `Variants` — `staggerContainer`, `fadeInUp`, `fadeIn`, `slideDown`, `heroSlideUp`
- **Lenis** — smooth scroll wrapper (`lerp: 0.08`, `duration: 1.2`)
- **CSS `@keyframes marquee`** — promo strip infinite scroll

### UI Component Library
- **Shadcn/ui** (Radix primitives + CVA + Tailwind) — 30+ komponen:
  `accordion`, `alert-dialog`, `alert`, `badge`, `breadcrumb`, `button`, `card`, `carousel`,
  `checkbox`, `collapsible`, `dialog`, `dropdown-menu`, `empty`, `field`, `input`, `label`,
  `pagination`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `sonner`, `spinner`,
  `table`, `tabs`, `textarea`, `toggle-group`, `toggle`, `tooltip`
- **Empty component** — design system internal (`Empty`, `EmptyContent`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, `EmptyDescription`)

### Icons
- **@hugeicons/react** + **@hugeicons/core-free-icons** — all icons throughout app
- Impor ikon individual (tree-shakeable): `HeartAddIcon`, `ShoppingBag01Icon`, `SearchIcon`, `Cancel01Icon`, `ArrowRight01Icon`, etc.

### Charts (Admin Only)
- **Recharts**: `BarChart`, `AreaChart`, `ResponsiveContainer`, `Tooltip`, `XAxis`, `YAxis`, `CartesianGrid`, `Bar`, `Area`, `defs`/`linearGradient`

### Utilities
- **clsx** + **tailwind-merge** → `cn()` function
- **Intl.NumberFormat** → `formatPrice()` (IDR, no fraction)
- **Intl.DateTimeFormat** → `formatDate()` (id-ID locale)
- **sonner** → `toast.success()` / `toast.error()` notifications

### Package.json Scripts (expected)
`npm run dev`, `npm run build`, `npm run lint`, `npm run preview`

### Env Variables
- `VITE_API_BASE_URL` — API base URL. Fallback: `http://localhost:8080/api`

### Fonts
- **Inter** (sans-serif, body) via `@fontsource/inter`
- **Playfair Display** (serif/heading) via `@fontsource/playfair-display`
- CSS custom properties: `--font-sans`, `--font-heading`, `--font-serif`

---

## 📁 Project Structure Lengkap

```
client/src/
│
├── App.tsx                          # Root: BrowserRouter + TooltipProvider
│   ├── ScrollToTop                  #   window.scrollTo(0,0) on pathname change
│   ├── renderRoutes()               #   recursive RouteConfig[] → <Route> elements
│   └── AppContent                   #   auth init (validate session), cart/wishlist data preload, <Routes> + Toaster
│
├── main.tsx                         # Entry: StrictMode > QueryClientProvider > ThemeProvider > App + ReactQueryDevtools
│   └── QueryClient config:          #   staleTime: 30_000, gcTime: 300_000, refetchOnWindowFocus: false
│
├── index.css                        # Tailwind v4 import, Oklch theme, keyframes, utilities
│   ├── :root                        #   Light theme — Background oklch(0.995), Primary Champagne Gold oklch(0.75 0.07 85)
│   ├── .dark                        #   Dark theme — Background oklch(0.141), Primary Gold brighter oklch(0.78 0.08 85)
│   ├── @theme inline                #   CSS variable mapping ke Tailwind utilities
│   ├── @keyframes marquee           #   30s linear infinite horizontal scroll
│   ├── .bg-grain::after             #   SVG feTurbulence noise overlay (opacity 0.035, mix-blend overlay)
│   └── .accent-line-gold            #   Gradient line (transparent → gold → transparent)
│
├── types/index.ts                   # Global domain types — NO framework types here
│   ├── ApiError, ApiResponse<T>, PaginatedResponse<T>  # API wrapper types
│   ├── Category                     #   id, name, slug, description, parent_id, children, product_count
│   ├── ProductImage                 #   id, image_url, is_primary, display_order
│   ├── ProductVariant               #   id, size, color, stock, additional_price, is_active
│   ├── CatalogProduct               #   List view: price, primary_image, category_name, avg_rating, review_count
│   ├── ProductDetail                #   Detail view: images[], variants[], full category object
│   ├── Customer                     #   id, full_name, email, phone, is_active, order_count, total_spent
│   ├── Address                      #   label, recipient_name, phone, address_line, city, province, postal_code, is_default
│   ├── CartItem                     #   variant_id, product_name, variant_size/color, image_url, unit_price, quantity, subtotal
│   ├── Cart                         #   items[], total
│   ├── OrderStatus                  #   "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "returned"
│   ├── PaymentStatus                #   "unpaid" | "paid" | "refunded"
│   ├── Order                        #   id, order_number, status, payment_status, total, created_at
│   ├── OrderDetail                  #   + subtotal, shipping_fee, notes, items[], address, shipped_at, delivered_at
│   ├── OrderItem                    #   product_name, variant_size/color, quantity, unit_price, subtotal
│   ├── Review                       #   rating, body, customer_name, is_published, created_at
│   ├── AdminOrder                   #   Customer-specific: + customer_name, customer_email
│   └── AdminReview                  #   + product_id, product_name, customer_name, customer_email
│
├── constants/
│   ├── paths.ts                     # ROUTES object `as const` — 23 path literals
│   ├── routes.tsx                   # RouteConfig[] — declarative route tree (2 portal layouts + admin guard)
│   │   └── RouteConfig             #   { path?, index?, element?, hideNavFooter?, children? }
│   └── order-status.ts             # Label/badge/color/step maps untuk OrderStatus & PaymentStatus
│       ├── ORDER_STATUS_LABELS      #   "pending" → "Pending Confirmation", etc.
│       ├── STATUS_BADGE             #   Setiap status → { label, variant: BadgeVariant }
│       ├── getOrderStatusColor()   #   CSS class strings (custom bg/text/border per status)
│       └── ORDER_STEPS             #   ["pending", "confirmed", "processing", "shipped", "delivered"]
│
├── components/
│   ├── common/
│   │   ├── ProductCard.tsx          # Catalog product card: hover crossfade 2 images, category badge, serif name, price
│   │   ├── StarRating.tsx           # 1-5 star display + interactive mode (hover scale animation)
│   │   ├── AddressForm.tsx          # Full address form: label, recipient, phone, address, city/prov/postal (3-col grid)
│   │   ├── ErrorMessage.tsx         # Alert-destructive with icon, title, message, optional retry button
│   │   ├── LoadingSkeleton.tsx      # ProductGridSkeleton: grid skeleton items with Skeleton component
│   │   └── ProtectedRoute.tsx       # Auth guard: redirect to /login if not authenticated, else Outlet/children
│   │
│   ├── layout/
│   │   ├── Navbar.tsx               # Fixed top navbar (transparent→solid on scroll)
│   │   │   ├── NAV_LINKS:           #   ["Atelier"→/ , "Shop"→/shop, "Heritage"→/heritage]
│   │   │   ├── Category ribbon      #   Appears on scroll: root categories as chip links
│   │   │   ├── Search:             #   AnimatePresence expand, form → useSearchSync
│   │   │   ├── Cart badge:         #   Item count from useCartQuery, conditional render
│   │   │   ├── Wishlist link
│   │   │   └── UserMenu trigger
│   │   ├── Footer.tsx               # bg-foreground text-background: brand intro, socials, category links, copyright
│   │   ├── BottomNav.tsx            # Fixed mobile bottom nav (lg:hidden): Home, Shop, Cart badge, Wishlist, Profile
│   │   ├── MobileDrawer.tsx         # Slide-in left drawer (85% width, max 320px): search, nav links, categories grid
│   │   ├── UserMenu.tsx             # DropdownMenu: authenticated → name/email, Settings, Orders, Logout (destructive)
│   │   ├── PublicLayout.tsx          # Wrapper: SmoothScroll > Navbar + Outlet + Footer + BottomNav
│   │   ├── AdminLayout.tsx          # SidebarProvider + collapsible sidebar + header + main area > Outlet
│   │   │   ├── Sidebar:            #   JUICY logo, Console Suite collapsible, 5 menu items, Back to Store, admin info
│   │   │   └── Main header:        #   Dynamic title from pathname, user dropdown with Sign Out
│   │   └── SmoothScroll.tsx         # Lenis wrapper (lerp 0.08, duration 1.2, touch 1.5)
│   │
│   └── ui/                          # 30+ Shadcn/ui components (Radix + CVA)
│       └── empty.tsx                # Custom design system: Empty, EmptyContent, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription
│
├── hooks/                           # Global custom hooks
│   ├── useAuth.ts                   # Thin wrapper: { isLoggedIn, customer, logout } dari Zustand → useMemo
│   ├── useDebounce.ts               # Generic debounce hook, default 300ms
│   ├── useConfirm.tsx               # Promise-based confirm dialog: { confirm(msg), dialog } → AlertDialog
│   ├── useMobile.ts                 # window.matchMedia(767px) → isMobile boolean
│   ├── useRecentlyViewed.ts         # localStorage (juicy_recently_viewed:v1), max 4 items, dedup by slug
│   └── useSearchSync.ts            # URL searchParams ↔ query state, debounce 300ms, navigate to /shop
│
├── stores/                          # Zustand stores
│   ├── customer-auth-store.ts       # persist localStorage "juicy-customer-auth" v1
│   │   └── state:                  #   token, customer, isAuthenticated, isLoading, error
│   │       actions:                #   login(), logout(), setLoading(), setError()
│   │       partialize:             #   only token + customer + isAuthenticated persisted
│   ├── admin-auth-store.ts          # persist localStorage "juicy-admin-auth" v1
│   │   └── state:                  #   token, admin (id/email/name), isAuthenticated
│   │       actions:                #   login(), logout()
│   └── theme-store.ts               # no persist middleware, manual localStorage
│       ├── config:                 #   storageKey, defaultTheme, disableTransitionOnChange
│       ├── getSystemTheme()        #   matchMedia("prefers-color-scheme: dark")
│       ├── applyThemeToDOM()       #   toggle class "dark"/"light" on <html>, optional CSS transition disable
│       ├── initThemeStore()        #   One-time init: merge config + apply initial theme
│       └── disableTransitionsTemporarily()  #   Inject style *{transition:none!important}, remove after 2 rAF
│
├── provider/
│   └── theme-provider.tsx           # No React Context — uses Zustand directly
│       ├── initThemeStore on mount  #   via useRef guard
│       ├── matchMedia listener      #   Re-apply "system" when OS preference changes
│       ├── "d" key shortcut         #   Toggle dark/light (ignore in editable elements)
│       ├── cross-tab storage sync   #   StorageEvent listener
│       └── useTheme() hook          #   { theme, setTheme } convenience wrapper
│
├── lib/
│   ├── utils/
│   │   ├── cn.ts                    # cn() = clsx + tailwind-merge
│   │   └── format.ts               # formatPrice(IDR), formatDate(id-ID)
│   ├── animations.ts                # Motion configs + Variants
│   │   ├── editorialSpring         #   stiffness: 70, damping: 15, mass: 0.8
│   │   ├── tactileBounce           #   stiffness: 250, damping: 18
│   │   ├── parallaxSpring          #   stiffness: 45, damping: 15
│   │   ├── scrollSpring            #   stiffness: 100, damping: 30
│   │   ├── ghostReveal             #   stiffness: 60, damping: 20, mass: 1.2
│   │   ├── staggerContainer        #   staggerChildren: 0.05, delayChildren: 0.05
│   │   ├── fadeInUp                #   opacity 0→1, y 20→0, ease [0.16, 1, 0.3, 1]
│   │   ├── fadeIn                  #   opacity 0→1, same easing
│   │   ├── slideDown               #   y -20→0 with editorialSpring + exit animation
│   │   └── heroSlideUp             #   y 100%→0 with editorialSpring
│   ├── utils.ts                     # Barrel re-export
│   └── api/
│       ├── index.ts                 # Barrel re-export: adminApi, customerApi, cartApi, ordersApi, productApi, wishlistApi, client, customerClient
│       ├── adminClient.ts           # Axios instance + 401 queue + refresh token
│       │   ├── baseURL:            #   VITE_API_BASE_URL (auto-suffix /api) + withCredentials: true
│       │   ├── req interceptor:    #   Inject Bearer token from admin-auth-store
│       │   ├── failedQueue:        #   Queue concurrent 401 requests during refresh
│       │   └── res interceptor:    #   401 → POST /admin/refresh → processQueue → retry OR logout
│       ├── customerClient.ts        # Axios instance + 401 auto-logout
│       │   ├── baseURL:            #   VITE_API_BASE_URL
│       │   ├── req interceptor:    #   Inject Bearer token from customer-auth-store
│       │   └── res interceptor:    #   401 → logout() immediately
│       ├── admin.ts                 # adminApi — semua endpoint admin
│       │   ├── Auth:               #   login, refresh, logout
│       │   ├── Analytics:          #   getAnalyticsOverview, getAnalyticsOrdersChart
│       │   ├── Categories:         #   CRUD categories
│       │   ├── Products:           #   CRUD products + getProductByID
│       │   ├── Images:            #   upload (multipart), add URL, delete, set primary
│       │   ├── Variants:          #   CRUD variants per product
│       │   ├── Orders:            #   list, detail, update status, update payment
│       │   ├── Customers:         #   list, detail (with order history), toggle status
│       │   └── Reviews:           #   list, toggle publish, delete
│       │   └── Types exported:     #   AnalyticsOverview, AnalyticsChartItem, ProductQueryParams, OrderQueryParams, CustomerQueryParams, ReviewQueryParams
│       ├── customer.ts              # customerApi — auth & profile
│       │   └── endpoints:          #   login, register, getProfile, updateProfile, changePassword
│       ├── cart.ts                  # cartApi
│       │   └── endpoints:          #   getCart, addItem, updateQuantity, removeItem, clearCart
│       ├── orders.ts                # ordersApi
│       │   └── endpoints:          #   addresses CRUD + default, checkout, customerOrders, orderDetail, cancelOrder, completeOrder, submitReview
│       ├── products.ts              # productApi — public shop
│       │   └── endpoints:          #   getCategories, getProducts, getProductBySlug, getProductReviews
│       └── wishlist.ts              # wishlistApi
│           └── endpoints:          #   getWishlist, checkWishlist, addItem, removeItem
│           └── WishlistItem type    #   variant_id, product info, stock, prices
│
├── features/
│   ├── auth/
│   │   ├── validations.ts          # loginSchema + registerSchema (Zod)
│   │   ├── types.ts                # LoginFormValues, RegisterFormValues (z.infer)
│   │   ├── components/LoginForm.tsx # Reusable form: react-hook-form, custom labels, OAuth toggle, forgot password
│   │   ├── components/RegisterForm.tsx # Register form: 2-col grid for password/confirmPassword
│   │   ├── LoginPageCust.tsx       # Customer login: guard redirect, useTransition, toast, Zustand store
│   │   ├── LoginPageAdmin.tsx      # Admin login: same pattern dengan adminApi + admin store
│   │   └── RegisterPage.tsx        # Register: redirect ke login after success
│   │
│   ├── shop/
│   │   ├── types.ts                # SortOption = "price_asc" | "price_desc" | "newest" | "popular"
│   │   ├── hooks/useProductQueries.ts  # 7 React Query hooks:
│   │   │   ├── useCategoriesQuery          #  queryKey: ["categories"]
│   │   │   ├── useProductsQuery(params, enabled?)  #  queryKey: ["products", params]
│   │   │   ├── useFeaturedProductsQuery()  #  featured: true, per_page: 8
│   │   │   ├── useProductQuery(slug)       #  queryKey: ["product", slug], enabled: !!slug
│   │   │   ├── useProductReviewsQuery(slug, page, perPage) #  queryKey: ["reviews", slug]
│   │   │   ├── useSubmitReviewMutation()   #  invalidateQueries reviews
│   │   │   └── useInfiniteProductsQuery(params) #  useInfiniteQuery, getNextPageParam from meta
│   │   ├── CollectionPage.tsx      # Katalog: searchParams-based filters, pagination + infinite scroll toggle
│   │   │   ├── URL params:        #   category, sort, page, sizes, search
│   │   │   ├── Grid toggle:       #   2-col / 4-col
│   │   │   ├── Infinite scroll:   #   IntersectionObserver sentinelRef
│   │   │   └── Mobile:           #   Filter dalam Sheet (left drawer)
│   │   ├── ProductPage.tsx        # PDP: breadcrumb, gallery, info, variant selector, reviews, add-to-cart + wishlist
│   │   │   ├── Recently viewed:  #   useRecentlyViewed on mount
│   │   │   ├── Variant state:    #   selectedSize + selectedColor, stock validation
│   │   │   ├── AddToCartButton:  #   local component, loading/disabled/out-of-stock states
│   │   │   └── Auth guard:       #   redirect to /login if not authenticated
│   │   ├── components/
│   │   │   ├── ProductGrid.tsx    #       Grid dengan skeleton loading, empty state, AnimatePresence
│   │   │   ├── ProductFilters.tsx #       Accordion: categories tree (recursive), sizes (multi ToggleGroup), sort (single)
│   │   │   ├── ProductImageGallery.tsx #  Thumbnail rail + main image with fade transition
│   │   │   ├── ProductInfo.tsx    #       Badge kategori, star rating, price (with compare-at), description
│   │   │   ├── VariantSelector.tsx #      Size + color ToggleGroup, stock validation, cross-variant disable
│   │   │   └── ReviewsSection.tsx #       Aggregated score, paginated reviews, loading/empty states
│   │
│   ├── home/
│   │   ├── HomePage.tsx           # Lazy load 3 sections via React.lazy + Suspense
│   │   └── components/
│   │       ├── HeroSection.tsx    #       Full-screen video bg, word-by-word text reveal (Motion), CTA
│   │       ├── PromoStrip.tsx     #       CSS marquee (30s infinite): Free Shipping, Summer Sale, Linen Edition, Easy Returns
│   │       ├── ArtisanStorytelling.tsx # 400vh container, sticky, 500vw horizontal scroll track, 5 panels
│   │       │                       #       useScroll + useTransform + useSpring for smooth horizontal drag
│   │       │                       #       Parallax horizontal per-panel image (opposite direction)
│   │       │                       #       Scroll progress bar at bottom
│   │       ├── CollectionGrid.tsx #       3-col desktop parallax grid (masing-masing kolom kecepatan Y berbeda)
│   │       │                       #       Mobile: 1-col flat staggered layout
│   │       │                       #       yLeft: +100→-100, yCenter: -30→+30, yRight: +200→-200
│   │       └── Heritage.tsx       #       Parallax image background (y: -10%→+10%), stat counters (1847, 5 Gen, 200+ Hours)
│   │
│   ├── category/
│   │   ├── CategoryLandingPage.tsx # Halaman per kategori: loading/not-found/empty states
│   │   └── components/
│   │       ├── CategoryHero.tsx    #     Background image per slug (apparel/bags/shoes/accessories/beauty), gradient overlay
│   │       ├── SubcategoryGrid.tsx #     Grid subkategori card (conditional render if none)
│   │       ├── CategoryProducts.tsx #    Max 8 produk, grid 2-4 col, "Lihat Semua" → /shop?category=
│   │       └── CategoryPromoBanner.tsx # Banner promosi bawah
│   │
│   ├── cart/
│   │   ├── hooks/useCartQueries.ts   # useCartQuery(cart), queryKey: ["cart"], enabled flag
│   │   ├── hooks/useCartMutations.ts # 4 mutations: add, updateQuantity, remove, clearCart
│   │   │                             #   Semua invalidateQueries(["cart"]) on success
│   │   ├── CartPage.tsx              # Auth guard, 8+4 grid layout, derived subtotal
│   │   └── components/
│   │       ├── CartItem.tsx          # Quantity stepper (minus/number/plus), image 3/4 aspect, subtotal
│   │       ├── CartSummary.tsx       # Card: subtotal, free shipping, grand total, checkout button
│   │       └── EmptyCart.tsx         # Empty component + "Shop the Collection" CTA
│   │
│   ├── checkout/
│   │   ├── CheckoutPage.tsx         # Multi-step: address selection (or add new) + payment method + place order
│   │   └── components/
│   │       ├── AddressSelector.tsx  # ToggleGroup dari daftar alamat + add new button
│   │       ├── OrderSummary.tsx     # List item + totals
│   │       └── PaymentSelector.tsx  # COD only (MVP)
│   │
│   ├── orders/
│   │   ├── types.ts                 # OrderTimelineStep
│   │   ├── hooks/useOrderQueries.ts # 4 hooks: useCustomerOrdersQuery, useOrderDetailQuery, useCompleteOrderMutation, useCancelOrderMutation
│   │   ├── OrderHistoryPage.tsx     # Daftar order cards, auth guard, empty state
│   │   ├── OrderTrackingPage.tsx    # Detail tracking: timeline, items, address, price, confirm/cancel buttons
│   │   └── components/
│   │       ├── OrderCard.tsx        # Card ringkasan: ref number, badge, date, total, Track Order link
│   │       ├── OrderItemRow.tsx     # Product image, name, size/color, qty, price; "Write Review" if delivered
│   │       ├── OrderStatusTimeline.tsx # Horizontal numbered steps: pending→confirmed→processing→shipped→delivered
│   │       │                         #       Animated ping on active step, filled progress bar
│   │       └── WriteReviewCta.tsx   # Dialog modal: StarRating interactive + textarea + submit
│   │
│   ├── profile/
│   │   ├── hooks/useProfileQueries.ts # 5 hooks: updateProfile, changePassword, addresses query, deleteAddress, setDefaultAddress
│   │   ├── ProfilePage.tsx          # Tabs: Personal Details, Security, Saved Destinations
│   │   └── components/
│   │       ├── EditProfileForm.tsx  # Email (read-only), full_name, phone; update Zustand store on success
│   │       ├── ChangePasswordForm.tsx # current_password, new_password, confirm; min 8 chars
│   │       ├── AddressList.tsx      # Grid of AddressCards + New Address button + Empty state
│   │       ├── AddressCard.tsx      # Label, default badge, recipient, full address, phone, actions (set default/edit/delete)
│   │       └── AddressFormModal.tsx # Dialog wrapping AddressForm (create/edit mode)
│   │
│   ├── wishlist/
│   │   ├── hooks/useWishlistQueries.ts   # useWishlistQuery: returns { items, wishlistIds (Set<variant_id>) }
│   │   ├── hooks/useWishlistMutations.ts # addItem, removeItem → invalidateQueries(["wishlist"])
│   │   └── WishlistPage.tsx         # Grid cards: product image, size/color, price, remove button + empty state
│   │
│   ├── heritage/
│   │   └── HeritagePage.tsx         # 7-section brand storytelling: Hero, Intro, Timeline (alternating), Values (3 cards), Craftsmen (3 profiles, grayscale hover), Quote, CTA
│   │
│   └── admin/
│       ├── types.ts                 # ProductFormValues, VariantFormValues, CategoryFormValues, LoginFormValues, ClientStatistics
│       ├── validations.ts           # Zod: productSchema, variantSchema, categorySchema
│       ├── utils.ts                 # buildCategoryOptions (tree→flat with depth), getCategoryDescendants (recursive children)
│       ├── DashboardPage.tsx        # 4 stat cards (revenue, orders, customers, stocks) + 2 Recharts (bar revenue, area orders)
│       │                           #   Fetch via useEffect + useTransition, not React Query
│       │                           #   Loading spinner, error fallback
│       ├── ProductsPage.tsx         # Tab Products + Categories: CRUD tables, search filter, dialogs, memo rows
│       │                           #   ProductRow (memo): image, name, category, price, status, actions
│       │                           #   CategoryRow (memo): name, slug, parent, order, actions
│       ├── OrdersPage.tsx           # Order table: invoice, fulfillment/payment badges, items, amount, date + detail dialog
│       │                           #   Search by invoice, filter by status
│       │                           #   Detail dialog: line items, totals, address, update status/payment buttons
│       ├── CustomersPage.tsx        # Customer table: avatar initial, name, email, phone, date, orders count, spent, status badge
│       │                           #   Detail dialog: order history, toggle active/suspend with confirm
│       ├── ReviewsPage.tsx          # Review cards: filter by rating + publish status, publish/censor toggle, delete
│       └── components/
│           ├── AdminRoute.tsx       # Guard: redirect to /admin/login if not authenticated
│           ├── PageHeader.tsx       # h1 title + description + optional action slot
│           ├── SearchInput.tsx      # Input with search icon, wrapped
│           ├── DataEmpty.tsx        # EmptyState: TableRow (in table) or Card variant
│           ├── FullPageSpinner.tsx  # Centered spinner with label
│           ├── DefferedContainer.tsx # Opacity 0.6 when data stale (useDeferredValue)
│           ├── ProductFormDialog.tsx # react-hook-form: name (auto-slug), category select (nested), price, compare price, tags, description, checkboxes
│           ├── VariantManagerDialog.tsx # Form panel + list panel: size, color, stock, additional price, edit/delete
│           └── ImageManagerDialog.tsx   # Upload files (multipart) + URL input, grid thumbnails, set primary, delete
│       └── hooks/
│           ├── useProducts.ts        # 2 queries + 6 mutations: CRUD produk & kategori, 2 useForm instances
│           ├── useVariants.ts        # Query variants + save/delete mutations, optimistic activeProduct update
│           ├── useProductImages.ts   # 4 mutations: upload, add URL, set primary, delete; optimistic local state
│           ├── useOrders.ts          # Query orders + detail fetch + 2 mutations (status + payment) with optimistic update
│           ├── useCustomers.ts       # Query customers + detail fetch + toggleStatus mutation
│           ├── useReviews.ts         # Query reviews + togglePublish + delete mutations
│           └── useDataTableFilter.ts # Generic filter: search state → useDeferredValue → useMemo filter → { filteredData, isStale }
```

---

## 🏛️ Arsitektur & Pola

### Dua Portal SPA
- **Customer**: `PublicLayout` → `SmoothScroll` > `Navbar` + `Outlet` + `Footer` + `BottomNav`
  - Navbar/Footer disembunyikan di halaman login/register via `HIDE_NAV_FOOTER Set<string>`
- **Admin**: `AdminLayout` → `SidebarProvider` > collapsible sidebar + header + `<Outlet />`
  - Dilindungi oleh `AdminRoute` wrapper
  - Router: declarative `RouteConfig[]` di `routes.tsx` → recursive `renderRoutes()` loop

### State Management Flow
- **Server data** → React Query (`useQuery` / `useMutation` / `useInfiniteQuery`)
- **Client session** → Zustand (`useCustomerAuthStore`, `useAdminAuthStore`, `useThemeStore`)
- **No React Context** — `ThemeProvider` tidak menggunakan Context, membaca Zustand langsung
- **Auth initialization** → `App.tsx` `useEffect`: validasi token via `customerApi.getProfile()`, logout jika gagal

### Data Flow Triad
```
Halaman → hooks/use*Queries (read) + hooks/use*Mutations (write)
         → lib/api/* (Axios call)
         → Zustand stores (auth/tokens)
         → React Query cache → UI re-render otomatis
```

### Query & Mutation Naming Convention
- File dipisah: `use<Domain>Queries.ts` + `use<Domain>Mutations.ts`
- Query key pattern: `["domain"]`, `["domain", id]`, `["domain", id, { filters }]`
- Setiap mutation → `onSuccess`: `invalidateQueries({ queryKey: [...] })` untuk refetch
- Optimistic update: `useOrders` (status/payment), `useProductImages` (setPrimary, delete), `useVariants` (add/delete)

### Form Pattern
```
validations.ts (Zod schema)          → single source of truth
types.ts (z.infer)                   → inferred TypeScript types
component (useForm + zodResolver)   → react-hook-form
useTransition OR mutation.isPending → loading state
sonner toast                        → success/error feedback
```

### Client-side Filtering Pattern (Admin)
```
useDataTableFilter<T>(data, filterFn)
  → search state (real-time)
  → useDeferredValue untuk performa
  → useMemo filter → { filteredData, isStale }
  → DefferedContainer visual feedback (opacity)
```

### Admin Hooks Pattern (CRUD)
Setiap hook admin mengembalikan `{ data, loading, state, handlers, mutations }`:
- `useProducts()` → products, categories, 2 forms, CRUD handlers, dialog states
- `useOrders()` → orders list, order detail, status/payment mutations with optimistic rollback
- `useCustomers()` → customers list, customer detail + history, toggleStatus
- `useVariants(activeProduct, setActiveProduct)` → parent-driven state (inversion)
- `useProductImages(activeProduct, setActiveProduct)` → parent-driven state
- `useReviews()` → reviews list, togglePublish, delete

### Animation Strategy
| Teknik | Use Case |
|---|---|
| `motion/react` | Most animations (hero reveal, horizontal scroll, parallax, stagger grid, fade-in views) |
| `useScroll` + `useTransform` | Parallax Y (CollectionGrid 3-col, Heritage), horizontal scroll (ArtisanStorytelling) |
| `useSpring` | Smooth scroll-based transforms (prevents jank) |
| `AnimatePresence` | Search bar expand, product grid transitions, filter transitions |
| `whileInView` | Footer sections, Heritage stats, fade-in sections |
| CSS `animate-marquee` | Promo strip (infinite horizontal scroll) |
| Lenis | Global smooth scroll wrapper |
| `disabledTransitionsTemporarily` | Theme toggle without CSS transitions (theme-store.ts) |

### Theme System
- **CSS custom properties** di `:root` (light) dan `.dark` menggunakan Oklch
- **Class-based**: toggle `.dark` pada `<html>`, class-aware di Tailwind via `@custom-variant dark`
- **Gold tokens**: `--color-gold`, `--color-gold-muted`, `--color-gold-subtle`
- **Grain texture**: SVG feTurbulence overlay via `.bg-grain::after`
- **Keyboard shortcut**: tekan `d` untuk toggle (skip jika dalam input/textarea)
- **Cross-tab sync**: StorageEvent listener → update store
- **System preference listener**: matchMedia → re-apply "system" theme on change
- **Initialization**: `initThemeStore()` on mount via ThemeProvider

### API Response Shape
```typescript
ApiResponse<T> = { success: boolean, data: T, message?: string, error?: ApiError }
PaginatedResponse<T> = ApiResponse & { data: T[], meta: { page, per_page, total, total_pages } }
```
Semua API call mengembalikan respons sebagai `response.data` (Axios) — kode status HTTP dicek via `success` field, bukan status code.

---

## 📐 Coding Conventions

### Components
- **Arrow function components**: `export const Foo = () => { ... }`
- **Named exports** preferred, some `export default` exist
- **File per component**: one component per file (except small inline ones like `NavLink`, `AddToCartButton`)
- **Props**: inline interface (no separate file), or `ComponentProps<"button">` extension
- **memo**: `ProductRow` (memo), `CategoryRow` (memo), `OrderRow` (memo), `CustomerRow` (memo) — di admin pages

### Types
- **`type` over `interface`** consistently
- **Zod inference**: `z.infer<typeof schema>` for form values
- **`as const`**: `ROUTES` object, `NAV_LINKS` array

### Imports Order
1. Eksternal (react, router, motion, etc.)
2. Internal UI (`@/components/ui/*`)
3. Internal fitur (`@/features/*`, `@/hooks/*`)
4. Internal lib (`@/lib/*`, `@/stores/*`)
5. Tipe (`@/types`)
6. Icon imports last

### CSS
- **Tailwind utility classes only** — no CSS modules, no styled-components
- **`cn()`** for conditional class merging
- **Custom CSS** only in `index.css` (keyframes, grain texture, theme variables)
- **Animation config** in `animations.ts` — reused across components

### Icons
- Hugeicons: `@hugeicons/core-free-icons` + `@hugeicons/react`
- Usage pattern: `import { IconName } from "@hugeicons/core-free-icons"` + `<HugeiconsIcon icon={IconName} className="..." />`
- Default `strokeWidth`: `ICON_STROKE = 1.5` (defined in Navbar.tsx)

### Error & Loading & Empty States (Required Per Page)
- **Loading**: `Spinner` component, `FullPageSpinner` (admin), `ProductGridSkeleton` (shop grid)
- **Error**: `ErrorMessage` with optional `onRetry`, or inline Alert destructive
- **Empty**: `Empty` design system component (`EmptyHeader`, `EmptyMedia`, `EmptyContent`, `EmptyTitle`, `EmptyDescription`) or `EmptyState` (admin table/card variant)
- **Auth guard**: conditional `<Navigate to={ROUTES.login} />` redirect
- **404 / not found**: inline fallback UI (e.g., "Product not found" in PDP, category empty state)
- **Optimistic UI**: update local state before server confirms, rollback on error (admin orders, images, variants)

### Toast Pattern
- `sonner` library: `toast.success("...")`, `toast.error("...")`
- Triggered in mutation `onSuccess` / `onError` callbacks
- Admin hooks: error toast di `onError`, success toast di `onSuccess`
- Auth pages: toast after API call in `useTransition`

### Confirm Delete Pattern
- `useConfirm()` hook → `const { confirm, dialog } = useConfirm()`
- Render `{dialog}` di komponen
- `await confirm("Are you sure...")` → if true, proceed with delete mutation

### Key Routes
| Path | Komponen |
|---|---|
| `/` | HomePage |
| `/shop` | CollectionPage |
| `/shop/:slug` | ProductPage |
| `/category/:slug` | CategoryLandingPage |
| `/cart` | CartPage |
| `/checkout` | CheckoutPage |
| `/orders` | OrderHistoryPage |
| `/orders/:orderNumber` | OrderTrackingPage |
| `/wishlist` | WishlistPage |
| `/profile` | ProfilePage |
| `/login` | LoginPageCust |
| `/register` | RegisterPage |
| `/heritage` | HeritagePage |
| `/admin/login` | LoginPageAdmin |
| `/admin/dashboard` | DashboardPage (guarded) |
| `/admin/products` | ProductsPage (guarded) |
| `/admin/orders` | OrdersPage (guarded) |
| `/admin/customers` | CustomersPage (guarded) |
| `/admin/reviews` | ReviewsPage (guarded) |

---

## 🔍 Catatan Penting

- **React 19 `useTransition`** digunakan untuk non-blocking state updates (Dashboard fetch, auth submit, address form submit) — lebih soft daripada React 18 `startTransition`
- **`useDeferredValue`** digunakan di `useDataTableFilter` untuk performa filtering real-time
- **`enabled` option**: Semua query cart & wishlist menggunakan `enabled: isAuthenticated` agar tidak fetch tanpa auth
- **App.tsx auth validation**: Memanggil `customerApi.getProfile()` di mount untuk validasi token; jika gagal logout
- **Admin client refresh queue**: `failedQueue` array + `isRefreshing` flag mencegah multiple refresh calls
- **Zod `.refine()`** untuk cross-field validation (password match), **`z.coerce.number()`** untuk form input string→number
- **Admin sidebar**: `group-data-[collapsible=icon]:hidden` pattern untuk responsive collapse
- **CollectionPage** punya 2 mode: pagination (default) + infinite scroll (toggle), keduanya read dari URL search params
- **ArtisanStorytelling** menggunakan 400vh container + sticky + CSS `w-[500vw]` untuk horizontal scroll effect
- **Zero radius**: `--radius: 0rem` mempengaruhi semua komponen shadcn/ui — konsisten dengan aesthetic "modern kotak"
- **Komponen `Empty`** adalah custom design system, bukan dari shadcn/ui standar
- **Field components** (`field.tsx`, `input.tsx`, `label.tsx`, `select.tsx`, `textarea.tsx`) adalah kustomisasi di atas shadcn/ui
- **Sidebar component** (`sidebar.tsx`) menggunakan shadcn/ui Sidebar (Radix-based dengan collapsible icon mode)
