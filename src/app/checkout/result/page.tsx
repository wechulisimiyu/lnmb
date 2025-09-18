"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";

function PaymentResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setStatus(searchParams.get("status"));
    setReference(searchParams.get("reference"));
    setTransactionId(searchParams.get("transactionId"));
    setMessage(searchParams.get("message"));
  }, [searchParams]);

  const getStatusIcon = () => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case "processing":
        return <Clock className="h-16 w-16 text-yellow-500" />;
      case "failed":
        return <XCircle className="h-16 w-16 text-red-500" />;
      case "error":
        return <AlertTriangle className="h-16 w-16 text-red-500" />;
      default:
        return <AlertTriangle className="h-16 w-16 text-gray-500" />;
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case "paid":
        return "Payment Successful!";
      case "processing":
        return "Payment Processing";
      case "failed":
        return "Payment Failed";
      case "error":
        return "Payment Error";
      default:
        return "Payment Status Unknown";
    }
  };

  const getStatusMessage = () => {
    if (message) return message;
    
    switch (status) {
      case "paid":
        return "Your payment has been successfully processed. You will receive an email confirmation shortly with your order details.";
      case "processing":
        return "Your payment is being processed. Please wait a moment and check back later.";
      case "failed":
        return "Your payment could not be processed. Please try again or contact support if the problem persists.";
      case "error":
        return "An error occurred while processing your payment. Please contact support for assistance.";
      default:
        return "We couldn't determine the status of your payment. Please contact support with your order reference.";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "paid":
        return "text-green-600";
      case "processing":
        return "text-yellow-600";
      case "failed":
      case "error":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-8">
      <div className="container mx-auto px-4 max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              {getStatusIcon()}
            </div>
            <CardTitle className={`text-2xl ${getStatusColor()}`}>
              {getStatusTitle()}
            </CardTitle>
            <CardDescription className="text-center">
              {getStatusMessage()}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Order Details */}
            {reference && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-sm text-gray-700 mb-2">Order Details</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Order Reference:</span>
                    <span className="font-mono">{reference}</span>
                  </div>
                  {transactionId && (
                    <div className="flex justify-between">
                      <span>Transaction ID:</span>
                      <span className="font-mono text-xs">{transactionId}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Next Steps */}
            {status === "paid" && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-sm text-green-800 mb-2">What&apos;s Next?</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Check your email for order confirmation</li>
                  <li>• Your t-shirt will be available for pickup at the specified location</li>
                  <li>• Join our charity run on race day!</li>
                </ul>
              </div>
            )}

            {status === "processing" && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-sm text-yellow-800 mb-2">Please Wait</h3>
                <p className="text-sm text-yellow-700">
                  Your payment is being confirmed. This usually takes a few minutes. 
                  You can check your order status by visiting the checkout page with your order reference.
                </p>
              </div>
            )}

            {(status === "failed" || status === "error") && (
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-sm text-red-800 mb-2">Need Help?</h3>
                <p className="text-sm text-red-700">
                  If you continue to experience issues, please contact our support team 
                  with your order reference number.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              {status === "paid" && (
                <Button 
                  onClick={() => router.push("/")}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Return to Home
                </Button>
              )}
              
              {status === "processing" && (
                <Button 
                  onClick={() => router.push("/checkout")}
                  className="w-full bg-yellow-600 hover:bg-yellow-700"
                >
                  Check Payment Status
                </Button>
              )}

              {(status === "failed" || status === "error") && (
                <>
                  <Button 
                    onClick={() => router.push("/shop")}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Try Again
                  </Button>
                  <Button 
                    onClick={() => router.push("/contact")}
                    variant="outline"
                    className="w-full"
                  >
                    Contact Support
                  </Button>
                </>
              )}

              {!status && (
                <Button 
                  onClick={() => router.push("/")}
                  variant="outline"
                  className="w-full"
                >
                  Return to Home
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading payment result...</div>
          </CardContent>
        </Card>
      </div>
    }>
      <PaymentResultContent />
    </Suspense>
  );
}
