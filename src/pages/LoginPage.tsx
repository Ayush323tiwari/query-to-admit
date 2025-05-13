
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, AlertTriangle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/components/ui/sonner";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading: authLoading, isConfigured } = useAuth(); // Renamed loading to authLoading for clarity
  const navigate = useNavigate();
  const [showSupabaseTip, setShowSupabaseTip] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false); // Local state for login process

  useEffect(() => {
    // Check if the user has seen the Supabase tip before
    const hasSeenTip = localStorage.getItem("hasSeenSupabaseTip");
    if (!hasSeenTip) {
      setShowSupabaseTip(true);
      localStorage.setItem("hasSeenSupabaseTip", "true");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoggingIn(true); // Start local loading
    const success = await login(email, password);
    setIsLoggingIn(false); // End local loading

    if (success) {
      // Navigation logic is handled by AuthProvider/ProtectedRoute now
      // For admin, specific navigation can be added if needed after login success confirmation
      // if (email === "admin@querytoadmit.com") { // This check might be better inside AuthProvider or based on user.role
      //   navigate("/admin/dashboard");
      // } else {
      //   navigate("/dashboard"); // General dashboard redirect
      // }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        
        {!isConfigured && (
          <CardContent className="pt-0">
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Configuration Error</AlertTitle>
              <AlertDescription>
                Supabase is not properly configured. Please check your .env file and ensure the environment variables are set correctly.
              </AlertDescription>
            </Alert>
          </CardContent>
        )}
        
        {showSupabaseTip && (
          <CardContent className="pt-0">
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertTitle>Supabase Email Confirmation</AlertTitle>
              <AlertDescription>
                Make sure to disable "Confirm email" in your Supabase Authentication settings for local development.
              </AlertDescription>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => setShowSupabaseTip(false)}
              >
                Got it
              </Button>
            </Alert>
          </CardContent>
        )}
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={authLoading || isLoggingIn}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  disabled={authLoading || isLoggingIn}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={authLoading || isLoggingIn}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={authLoading || isLoggingIn || !isConfigured}
            >
              {isLoggingIn ? "Logging in..." : "Login"}
            </Button>
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Register
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
