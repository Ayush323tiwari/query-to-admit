
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
  const [adminCreated, setAdminCreated] = useState(false);
  const { login, loading, isConfigured, createAdminIfNotExists } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check local storage to see if we've displayed the admin creation notice
    const hasShownAdminCreation = localStorage.getItem('adminCreationNoticed');
    if (hasShownAdminCreation !== 'true' && isConfigured) {
      toast.info('First time here? Create an admin account to get started!', {
        duration: 8000
      });
    }
  }, [isConfigured]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    const success = await login(email, password);
    if (success) {
      navigate("/dashboard");
    }
  };

  const handleCreateAdmin = async () => {
    try {
      await createAdminIfNotExists();
      setAdminCreated(true);
      localStorage.setItem('adminCreationNoticed', 'true');
    } catch (error) {
      console.error("Error creating admin user:", error);
      toast.error("Failed to create admin user. Please try again.");
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
                Supabase is not properly configured. Please set the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
                environment variables.
              </AlertDescription>
            </Alert>
          </CardContent>
        )}
        
        {isConfigured && !adminCreated && (
          <CardContent className="pt-0">
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertTitle>First time here?</AlertTitle>
              <AlertDescription className="flex flex-col space-y-2">
                <span>You need to create an admin user to get started.</span>
                <Button 
                  variant="outline" 
                  onClick={handleCreateAdmin}
                  className="mt-2"
                >
                  Create default admin user
                </Button>
              </AlertDescription>
            </Alert>
          </CardContent>
        )}
        
        {adminCreated && (
          <CardContent className="pt-0">
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertTitle>Admin Created!</AlertTitle>
              <AlertDescription>
                <p>Admin user created successfully.</p>
                <p className="font-medium">Email: admin@querytoadmit.com</p>
                <p className="font-medium">Password: Admin@123</p>
              </AlertDescription>
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
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0"
                  onClick={() => setShowPassword(!showPassword)}
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
              disabled={loading || !isConfigured}
            >
              {loading ? "Logging in..." : "Login"}
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
