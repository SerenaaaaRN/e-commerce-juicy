import { Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/provider/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import HomePage from "@/pages/public/HomePage";
import CollectionPage from "@/pages/public/CollectionPage";
import ProductPage from "@/pages/public/ProductPage";
import CartPage from "@/pages/public/CartPage";
import CheckoutPage from "@/pages/public/CheckoutPage";
import OrderTrackingPage from "@/pages/public/OrderTrackingPage";
import LoginPage from "@/pages/public/LoginPage";
import ProfilePage from "@/pages/public/ProfilePage";
import OrderHistoryPage from "@/pages/public/OrderHistoryPage";
import AtelierPage from "@/pages/public/AtelierPage";
import ShowroomPage from "@/pages/public/ShowroomPage";

import ProtectedRoute from "@/components/common/ProtectedRoute";
import NotFound from "@/pages/NotFound";

import AdminRoute from "@/components/admin/AdminRoute";
import AdminLayout from "@/components/layout/AdminLayout";
import AdminLoginPage from "@/pages/admin/LoginPage";
import AdminDashboardPage from "@/pages/admin/DashboardPage";
import AdminProductsPage from "@/pages/admin/ProductsPage";
import AdminOrdersPage from "@/pages/admin/OrdersPage";
import AdminCustomersPage from "@/pages/admin/CustomersPage";
import AdminReviewsPage from "@/pages/admin/ReviewsPage";

const App = () => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="bg-background text-foreground flex min-h-screen flex-col font-dm-sans selection:bg-terracotta/25 selection:text-soil">
          <main className="flex-1">
            <Routes>
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<AdminDashboardPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="customers" element={<AdminCustomersPage />} />
                <Route path="reviews" element={<AdminReviewsPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
        <Toaster position="bottom-right" richColors closeButton />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="bg-background text-foreground flex min-h-screen flex-col font-dm-sans selection:bg-terracotta/25 selection:text-soil">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/collection" element={<CollectionPage />} />
            <Route path="/showroom" element={<ShowroomPage />} />

            <Route path="/atelier" element={<AtelierPage />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <OrderHistoryPage />
              </ProtectedRoute>
            } />
            <Route path="/order-tracking" element={<OrderTrackingPage />} />
            <Route path="/order-tracking/:orderNumber" element={<OrderTrackingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster position="bottom-right" richColors closeButton />
    </ThemeProvider>
  );
};

export default App;

