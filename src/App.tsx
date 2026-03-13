import { Routes, Route } from "react-router-dom";
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
import NotFound from "@/pages/NotFound";

const App = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="bg-background text-foreground flex min-h-screen flex-col font-dm-sans selection:bg-terracotta/25 selection:text-soil">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/collection" element={<CollectionPage />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-tracking" element={<OrderTrackingPage />} />
            <Route path="/order-tracking/:orderNumber" element={<OrderTrackingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
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
