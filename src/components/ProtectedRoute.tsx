
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { UserRole } from "@/lib/types";
import { AlertTriangle } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ["student", "counselor", "admin"] 
}) => {
  const { user } = useAuth();
  const location = useLocation();

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
