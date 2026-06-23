import type { ReactNode } from "react"
import { ROUTES } from "./paths"

import { AdminLayout } from "@/components/layout/AdminLayout"
import { PublicLayout } from "@/components/layout/PublicLayout"
import { CustomersPage } from "@/features/admin/CustomersPage"
import { DashboardPage } from "@/features/admin/DashboardPage"
import { OrdersPage } from "@/features/admin/OrdersPage"
import { ProductsPage } from "@/features/admin/ProductsPage"
import { ReviewsPage } from "@/features/admin/ReviewsPage"
import { AdminRoute } from "@/features/admin/components/AdminRoute"
import { LoginPageAdmin } from "@/features/auth/LoginPageAdmin"
import { LoginPageCust } from "@/features/auth/LoginPageCust"
import { RegisterPage } from "@/features/auth/RegisterPage"
import { CartPage } from "@/features/cart/CartPage"
import { CategoryLandingPage } from "@/features/category/CategoryLandingPage"
import { CheckoutPage } from "@/features/checkout/CheckoutPage"
import { HeritagePage } from "@/features/heritage/HeritagePage"
import { HomePage } from "@/features/home/HomePage"
import { OrderHistoryPage } from "@/features/orders/OrderHistoryPage"
import { OrderTrackingPage } from "@/features/orders/OrderTrackingPage"
import { ProfilePage } from "@/features/profile/ProfilePage"
import { CollectionPage } from "@/features/shop/CollectionPage"
import { ProductPage } from "@/features/shop/ProductPage"
import { WishlistPage } from "@/features/wishlist/WishlistPage"

export type RouteConfig = {
  path?: string
  index?: boolean
  element?: ReactNode
  hideNavFooter?: boolean
  children?: RouteConfig[]
}

export const routes: RouteConfig[] = [
  {
    element: <PublicLayout />,
    children: [
      { path: ROUTES.home, element: <HomePage /> },
      { path: ROUTES.heritage, element: <HeritagePage /> },
      {
        path: ROUTES.shop,
        children: [
          { index: true, element: <CollectionPage /> },
          { path: ":slug", element: <ProductPage /> },
        ],
      },
      { path: ROUTES.category, element: <CategoryLandingPage /> },
      { path: ROUTES.cart, element: <CartPage /> },
      { path: ROUTES.checkout, element: <CheckoutPage /> },
      {
        path: ROUTES.orders,
        children: [
          { index: true, element: <OrderHistoryPage /> },
          { path: ":orderNumber", element: <OrderTrackingPage /> },
        ],
      },
      { path: ROUTES.wishlist, element: <WishlistPage /> },
      { path: ROUTES.profile, element: <ProfilePage /> },
      { path: ROUTES.login, element: <LoginPageCust />, hideNavFooter: true },
      { path: ROUTES.register, element: <RegisterPage />, hideNavFooter: true },
    ],
  },
  {
    path: ROUTES.adminLogin,
    element: <LoginPageAdmin />,
  },
  {
    path: ROUTES.admin,
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { path: "dashboard", element: <DashboardPage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "orders", element: <OrdersPage /> },
      { path: "customers", element: <CustomersPage /> },
      { path: "reviews", element: <ReviewsPage /> },
    ],
  },
]
