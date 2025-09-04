"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Smartphone } from "lucide-react";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface CheckoutFormData {
  phoneNumber: string;
  amount: number;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerAddress: string;
  productDescription: string;
}

export default function CheckoutPage() {
  const [formData, setFormData] = useState<CheckoutFormData>({
    phoneNumber: "",
    amount: 0,
    customerFirstName: "",
    customerLastName: "",
    customerEmail: "",
    customerAddress: "",
    productDescription: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [orderReference, setOrderReference] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createPaymentRecord = useMutation(api.checkout.createPaymentRecord);
  const triggerSTKPush = useAction(api.checkout.triggerSTKPush);
  const paymentStatus = useQuery(
    api.checkout.getPaymentStatus,
    orderReference ? { reference: orderReference } : "skip"
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const newValue = name === "amount" ? parseFloat(value) || 0 : value;
    
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: newValue,
      };
      console.log(`📝 Form field updated: ${name} = ${newValue}`, updated);
      return updated;
    });
  };

  const formatPhoneNumber = (phone: string): string => {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, "");
    
    // If starts with 0, replace with 254
    if (cleaned.startsWith("0")) {
      return "254" + cleaned.substring(1);
    }
    
    // If starts with 254, keep as is
    if (cleaned.startsWith("254")) {
      return cleaned;
    }
    
    // If starts with 7, add 254
    if (cleaned.startsWith("7")) {
      return "254" + cleaned;
    }
    
    return cleaned;
  };

  const validateForm = (): boolean => {
    console.log("🔍 Validating form data:", formData);
    
    if (!formData.phoneNumber || !formData.amount || !formData.customerFirstName || 
        !formData.customerLastName || !formData.customerEmail) {
      console.error("❌ Missing required fields:", {
        phoneNumber: !!formData.phoneNumber,
        amount: !!formData.amount,
        customerFirstName: !!formData.customerFirstName,
        customerLastName: !!formData.customerLastName,
        customerEmail: !!formData.customerEmail
      });
      setError("Please fill in all required fields");
      return false;
    }

    const phoneRegex = /^254[17]\d{8}$/;
    const formattedPhone = formatPhoneNumber(formData.phoneNumber);
    
    if (!phoneRegex.test(formattedPhone)) {
      setError("Please enter a valid Kenyan phone number (e.g., +254797838201)");
      return false;
    }

    if (formData.amount < 1) {
      setError("Amount must be at least KES 1");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.customerEmail)) {
      setError("Please enter a valid email address");
      return false;
    }

    console.log("✅ Form validation passed");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const formattedPhone = formatPhoneNumber(formData.phoneNumber);
      
      // Generate unique order reference
      const generatedOrderReference = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
      
      console.log("🚀 Starting checkout with data:", {
        orderReference: generatedOrderReference,
        customerName: `${formData.customerFirstName} ${formData.customerLastName}`,
        phone: formattedPhone,
        email: formData.customerEmail,
        amount: formData.amount
      });
      
      // Step 1: Create payment record FIRST
      const paymentRecord = await createPaymentRecord({
        ...formData,
        phoneNumber: formattedPhone,
        orderReference: generatedOrderReference,
        status: "pending", // Start as pending
      });

      console.log("✅ Payment record created:", paymentRecord);

      if (paymentRecord) {
        // Ensure we have all required customer data before calling STK push
        const customerData = {
          phoneNumber: formattedPhone,
          amount: formData.amount,
          orderReference: generatedOrderReference,
          customerFirstName: formData.customerFirstName || "Customer",
          customerLastName: formData.customerLastName || "User", 
          customerEmail: formData.customerEmail || "customer@example.com",
          customerAddress: formData.customerAddress || "",
          productDescription: formData.productDescription || "",
        };

        console.log("📋 Customer data being sent to STK push:", customerData);

        // Step 2: Trigger STK Push with ALL customer data (not dummy data)
        const stkResult = await triggerSTKPush(customerData);

        console.log("✅ STK Push result:", stkResult);

        if (stkResult.status === "initiated") {
          // STK Push successful
          setOrderReference(generatedOrderReference);
        } else {
          setError(stkResult.message || "STK Push failed. Please try again.");
        }
      } else {
        setError("Failed to create payment record");
      }
    } catch (err) {
      console.error("❌ Checkout error:", err);
      setError("An error occurred while processing your payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (orderReference && paymentStatus) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Payment Status</CardTitle>
            <CardDescription className="text-center">
              Order Reference: {orderReference}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-center">
              <div className="text-lg font-medium">
                Status: <span className="capitalize">{paymentStatus.status}</span>
              </div>
              
              {paymentStatus.status === "initiated" && (
                <Alert>
                  <Smartphone className="h-4 w-4" />
                  <AlertDescription>
                    STK Push sent! Please check your phone for the M-Pesa payment prompt and enter your PIN to complete the payment.
                  </AlertDescription>
                </Alert>
              )}

              {paymentStatus.status === "pending" && (
                <Alert>
                  <Smartphone className="h-4 w-4" />
                  <AlertDescription>
                    Payment is being processed. Please wait...
                  </AlertDescription>
                </Alert>
              )}
              
              {paymentStatus.status === "paid" && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">
                    Payment successful! Thank you for your purchase.
                  </AlertDescription>
                </Alert>
              )}
              
              {paymentStatus.status === "failed" && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    Payment failed. Please try again or contact support.
                  </AlertDescription>
                </Alert>
              )}
              
              <Button 
                onClick={() => {
                  setOrderReference(null);
                  setFormData({
                    phoneNumber: "",
                    amount: 0,
                    customerFirstName: "",
                    customerLastName: "",
                    customerEmail: "",
                    customerAddress: "",
                    productDescription: "",
                  });
                }}
                variant="outline"
              >
                Make Another Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Checkout
          </CardTitle>
          <CardDescription>
            Complete your payment using M-Pesa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerFirstName">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="customerFirstName"
                  name="customerFirstName"
                  value={formData.customerFirstName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerLastName">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="customerLastName"
                  name="customerLastName"
                  value={formData.customerLastName}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerEmail">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="customerEmail"
                name="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="+254797838201"
                required
              />
              <p className="text-sm text-gray-600">
                Enter your M-Pesa registered phone number (e.g., +254797838201)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">
                Amount (KES) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min="1"
                step="0.01"
                value={formData.amount || ""}
                onChange={handleInputChange}
                placeholder="Enter amount"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerAddress">Address</Label>
              <Input
                id="customerAddress"
                name="customerAddress"
                value={formData.customerAddress}
                onChange={handleInputChange}
                placeholder="Enter your address (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productDescription">Description</Label>
              <Textarea
                id="productDescription"
                name="productDescription"
                value={formData.productDescription}
                onChange={handleInputChange}
                placeholder="Brief description of what you're paying for (optional)"
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing STK Push...
                  </>
                ) : (
                  <>
                    <Smartphone className="mr-2 h-4 w-4" />
                    Proceed to Pay (M-Pesa)
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
