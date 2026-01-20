import Footer from "@/modules/store/components/footer";
import Navbar from "@/modules/store/components/navbar";

const StoreLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default StoreLayout;
