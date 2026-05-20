"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Inbox,
} from "lucide-react";

function PaymentResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  // 'checking' indicates whether the client is polling the server for status.
  // It's intentionally unused directly in the render but useful for debugging; keep the state to preserve intent.
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    setStatus(searchParams.get("status"));
    setReference(searchParams.get("reference"));
    setTransactionId(searchParams.get("transactionId"));
    setMessage(searchParams.get("message"));
  }, [searchParams]);

  // If status is missing or unknown, try to fetch authoritative status from server
  useEffect(() => {
    let mounted = true;

    async function fetchStatus() {
      if (!mounted) return;

      // Only attempt check when status is null or 'unknown' (or empty)
      if (status && status !== "unknown") return;

      // Need at least a reference or transactionId to check
      if (!reference && !transactionId) return;

      setChecking(true);

      const params = new URLSearchParams();
      if (reference) params.set("reference", reference);
      if (transactionId) params.set("transactionId", transactionId);

      // Polling: try a few times with small delays to account for webhook/write races
      for (let attempt = 0; attempt < 5; attempt++) {
        try {
          const res = await fetch(`/api/checkout/status?${params.toString()}`);
          if (!res.ok) {
            // wait and retry
            await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
            continue;
          }

          const body = await res.json();
          if (body && body.success && body.payment) {
            const payment = body.payment as {
              status?: string;
              transactionId?: string;
            };
            if (payment.status) {
              // Map backend payment.status to UI status expectations
              let mapped = payment.status;
              if (mapped === "processing") mapped = "processing";
              if (mapped === "paid") mapped = "paid";
              if (mapped === "failed") mapped = "failed";

              if (mounted) {
                setStatus(mapped);
                if (payment.transactionId)
                  setTransactionId(payment.transactionId);
                setMessage(null);
                setChecking(false);
              }
              return;
            }
          }

          // If not found, wait a bit and try again
          await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
        } catch (error) {
          // ignore transient errors and retry; log in development

          if (process.env.NODE_ENV === "development")
            console.debug("status check error", error);
          await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
        }
      }

      if (mounted) {
        setChecking(false);
        // if still unknown after retries, surface user-friendly guidance
        setMessage(
          "We couldn't confirm your payment immediately. Please check your bank/app for a transaction receipt or contact support with your order reference.",
        );
      }
    }

    fetchStatus();

    return () => {
      mounted = false;
    };
  }, [status, reference, transactionId]);

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
        return <Inbox className="h-16 w-16 text-gray-500" />;
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
        return "Check your email";
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
        return "You will receive an email confirmation shortly with your order details.";
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
            <div className="mx-auto mb-4">{getStatusIcon()}</div>
            <CardTitle className={`text-2xl ${getStatusColor()}`}>
              {getStatusTitle()}
            </CardTitle>
            <CardDescription className="text-center">
              {getStatusMessage()}
              {checking && !status && (
                <div className="text-xs text-slate-500 mt-2">
                  Checking payment status...
                </div>
              )}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Order Details */}
            {reference && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-sm text-gray-700 mb-2">
                  Order Details
                </h3>
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
                <h3 className="font-semibold text-sm text-green-800 mb-2">
                  What&apos;s Next?
                </h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Check your email for order confirmation</li>
                  <li>
                    • Your t-shirt will be available for pickup at the specified
                    location
                  </li>
                  <li>• Join our charity run on race day!</li>
                </ul>
              </div>
            )}

            {status === "processing" && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-sm text-yellow-800 mb-2">
                  Please Wait
                </h3>
                <p className="text-sm text-yellow-700">
                  Your payment is being confirmed. This usually takes a few
                  minutes. You can check your order status by visiting the
                  checkout page with your order reference.
                </p>
              </div>
            )}

            {(status === "failed" || status === "error") && (
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-sm text-red-800 mb-2">
                  Need Help?
                </h3>
                <p className="text-sm text-red-700">
                  If you continue to experience issues, please contact our
                  support team with your order reference number.
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
                    onClick={() => {
                      const subject = encodeURIComponent(
                        `Help needed: payment ${reference || "(no-ref)"}`,
                      );
                      const body = encodeURIComponent(
                        `Order Reference: ${reference || "N/A"}%0D%0ATransaction ID: ${transactionId || "N/A"}%0D%0A\nPlease describe what happened:`,
                      );
                      window.location.href = `mailto:info@lnmb-run.org?subject=${subject}&body=${body}`;
                    }}
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
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">Loading payment result...</div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <PaymentResultContent />
    </Suspense>
  );
}
