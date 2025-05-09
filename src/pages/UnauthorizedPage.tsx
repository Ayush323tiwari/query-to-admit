
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Shield, ArrowLeft, LogOut, Home } from "lucide-react";

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  // Get information about why access was denied
  const from = location.state?.from || "/";
  const allowedRoles = location.state?.allowedRoles || [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="rounded-full bg-red-100 p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Shield className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <div className="text-muted-foreground mb-6">
          <p className="mb-2">
            You don't have permission to access this page. This area requires a{" "}
            {allowedRoles.length === 1 ? (
              <span className="font-medium text-primary">{allowedRoles[0]}</span>
            ) : (
              <span className="font-medium text-primary">
                {allowedRoles.slice(0, -1).join(", ")} or {allowedRoles[allowedRoles.length - 1]}
              </span>
            )}{" "}
            role.
          </p>
          <p>
            Your current role is{" "}
            <span className="font-medium">{user?.role || "unknown"}</span>.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 justify-center">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
          </Button>
          <Button 
            onClick={() => navigate("/")}
            className="flex items-center"
          >
            <Home className="w-4 h-4 mr-2" /> Go to Home
          </Button>
          {user && (
            <Button 
              variant="ghost"
              onClick={handleLogout}
              className="flex items-center"
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
