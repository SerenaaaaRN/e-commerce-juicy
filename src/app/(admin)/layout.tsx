import AdminHeader from "@/components/admin/header";
import AdminSidebar from "./sidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden border-r bg-muted/40 md:block md:w-55 lg:w-70">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <AdminSidebar />
        </div>
      </div>

      {/* main area */}
      <div className="flex flex-col flex-1">
        <AdminHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
