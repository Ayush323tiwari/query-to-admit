
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { mockCourses, mockEnrollments, mockPayments } from "@/lib/mockData";
import { useAuth } from "@/lib/auth-context";
import { toast } from "@/components/ui/sonner";
import { CreditCard, Upload, FileText, CheckCircle } from "lucide-react";

const PaymentPage = () => {
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const userEnrollment = mockEnrollments.find(enrollment => enrollment.studentId === user?.id);
  
  const course = userEnrollment 
    ? mockCourses.find(course => course.name === userEnrollment.course)
    : null;
  
  const feeAmount = course?.fee || 0;
  const existingPayment = mockPayments.find(payment => payment.studentId === user?.id);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const handleSubmitPayment = async () => {
    if (paymentMethod === "offline" && !receiptFile) {
      toast.error("Please upload a receipt for offline payment");
      return;
    }

    setIsLoading(true);
    
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success(
      <div className="flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <span>
          {paymentMethod === "online" 
            ? "Payment processed successfully!" 
            : "Receipt uploaded successfully! It will be verified soon."}
        </span>
      </div>,
      {
        duration: 5000,
      }
    );
    
    setIsLoading(false);
  };

  if (!userEnrollment || userEnrollment.status !== "approved") {
    return (
      <div className="min-h-screen py-12 px-4 bg-gray-50">
        <div className="container mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Payment Not Available</CardTitle>
              <CardDescription>
                You need an approved enrollment before making a payment
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-8">
              <div className="bg-yellow-50 text-yellow-800 p-4 rounded-md mb-4">
                <p>Your enrollment application needs to be approved before you can make a payment.</p>
              </div>
              <p className="text-muted-foreground mb-4">
                Please check your enrollment status on your dashboard or submit an enrollment application first.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline" onClick={() => window.history.back()}>
                Go Back
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  if (existingPayment) {
    return (
      <div className="min-h-screen py-12 px-4 bg-gray-50">
        <div className="container mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Payment Status</CardTitle>
              <CardDescription>
                Your payment information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className={`p-4 rounded-md ${
                  existingPayment.status === "approved" 
                    ? "bg-green-50 text-green-800" 
                    : "bg-yellow-50 text-yellow-800"
                }`}>
                  <div className="flex items-start gap-3">
                    <div>
                      <CheckCircle className={`h-5 w-5 ${
                        existingPayment.status === "approved" 
                          ? "text-green-600" 
                          : "text-yellow-600"
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {existingPayment.status === "approved" 
                          ? "Payment Approved" 
                          : "Payment Pending Approval"}
                      </h3>
                      <p className="text-sm mt-1">
                        {existingPayment.status === "approved" 
                          ? "Your payment has been verified and approved. Your admission is confirmed." 
                          : "Your payment is being reviewed. This usually takes 1-2 business days."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">Payment Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-medium">${existingPayment.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Method:</span>
                      <span className="capitalize">{existingPayment.method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{new Date(existingPayment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="capitalize">{existingPayment.status}</span>
                    </div>
                  </div>
                </div>

                {existingPayment.receiptUrl && (
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Receipt</h3>
                    <Button variant="outline" className="w-full">
                      <FileText className="mr-2 h-4 w-4" /> View Receipt
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline" onClick={() => window.history.back()}>
                Return to Dashboard
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gray-50">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-2">Fee Payment</h1>
        <p className="text-center text-muted-foreground mb-8">
          Complete your admission by paying the program fees
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>
              Choose your preferred payment method
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Fee Summary */}
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-4">Fee Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Program:</span>
                  <span>{course?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span>{course?.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tuition Fee:</span>
                  <span className="font-semibold">${feeAmount}</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="font-medium">Total Amount:</span>
                  <span className="font-bold text-lg">${feeAmount}</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div>
              <h3 className="font-medium mb-4">Payment Method</h3>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted cursor-pointer">
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online" className="flex items-center cursor-pointer">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Online Payment (Credit/Debit Card)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted cursor-pointer">
                    <RadioGroupItem value="offline" id="offline" />
                    <Label htmlFor="offline" className="cursor-pointer">
                      Bank Transfer/Direct Deposit (Upload Receipt)
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Online Payment Form */}
            {paymentMethod === "online" && (
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-4">Card Details</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input id="cardName" placeholder="Name on card" />
                  </div>
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input id="expiryDate" placeholder="MM/YY" />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Offline Payment Instructions */}
            {paymentMethod === "offline" && (
              <div className="space-y-4">
                <div className="border rounded-md p-4 bg-muted">
                  <h3 className="font-medium mb-2">Bank Transfer Details</h3>
                  <div className="text-sm space-y-1">
                    <p><strong>Account Name:</strong> EduAdmit Institution</p>
                    <p><strong>Account Number:</strong> 12345678900</p>
                    <p><strong>Bank Name:</strong> First National Bank</p>
                    <p><strong>IFSC/Swift Code:</strong> FNBK0001234</p>
                    <p><strong>Reference:</strong> Your Full Name + Application ID</p>
                  </div>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="mb-2 text-sm">
                    <span className="font-semibold">Click to upload</span> your payment receipt
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    PDF, JPG, PNG (MAX. 5MB)
                  </p>
                  <Input
                    type="file"
                    className="hidden"
                    id="receiptUpload"
                    onChange={handleFileUpload}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <Label htmlFor="receiptUpload">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => document.getElementById("receiptUpload")?.click()}
                    >
                      Select Receipt
                    </Button>
                  </Label>
                </div>

                {receiptFile && (
                  <div className="flex items-center gap-2 p-2 bg-accent rounded">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm flex-1 truncate">{receiptFile.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReceiptFile(null)}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={handleSubmitPayment}
              disabled={isLoading || (paymentMethod === "offline" && !receiptFile)}
            >
              {isLoading ? "Processing..." : paymentMethod === "online" ? "Make Payment" : "Upload Receipt"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PaymentPage;
