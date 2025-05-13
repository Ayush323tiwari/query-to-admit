
import React, { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { UserRole } from "@/lib/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ["student", "counselor", "admin"] 
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // After authentication, if the route is not allowed for the user role,
    // redirect to the appropriate route
    if (!loading && user) {
      if (!allowedRoles.includes(user.role)) {
        if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else if (user.role === "counselor") {
          navigate("/counselor/dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    }
  }, [user, loading, allowedRoles, navigate]);

  // While checking auth, show nothing
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If no user is authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

  // Check if the user has one of the allowed roles
  if (!allowedRoles.includes(user.role)) {
    // Store the attempted path before redirecting
    return <Navigate to="/unauthorized" state={{ 
      from: location.pathname,
      allowedRoles: allowedRoles
    }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
