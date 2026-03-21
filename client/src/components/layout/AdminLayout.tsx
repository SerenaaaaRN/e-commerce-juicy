import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-chalk text-soil font-dm-sans">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex flex-col md:pl-64">
        <Header setMobileOpen={setMobileOpen} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
