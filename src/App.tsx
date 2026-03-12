import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/provider/theme-provider";
import { Toaster } from "@/components/ui/Sonner";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import DemoPage from "@/pages/DemoPage";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const App = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="white" enableSystem>
      <div className="bg-background text-foreground flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/DemoPage" element={<DemoPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster />
    </ThemeProvider>
  );
};

export default App;
