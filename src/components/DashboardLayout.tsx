
import React from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAuth } from "@/lib/auth-context";

const DashboardLayout = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Handle dashboard redirection based on user role
  if (user && location.pathname === "/dashboard") {
    // Redirect to the appropriate dashboard based on user role
    if (user.role === "counselor") {
      return <Navigate to="/counselor/dashboard" replace />;
    } else if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
