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
    // If we have a token but no customer profile info, fetch the profile
    if (token && !customer) {
      fetchProfile();
    }
  }, [token, fetchProfile]);

  if (!token) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

  if (!customer) {
    return (
      <div className="bg-background flex min-h-[60vh] items-center justify-center font-dm-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-sand border-t-terracotta" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-dust">
            Loading Profile...
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
