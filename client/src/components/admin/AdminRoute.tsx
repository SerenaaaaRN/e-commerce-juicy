import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuthStore } from "@/stores/adminAuthStore";

type AdminRouteProps = {
  children: ReactNode;
};

const AdminRoute = ({ children }: AdminRouteProps) => {
  const token = useAdminAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRoute;
