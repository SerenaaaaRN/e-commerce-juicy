import { useEffect } from "react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useCustomerAuthStore } from "@/stores/customerAuthStore";

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { token, customer, fetchProfile } = useCustomerAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (token && !customer) {
      fetchProfile();
    }
  }, [token, fetchProfile, customer]);

  if (!token) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

  if (!customer) {
    return (
      <div className="bg-background font-dm-sans flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="border-sand border-t-terracotta h-6 w-6 animate-spin rounded-full border-2" />
          <span className="text-dust text-[10px] font-semibold tracking-[0.2em] uppercase">Loading Profile...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
