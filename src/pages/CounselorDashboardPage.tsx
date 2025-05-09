
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockEnquiries, mockEnrollments, mockStats } from "@/lib/mockData";
import { useAuth } from "@/lib/auth-context";
import { toast } from "@/components/ui/sonner";
import { CheckCircle, Clock, Search, RefreshCw, MessageSquare, X, ArrowUpRight } from "lucide-react";

const CounselorDashboardPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [responseText, setResponseText] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pendingEnquiries = mockEnquiries.filter((enquiry) => enquiry.status === "pending");
  const respondedEnquiries = mockEnquiries.filter((enquiry) => enquiry.status === "responded");
  const closedEnquiries = mockEnquiries.filter((enquiry) => enquiry.status === "closed");

  const filteredEnquiries = mockEnquiries.filter((enquiry) => {
    // First apply search query filter
    const matchesSearch = 
      enquiry.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Then apply status filter
    if (statusFilter === "all") {
      return matchesSearch;
    }
    return matchesSearch && enquiry.status === statusFilter;
  });

  const pendingEnrollments = mockEnrollments.filter((enrollment) => enrollment.status === "under_review");

  const handleSendResponse = async (enquiryId: string) => {
    if (!responseText.trim()) {
      toast.error("Please enter a response message");
      return;
    }

    setLoading(true);
    
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast.success("Response sent successfully!");
    setResponseText("");
    setSelectedEnquiry(null);
    setLoading(false);
  };

  const handleUpdateStatus = async (enquiryId: string, newStatus: string) => {
    setLoading(true);
    
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast.success(`Status updated to ${newStatus}`);
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</Badge>;
      case "responded":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Responded</Badge>;
      case "closed":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Closed</Badge>;
      case "submitted":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Submitted</Badge>;
      case "under_review":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Under Review</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Counselor Dashboard</h1>
        <p className="text-muted-foreground">Manage student enquiries and enrollments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Enquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingEnquiries.length}</div>
            <p className="text-xs text-muted-foreground">Require your response</p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full">View All</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Applications Under Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingEnrollments.length}</div>
            <p className="text-xs text-muted-foreground">Waiting for verification</p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full">View All</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockStats.totalEnrollments > 0
                ? `${Math.round((mockStats.totalEnrollments / mockStats.totalEnquiries) * 100)}%`
                : "0%"}
            </div>
            <p className="text-xs text-muted-foreground">Enquiries to enrollments</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="enquiries" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
          <TabsTrigger value="enquiries">Enquiries</TabsTrigger>
          <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
          <TabsTrigger value="followups">Follow-ups</TabsTrigger>
        </TabsList>
        
        <TabsContent value="enquiries">
          <Card>
            <CardHeader>
              <CardTitle>Student Enquiries</CardTitle>
              <CardDescription>View and respond to student enquiries</CardDescription>
              
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or course..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select 
                  defaultValue="all" 
                  value={statusFilter} 
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="responded">Responded</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEnquiries.length > 0 ? (
                  filteredEnquiries.map((enquiry) => (
                    <Card key={enquiry.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarFallback>
                                {enquiry.studentName.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">{enquiry.studentName}</CardTitle>
                              <CardDescription className="text-xs">{enquiry.email} • {enquiry.contact}</CardDescription>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            {getStatusBadge(enquiry.status)}
                            <span className="text-xs text-muted-foreground mt-1">
                              {new Date(enquiry.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-2">
                          <span className="text-sm font-medium">Course:</span>{" "}
                          <span>{enquiry.course}</span>
                        </div>
                        <div className="text-sm border-l-4 border-accent pl-2 py-1 bg-accent/20 rounded">
                          {enquiry.message}
                        </div>
                        
                        {enquiry.responses && enquiry.responses.length > 0 && (
                          <div className="mt-4">
                            <div className="text-sm font-medium mb-1">Previous Responses:</div>
                            {enquiry.responses.map((response) => (
                              <div key={response.id} className="bg-muted p-2 rounded-md text-sm mt-2">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="font-medium text-xs">
                                    {response.staffName}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(response.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <div>{response.message}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-between gap-2">
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button onClick={() => setSelectedEnquiry(enquiry.id)}>
                                <MessageSquare className="w-4 h-4 mr-2" /> Respond
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Respond to Enquiry</DialogTitle>
                                <DialogDescription>
                                  Send a response to {enquiry.studentName}'s enquiry about {enquiry.course}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 my-4">
                                <div className="bg-muted p-3 rounded text-sm">
                                  <div className="font-medium mb-1">Original Message:</div>
                                  <div>{enquiry.message}</div>
                                </div>
                                <Textarea
                                  placeholder="Type your response here..."
                                  value={responseText}
                                  onChange={(e) => setResponseText(e.target.value)}
                                  rows={5}
                                  className="w-full"
                                />
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setResponseText("")}>
                                  <X className="w-4 h-4 mr-2" /> 
                                  Cancel
                                </Button>
                                <Button onClick={() => handleSendResponse(enquiry.id)} disabled={loading}>
                                  <MessageSquare className="w-4 h-4 mr-2" /> 
                                  {loading ? "Sending..." : "Send Response"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          {enquiry.status === "pending" && (
                            <Button 
                              variant="outline" 
                              onClick={() => handleUpdateStatus(enquiry.id, "responded")}
                              disabled={loading}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" /> Mark as Responded
                            </Button>
                          )}

                          {enquiry.status === "responded" && (
                            <Button 
                              variant="outline" 
                              onClick={() => handleUpdateStatus(enquiry.id, "closed")}
                              disabled={loading}
                            >
                              <ArrowUpRight className="w-4 h-4 mr-2" /> Close Enquiry
                            </Button>
                          )}
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No enquiries found matching your criteria.</p>
                    {(searchQuery || statusFilter !== "all") && (
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => {
                          setSearchQuery("");
                          setStatusFilter("all");
                        }}
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="enrollments">
          <Card>
            <CardHeader>
              <CardTitle>Enrollment Applications</CardTitle>
              <CardDescription>Review and process student applications</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingEnrollments.length > 0 ? (
                <div className="space-y-4">
                  {pendingEnrollments.map((enrollment) => (
                    <Card key={enrollment.id}>
                      <CardHeader>
                        <div className="flex justify-between">
                          <div>
                            <CardTitle className="text-base">{enrollment.studentName}</CardTitle>
                            <CardDescription>Application for {enrollment.course}</CardDescription>
                          </div>
                          <div>
                            {getStatusBadge(enrollment.status)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="text-sm font-medium mb-1">Personal Information</h4>
                            <div className="text-sm">
                              <div>Date of Birth: {enrollment.personalInfo.dateOfBirth}</div>
                              <div>Gender: {enrollment.personalInfo.gender}</div>
                              <div>Phone: {enrollment.personalInfo.phone}</div>
                              <div>
                                Address: {enrollment.personalInfo.address}, {enrollment.personalInfo.city}, {enrollment.personalInfo.state} {enrollment.personalInfo.zipCode}
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-1">Documents</h4>
                            <div className="space-y-2">
                              {enrollment.documents.map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between border p-2 rounded">
                                  <div className="text-sm">{doc.name}</div>
                                  <Button size="sm" variant="outline">
                                    View
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="flex gap-2 w-full">
                          <Button className="flex-1">
                            <CheckCircle className="w-4 h-4 mr-2" /> Approve
                          </Button>
                          <Button variant="outline" className="flex-1">
                            Request Additional Info
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No pending enrollment applications to review.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="followups">
          <Card>
            <CardHeader>
              <CardTitle>Follow-ups</CardTitle>
              <CardDescription>Track and manage leads that require follow-up</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">No follow-ups scheduled at the moment.</p>
                <Button className="mt-4">Schedule Follow-up</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CounselorDashboardPage;
