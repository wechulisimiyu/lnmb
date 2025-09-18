"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CreditCard, Smartphone, ArrowLeft, CheckCircle } from "lucide-react";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface OrderData {
  student: string;
  university?: string;
  yearOfStudy?: string;
  regNumber?: string;
  attending: string;
  tshirtType: string;
  tshirtSize: string;
  quantity: number;
  totalAmount: number;
  name: string;
  email: string;
  phone: string;
  nameOfKin: string;
  kinNumber: string;
  medicalCondition: string;
  pickUp?: string;
  confirm: string;
  orderReference: string;
  paid: boolean;
}

interface PaymentFormData {
  token: string;
  merchantCode: string;
  currency: string;
  orderAmount: number;
  orderReference: string;
  productType: string;
  productDescription: string;
  paymentTimeLimit: string;
  customerFirstName: string;
  customerLastName: string;
  customerPostalCodeZip: string;
  customerAddress: string;
  customerEmail: string;
  customerPhone: string;
  callbackUrl: string;
  countryCode: string;
  secondaryReference: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentFormData, setPaymentFormData] = useState<PaymentFormData | null>(null);

  const createOrder = useMutation(api.orders.createOrder);
  const createPaymentRecord = useAction(api.orders.createPaymentRecord);
  const paymentStatus = useQuery(
    api.orders.getPaymentStatus,
    orderData?.orderReference ? { reference: orderData.orderReference } : "skip"
  );

  useEffect(() => {
    // Get order data from localStorage
    const savedOrder = localStorage.getItem("pendingOrder");
    if (savedOrder) {
      try {
        const parsed = JSON.parse(savedOrder);
        setOrderData(parsed);
      } catch (error) {
        console.error("Error parsing order data:", error);
        router.push("/shop");
      }
    } else {
      router.push("/shop");
    }
  }, [router]);

  const handleProcessPayment = async () => {
    if (!orderData) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Create order in database
      await createOrder({
        student: orderData.student,
        university: orderData.university,
        yearOfStudy: orderData.yearOfStudy,
        regNumber: orderData.regNumber,
        attending: orderData.attending,
        tshirtType: orderData.tshirtType,
        tshirtSize: orderData.tshirtSize,
        quantity: orderData.quantity,
        totalAmount: orderData.totalAmount,
        name: orderData.name,
        email: orderData.email,
        phone: orderData.phone,
        nameOfKin: orderData.nameOfKin,
        kinNumber: orderData.kinNumber,
        medicalCondition: orderData.medicalCondition,
        pickUp: orderData.pickUp,
        confirm: orderData.confirm,
        orderReference: orderData.orderReference,
      });

      // Create payment record and get Jenga PGW form data
      const [firstName, ...lastNameParts] = orderData.name.split(" ");
      const lastName = lastNameParts.join(" ") || firstName;
      
      // Sanitize product description for Jenga PGW (only allow alphanumeric, hyphen, quotation mark, forward slash, back slash, underscore, space)
      const rawDescription = `${orderData.tshirtType} T-shirt ${orderData.tshirtSize} x${orderData.quantity} - Leave No Medic Behind Charity Run`;
      const productDescription = rawDescription.replace(/[^a-zA-Z0-9\-"\/\\_\s]/g, '');
      
      const paymentRecord = await createPaymentRecord({
        orderReference: orderData.orderReference,
        orderAmount: orderData.totalAmount,
        customerFirstName: firstName,
        customerLastName: lastName,
        customerEmail: orderData.email,
        customerPhone: `254${orderData.phone}`,
        customerAddress: "Nairobi, Kenya",
        productDescription,
      });

      // Set payment form data for submission to Jenga PGW
      setPaymentFormData(paymentRecord.paymentData);
      
      // Clear localStorage
      localStorage.removeItem("pendingOrder");

    } catch (error) {
      console.error("Error processing payment:", error);
      setError("Failed to process payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const submitToJengaPGW = () => {
    if (!paymentFormData) return;

    // Create a form and submit to Jenga PGW
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://v3-uat.jengapgw.io/processPayment";

    // Add all the required hidden fields
    const fields = {
      token: paymentFormData.token,
      merchantCode: paymentFormData.merchantCode,
      currency: paymentFormData.currency,
      orderAmount: String(paymentFormData.orderAmount),
      orderReference: paymentFormData.orderReference,
      productType: paymentFormData.productType,
      productDescription: paymentFormData.productDescription,
      paymentTimeLimit: paymentFormData.paymentTimeLimit,
      customerFirstName: paymentFormData.customerFirstName,
      customerLastName: paymentFormData.customerLastName,
      customerPostalCodeZip: paymentFormData.customerPostalCodeZip,
      customerAddress: paymentFormData.customerAddress,
      customerEmail: paymentFormData.customerEmail,
      customerPhone: paymentFormData.customerPhone,
      callbackUrl: paymentFormData.callbackUrl,
      countryCode: paymentFormData.countryCode,
      secondaryReference: paymentFormData.secondaryReference,
    };

    Object.entries(fields).forEach(([name, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = String(value);
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  const getTshirtTypeDisplay = (type: string) => {
    return type === "polo" ? "Polo Neck" : "Round Neck";
  };

  const getSizeDisplay = (size: string) => {
    return size.split("-").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  if (!orderData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading checkout...</p>
        </div>
      </div>
    );
  }

  // Check if payment is already successful
  if (paymentStatus?.status === "paid") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
            <CardDescription>
              Your order has been confirmed. You will receive an email confirmation shortly.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.push("/")} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Review your order and complete payment</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-semibold text-lg mb-2">T-shirt Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span>{getTshirtTypeDisplay(orderData.tshirtType)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span>{getSizeDisplay(orderData.tshirtSize)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span>{orderData.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Will attend run:</span>
                    <span>{orderData.attending === "attending" ? "Yes" : "No"}</span>
                  </div>
                </div>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-semibold text-lg mb-2">Customer Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Name:</span>
                    <span>{orderData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span>{orderData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone:</span>
                    <span>+254{orderData.phone}</span>
                  </div>
                  {orderData.student === "yes" && (
                    <>
                      <div className="flex justify-between">
                        <span>University:</span>
                        <span>{orderData.university}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Year of Study:</span>
                        <span>{orderData.yearOfStudy}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Amount:</span>
                  <span className="text-blue-600">KES {orderData.totalAmount.toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Order Reference: {orderData.orderReference}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Section */}
          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
              <CardDescription>
                Complete your payment using M-PESA or card
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!paymentFormData ? (
                <>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <Smartphone className="h-6 w-6 text-blue-600" />
                      <span className="font-semibold">M-PESA Payment</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      You can pay using M-PESA STK Push or other supported payment methods.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <CreditCard className="h-6 w-6 text-gray-600" />
                      <span className="font-semibold">Card Payment</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      Visa, Mastercard, and other supported card payments are available.
                    </p>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    onClick={handleProcessPayment}
                    disabled={isProcessing}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Proceed to Payment
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <Alert>
                    <AlertDescription>
                      Your payment has been prepared. Click the button below to complete your payment 
                      securely through Jenga Payment Gateway.
                    </AlertDescription>
                  </Alert>

                  <Button
                    onClick={submitToJengaPGW}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-6"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Complete Payment
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    You will be redirected to a secure payment page
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Payment Status */}
        {paymentStatus && paymentStatus.status !== "pending" && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Payment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  paymentStatus.status === "paid" ? "bg-green-500" : 
                  paymentStatus.status === "processing" ? "bg-yellow-500" : "bg-red-500"
                }`} />
                <span className="capitalize font-semibold">
                  {paymentStatus.status}
                </span>
              </div>
              {paymentStatus.transactionId && (
                <p className="text-sm text-gray-600 mt-2">
                  Transaction ID: {paymentStatus.transactionId}
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
