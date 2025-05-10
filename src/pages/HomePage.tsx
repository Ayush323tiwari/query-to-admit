
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import SupabaseSetupGuide from "@/components/SupabaseSetupGuide";

const HomePage = () => {
  const { user, isConfigured } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Welcome to Query to Admit
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Streamline your student admissions process with our comprehensive
            management system for educational institutions.
          </p>
          <div className="space-x-4">
            {user ? (
              <Button asChild size="lg">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Supabase Setup Guide (if not configured) */}
      {!isConfigured && (
        <div className="container mx-auto px-4 py-12">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
            <h2 className="text-2xl font-bold text-amber-800 mb-2">⚠️ Configuration Required</h2>
            <p className="text-amber-700">
              This application requires Supabase to be properly configured. 
              Please follow the setup guide below to continue.
            </p>
          </div>
          <SupabaseSetupGuide />
        </div>
      )}

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Student Enquiry Management</h3>
            <p className="text-gray-600">
              Efficiently track and respond to student inquiries, ensuring no
              potential student falls through the cracks.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Enrollment Processing</h3>
            <p className="text-gray-600">
              Simplify the enrollment process with our intuitive digital forms
              and document management system.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Payment Tracking</h3>
            <p className="text-gray-600">
              Maintain detailed records of all student payments and easily
              generate receipts and reports.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
