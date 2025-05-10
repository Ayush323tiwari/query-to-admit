
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

const HomePage = () => {
  const { user } = useAuth();

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
      
      {/* Testimonials Section */}
      <div className="bg-primary/5 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="italic text-gray-600 mb-4">
                "This platform has transformed our admission process. We've reduced
                processing time by 60% and improved applicant satisfaction significantly."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                  JD
                </div>
                <div className="ml-4">
                  <p className="font-semibold">John Doe</p>
                  <p className="text-sm text-gray-500">Admissions Director, ABC University</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="italic text-gray-600 mb-4">
                "The intuitive interface makes managing applications so simple. 
                Our staff required minimal training and students love how easy it is to apply."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                  MS
                </div>
                <div className="ml-4">
                  <p className="font-semibold">Mary Smith</p>
                  <p className="text-sm text-gray-500">Dean of Admissions, XYZ College</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Admissions Process?</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join hundreds of educational institutions already using our platform to streamline their operations.
        </p>
        <Button asChild size="lg">
          <Link to="/register">Get Started Today</Link>
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
