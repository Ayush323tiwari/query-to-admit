
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth-context";
import { fetchEnquiries, fetchEnrollments, fetchPayments } from "@/lib/api";
import { Enquiry, Enrollment, Payment } from "@/lib/types";
import { ChevronRight, Clock, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const StudentDashboardPage = () => {
  const { user } = useAuth();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Fetch data in parallel
        const [enquiriesData, enrollmentsData, paymentsData] = await Promise.all([
          fetchEnquiries(user.id, user.role),
          fetchEnrollments(user.id, user.role),
          fetchPayments(user.id, user.role)
        ]);
        
        // Transform data if needed
        const formattedEnquiries = enquiriesData.map(item => ({
          id: item.id,
          studentId: item.user_id,
          studentName: item.name,
          email: item.email,
          contact: item.phone,
          course: item.subject,
          message: item.message,
          status: item.status,
          createdAt: item.created_at
        }));
        
        setEnquiries(formattedEnquiries);
        setEnrollments(enrollmentsData);
        setPayments(paymentsData);
        
        // Mock notification data for now
        // In a real app, we would fetch these from Supabase
        setNotifications([
          {
            id: "1",
            userId: user.id,
            title: "Welcome!",
            message: "Welcome to the student portal",
            isRead: false,
            createdAt: new Date().toISOString()
          },
          {
            id: "2",
            userId: user.id,
            title: "New Course Available",
            message: "Check out our new courses",
            isRead: false,
            createdAt: new Date().toISOString()
          }
        ]);
        
      } catch (error) {
        console.error("Failed to load data:", error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  const statusColors = {
    pending: "bg-yellow-400",
    new: "bg-yellow-400",
    responded: "bg-green-400",
    closed: "bg-gray-400",
    submitted: "bg-blue-400",
    under_review: "bg-purple-400",
    approved: "bg-green-400",
    rejected: "bg-red-400",
  };

  const getStatusBadge = (status: string) => {
    let icon;
    switch (status) {
      case "pending":
      case "new":
        icon = <Clock className="w-3 h-3" />;
        break;
      case "responded":
      case "approved":
        icon = <CheckCircle className="w-3 h-3" />;
        break;
      case "rejected":
        icon = <XCircle className="w-3 h-3" />;
        break;
      default:
        icon = <AlertCircle className="w-3 h-3" />;
    }

    return (
      <Badge variant="outline" className="flex gap-1 items-center">
        <span className={`w-2 h-2 rounded-full ${statusColors[status as keyof typeof statusColors] || "bg-gray-400"}`}></span>
        {status.charAt(0).toUpperCase() + status.slice(1)}
        {icon}
      </Badge>
    );
  };

  const getAdmissionProgress = () => {
    if (enrollments.length === 0) return 0;
    
    // Calculate progress based on enrollment status
    const status = enrollments[0].status;
    switch (status) {
      case "submitted":
        return 25;
      case "under_review":
        return 50;
      case "approved":
        const hasPayment = payments.length > 0;
        return hasPayment ? 90 : 75;
      default:
        return 0;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground">Manage your applications and track your progress</p>
        </div>
        <Link to="/enquiry">
          <Button>New Enquiry</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Admission Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{getAdmissionProgress()}%</span>
                <span className="text-xs text-muted-foreground">Application Status</span>
              </div>
              <Progress value={getAdmissionProgress()} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrollments.length === 0 ? "Submit Application" : 
              enrollments[0].status === "approved" && payments.length === 0 ? "Pay Fees" : 
              enrollments[0].status === "under_review" ? "Wait for Review" : 
              "Complete Profile"}</div>
            <p className="text-xs text-muted-foreground">Next step in your admission process</p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link to={enrollments.length === 0 ? "/enrollment" : "/payments"}>
                Take Action
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.filter(n => !n.isRead).length}</div>
            <p className="text-xs text-muted-foreground">Unread notifications</p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full">
              View All
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="enquiries" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
          <TabsTrigger value="enquiries">Enquiries</TabsTrigger>
          <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="enquiries">
          <Card>
            <CardHeader>
              <CardTitle>My Enquiries</CardTitle>
              <CardDescription>View and track your submitted enquiries</CardDescription>
            </CardHeader>
            <CardContent>
              {enquiries.length > 0 ? (
                <div className="space-y-4">
                  {enquiries.map((enquiry) => (
                    <div key={enquiry.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{enquiry.course}</h3>
                          <p className="text-sm text-muted-foreground truncate max-w-xs">
                            {enquiry.message.substring(0, 100)}...
                          </p>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(enquiry.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(enquiry.status)}
                          <Button variant="ghost" size="sm" className="flex items-center">
                            View <ChevronRight className="ml-1 w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">You haven't submitted any enquiries yet.</p>
                  <Link to="/enquiry">
                    <Button className="mt-4">Submit Enquiry</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="enrollments">
          <Card>
            <CardHeader>
              <CardTitle>My Enrollments</CardTitle>
              <CardDescription>View and track your enrollment applications</CardDescription>
            </CardHeader>
            <CardContent>
              {enrollments.length > 0 ? (
                <div className="space-y-4">
                  {enrollments.map((enrollment) => (
                    <div key={enrollment.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{enrollment.course}</h3>
                          <p className="text-sm mt-1">
                            Applied on: {new Date(enrollment.createdAt).toLocaleDateString()}
                          </p>
                          <div className="text-sm text-muted-foreground mt-1">
                            <span className="font-medium">Documents:</span>{" "}
                            {enrollment.documents ? enrollment.documents.length : 0} uploaded
                          </div>
                          {enrollment.remarks && (
                            <div className="text-sm mt-2 p-2 bg-accent rounded-md">
                              <span className="font-medium">Remarks:</span> {enrollment.remarks}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(enrollment.status)}
                          <Button variant="ghost" size="sm" className="flex items-center">
                            View Details <ChevronRight className="ml-1 w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">You haven't submitted any enrollment applications yet.</p>
                  <Link to="/enrollment">
                    <Button className="mt-4">Apply Now</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>My Payments</CardTitle>
              <CardDescription>View and track your fee payments</CardDescription>
            </CardHeader>
            <CardContent>
              {payments.length > 0 ? (
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div key={payment.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <h3 className="font-medium">Amount: ${payment.amount}</h3>
                            <span className="text-sm text-muted-foreground">
                              ({payment.method})
                            </span>
                          </div>
                          <p className="text-sm mt-1">
                            Date: {new Date(payment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(payment.status)}
                          {payment.receiptUrl && (
                            <Button variant="ghost" size="sm">
                              View Receipt
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No payment records found.</p>
                  {enrollments.length > 0 && enrollments[0].status === "approved" && (
                    <Link to="/payments">
                      <Button className="mt-4">Make Payment</Button>
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboardPage;
