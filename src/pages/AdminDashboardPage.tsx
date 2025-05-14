import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Filter, UserPlus, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { fetchAllUsers, fetchEnquiries, updateEnquiry, updateUserRole } from "@/lib/api";
import { User, Enquiry, UserRole, EnquiryStatus } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminDashboardPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch users and enquiries in parallel
        const [usersData, enquiriesData] = await Promise.all([
          fetchAllUsers(),
          fetchEnquiries()
        ]);
        
        // Format user data to ensure role is of type UserRole
        const formattedUsers: User[] = usersData.map(item => ({
          id: item.id,
          name: item.name,
          email: item.email,
          role: item.role as UserRole, // Type cast to UserRole
          avatar: item.avatar_url,
          phone: item.phone,
          address: item.address
        }));
        
        // Format enquiry data to ensure status is of type EnquiryStatus
        const formattedEnquiries: Enquiry[] = enquiriesData.map(item => ({
          id: item.id,
          studentId: item.user_id,
          studentName: item.name,
          email: item.email,
          contact: item.phone,
          course: item.subject,
          message: item.message,
          status: item.status as EnquiryStatus, // Type cast to EnquiryStatus
          createdAt: item.created_at
        }));
        
        setUsers(formattedUsers);
        setEnquiries(formattedEnquiries);
      } catch (error) {
        console.error("Failed to load data:", error);
        toast.error("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleUpdateUserRole = async (userId: string, role: UserRole) => {
    try {
      await updateUserRole(userId, role);
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role } : user
      ));
      
      toast.success("User role updated successfully.");
    } catch (error) {
      console.error("Failed to update user role:", error);
      toast.error("Failed to update user role. Please try again.");
    }
  };

  const handleUpdateEnquiryStatus = async (enquiryId: string, status: EnquiryStatus) => {
    try {
      await updateEnquiry(enquiryId, { status } as Partial<Enquiry>);
      
      // Update local state
      setEnquiries(enquiries.map(enquiry => 
        enquiry.id === enquiryId ? { ...enquiry, status } : enquiry
      ));
      
      toast.success("Enquiry status updated successfully.");
    } catch (error) {
      console.error("Failed to update enquiry status:", error);
      toast.error("Failed to update enquiry status. Please try again.");
    }
  };

  // Filter users based on search term and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      searchTerm === "" || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesRole = 
      roleFilter === null || 
      user.role === roleFilter;
      
    return matchesSearch && matchesRole;
  });

  // Filter enquiries based on search term and status filter
  const filteredEnquiries = enquiries.filter(enquiry => {
    const matchesSearch = 
      searchTerm === "" || 
      enquiry.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.course.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = 
      statusFilter === null || 
      enquiry.status === statusFilter;
      
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: EnquiryStatus) => {
    let color = "bg-gray-400";
    let icon = <Clock className="w-3 h-3" />;
    
    switch (status) {
      case "pending":
        color = "bg-yellow-400";
        icon = <Clock className="w-3 h-3" />;
        break;
      case "responded":
        color = "bg-blue-400";
        icon = <CheckCircle className="w-3 h-3" />;
        break;
      case "closed":
        color = "bg-green-400";
        icon = <CheckCircle className="w-3 h-3" />;
        break;
    }

    return (
      <Badge variant="outline" className="flex gap-1 items-center">
        <span className={`w-2 h-2 rounded-full ${color}`}></span>
        {status.charAt(0).toUpperCase() + status.slice(1)}
        {icon}
      </Badge>
    );
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage users, enquiries, and system settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{users.length}</div>
            <div className="flex mt-2 text-xs text-muted-foreground">
              <div className="mr-4">
                <span className="font-medium">Students:</span> {users.filter(u => u.role === 'student').length}
              </div>
              <div className="mr-4">
                <span className="font-medium">Counselors:</span> {users.filter(u => u.role === 'counselor').length}
              </div>
              <div>
                <span className="font-medium">Admins:</span> {users.filter(u => u.role === 'admin').length}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Enquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{enquiries.length}</div>
            <div className="flex mt-2 text-xs text-muted-foreground">
              <div className="mr-4">
                <span className="font-medium">New:</span> {enquiries.filter(e => e.status === 'pending').length}
              </div>
              <div className="mr-4">
                <span className="font-medium">Responded:</span> {enquiries.filter(e => e.status === 'responded').length}
              </div>
              <div>
                <span className="font-medium">Closed:</span> {enquiries.filter(e => e.status === 'closed').length}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button size="sm" className="flex gap-2 items-center">
                <UserPlus className="w-4 h-4" />
                Add User
              </Button>
              <Button size="sm" variant="outline">
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="enquiries">Enquiry Management</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select
                  value={roleFilter || ""}
                  onValueChange={(value) => setRoleFilter(value || null)}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Roles</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="counselor">Counselor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="hidden md:table-cell">Phone</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell className="hidden md:table-cell">{user.phone || "-"}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              user.role === "admin" ? "bg-blue-100" :
                              user.role === "counselor" ? "bg-green-100" :
                              "bg-gray-100"
                            }>
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  Actions
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleUpdateUserRole(user.id, "student")}>
                                  Set as Student
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUpdateUserRole(user.id, "counselor")}>
                                  Set as Counselor
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUpdateUserRole(user.id, "admin")}>
                                  Set as Admin
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enquiries">
          <Card>
            <CardHeader>
              <CardTitle>Enquiries</CardTitle>
              <CardDescription>Manage student enquiries and responses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search enquiries..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select
                  value={statusFilter || ""}
                  onValueChange={(value) => setStatusFilter(value || null)}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="responded">Responded</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEnquiries.length > 0 ? (
                      filteredEnquiries.map((enquiry) => (
                        <TableRow key={enquiry.id}>
                          <TableCell>
                            <div>{enquiry.studentName}</div>
                            <div className="text-xs text-muted-foreground">{enquiry.email}</div>
                          </TableCell>
                          <TableCell>{enquiry.course}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {new Date(enquiry.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(enquiry.status)}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  Actions
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUpdateEnquiryStatus(enquiry.id, "responded")}>
                                  Mark as Responded
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUpdateEnquiryStatus(enquiry.id, "closed")}>
                                  Mark as Closed
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUpdateEnquiryStatus(enquiry.id, "pending")}>
                                  Mark as Pending
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          No enquiries found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboardPage;
