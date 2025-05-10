
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/lib/auth-context";

// Layout Components
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EnquiryPage from "./pages/EnquiryPage";
import CoursesPage from "./pages/CoursesPage";
import AboutPage from "./pages/AboutPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import NotFound from "./pages/NotFound";

// Dashboard Pages
import StudentDashboardPage from "./pages/StudentDashboardPage";
import CounselorDashboardPage from "./pages/CounselorDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import EnrollmentPage from "./pages/EnrollmentPage";
import PaymentPage from "./pages/PaymentPage";
import StudentEnquiriesPage from "./pages/StudentEnquiriesPage";
import UserProfilePage from "./pages/UserProfilePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/enquiry" element={<EnquiryPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Protected Dashboard Routes */}
            <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              {/* Student Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentDashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/enrollment" element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <EnrollmentPage />
                </ProtectedRoute>
              } />
              <Route path="/payments" element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <PaymentPage />
                </ProtectedRoute>
              } />
              <Route path="/enquiries" element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentEnquiriesPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <UserProfilePage />
                </ProtectedRoute>
              } />

              {/* Counselor Routes */}
              <Route path="/counselor/dashboard" element={
                <ProtectedRoute allowedRoles={["counselor"]}>
                  <CounselorDashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/counselor/enquiries" element={
                <ProtectedRoute allowedRoles={["counselor"]}>
                  <div>Counselor Enquiries Management</div>
                </ProtectedRoute>
              } />
              <Route path="/counselor/enrollments" element={
                <ProtectedRoute allowedRoles={["counselor"]}>
                  <div>Counselor Enrollments Management</div>
                </ProtectedRoute>
              } />
              <Route path="/counselor/followups" element={
                <ProtectedRoute allowedRoles={["counselor"]}>
                  <div>Follow-up Management</div>
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/enquiries" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <div>Admin Enquiries Management</div>
                </ProtectedRoute>
              } />
              <Route path="/admin/enrollments" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <div>Admin Enrollments Management</div>
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <div>User Management</div>
                </ProtectedRoute>
              } />
              <Route path="/admin/admissions" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <div>Admissions Management</div>
                </ProtectedRoute>
              } />
              <Route path="/admin/payments" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <div>Payment Management</div>
                </ProtectedRoute>
              } />
              <Route path="/admin/courses" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <div>Course Management</div>
                </ProtectedRoute>
              } />
              <Route path="/admin/notifications" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <div>Notification Management</div>
                </ProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <div>System Settings</div>
                </ProtectedRoute>
              } />
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
