
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { fetchEnquiries, createEnquiry } from "@/lib/api";
import { Enquiry, EnquiryStatus } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { Loader2, Plus, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const StudentEnquiriesPage = () => {
  const { user } = useAuth();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const loadEnquiries = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const data = await fetchEnquiries(user.id, user.role);
        console.log("Fetched enquiries:", data);
        
        // Transform data to match our Enquiry type
        const formattedEnquiries = data.map(item => ({
          id: item.id,
          studentId: item.user_id,
          studentName: item.name,
          email: item.email,
          contact: item.phone,
          course: item.subject,
          message: item.message,
          status: item.status as EnquiryStatus,
          createdAt: item.created_at
        }));
        
        setEnquiries(formattedEnquiries);
      } catch (error) {
        console.error("Failed to load enquiries:", error);
        toast({
          title: "Error",
          description: "Failed to load enquiries. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadEnquiries();
  }, [user, toast]);

  const handleCreateEnquiry = async (data: any) => {
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      
      const newEnquiry = {
        studentId: user.id,
        studentName: user.name,
        email: user.email,
        contact: data.contact,
        course: data.course,
        message: data.message,
        status: "pending" as EnquiryStatus,
        createdAt: new Date().toISOString(),
      };
      
      const createdEnquiry = await createEnquiry(newEnquiry);
      setEnquiries([createdEnquiry, ...enquiries]);
      
      toast({
        title: "Success",
        description: "Your enquiry has been submitted successfully.",
      });
      
      reset();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to create enquiry:", error);
      toast({
        title: "Error",
        description: "Failed to submit enquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
      case "new":
        return "bg-yellow-500";
      case "responded":
        return "bg-blue-500";
      case "closed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
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
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Enquiries</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex gap-2 items-center">
              <Plus size={16} />
              New Enquiry
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit a New Enquiry</DialogTitle>
              <DialogDescription>
                Fill in the details below to submit a new enquiry.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(handleCreateEnquiry)}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="contact">Contact Number</label>
                  <Input
                    id="contact"
                    {...register("contact", { required: "Contact number is required" })}
                    placeholder="Your contact number"
                  />
                  {errors.contact && (
                    <p className="text-sm text-red-500">{errors.contact.message?.toString()}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <label htmlFor="course">Course Interested In</label>
                  <Input
                    id="course"
                    {...register("course", { required: "Course is required" })}
                    placeholder="Name of the course"
                  />
                  {errors.course && (
                    <p className="text-sm text-red-500">{errors.course.message?.toString()}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <label htmlFor="message">Your Message</label>
                  <Textarea
                    id="message"
                    {...register("message", { required: "Message is required" })}
                    placeholder="Describe your enquiry"
                    rows={4}
                  />
                  {errors.message && (
                    <p className="text-sm text-red-500">{errors.message.message?.toString()}</p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Enquiry"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {enquiries.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 mx-auto text-gray-400" />
          <h2 className="mt-4 text-lg font-medium">No enquiries yet</h2>
          <p className="text-gray-500 mt-2">
            You haven't submitted any enquiries yet. Click "New Enquiry" to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {enquiries.map((enquiry) => (
            <Card key={enquiry.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{enquiry.course}</CardTitle>
                    <CardDescription>
                      {new Date(enquiry.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(enquiry.status)}>
                    {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="line-clamp-3">{enquiry.message}</p>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <div className="text-sm text-gray-500">
                  {enquiry.responses && enquiry.responses.length > 0
                    ? `${enquiry.responses.length} response(s)`
                    : "No responses yet"}
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentEnquiriesPage;
