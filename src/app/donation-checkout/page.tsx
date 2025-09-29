"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CreditCard, Smartphone, ArrowLeft } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useMutation, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface DonationData {
  name: string;
  email: string;
  phone: string;
  totalAmount: number;
  orderReference: string;
  paid: boolean;
}

export default function DonationCheckoutPage() {
  const router = useRouter();
  const [donationData, setDonationData] = useState<DonationData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("mpesa");
  const [paymentFormData, setPaymentFormData] = useState<Record<
    string,
    string
  > | null>(null);

  const createOrder = useMutation(api.orders.createOrder);
  const createPaymentRecord = useAction(api.orders.createPaymentRecord);

  useEffect(() => {
    const saved = localStorage.getItem("pendingOrder");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Expecting donation-type pendingOrder
        setDonationData(parsed as DonationData);
      } catch (err) {
        console.error("Failed to parse donation data", err);
        router.push("/donate");
      }
    } else {
      router.push("/donate");
    }
  }, [router]);

  const handleProcessPayment = async () => {
    if (!donationData) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Create a simplified order record for the donation
      await createOrder({
        student: "no",
        attending: "not-attending",
        tshirtType: "donation",
        tshirtSize: "N/A",
        quantity: 0,
        totalAmount: donationData.totalAmount,
        name: donationData.name,
        email: donationData.email,
        phone: donationData.phone,
        nameOfKin: "",
        kinNumber: "",
        medicalCondition: "None",
        pickUp: "",
        confirm: "yes",
        orderReference: donationData.orderReference,
      });

      // Create payment record (use the existing orders.createPaymentRecord action)
      const [firstName, ...lastNameParts] = donationData.name.split(" ");
      const lastName = lastNameParts.join(" ") || firstName;

      const paymentRecord = await createPaymentRecord({
        orderReference: donationData.orderReference,
        orderAmount: donationData.totalAmount,
        customerFirstName: firstName,
        customerLastName: lastName,
        customerEmail: donationData.email,
        customerPhone: `254${donationData.phone}`,
        customerAddress: "Nairobi, Kenya",
        productDescription: `Donation - Leave No Medic Behind`,
      });

      // Save payment data for the Jenga form submission
      if (paymentRecord && paymentRecord.paymentData) {
        setPaymentFormData(paymentRecord.paymentData);
      }

      // Clear localStorage pendingOrder
      localStorage.removeItem("pendingOrder");
    } catch (err) {
      console.error(err);
      setError("Failed to process donation. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper to submit to Jenga PGW by creating and posting a form with paymentFormData
  const submitToJengaPGW = () => {
    if (!paymentFormData) return;

    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://v3-uat.jengapgw.io/processPayment";

    Object.entries(paymentFormData).forEach(([name, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = String(value);
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  if (!donationData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading donation checkout...</p>
        </div>
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
            Back to Donate
          </Button>

          <h1 className="text-3xl font-bold text-gray-900">
            Donation Checkout
          </h1>
          <p className="text-gray-600 mt-2">
            Review your donation and complete payment
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Donation Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-b pb-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Name:</span>
                    <span>{donationData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span>{donationData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone:</span>
                    <span>+254{donationData.phone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Donation Amount:</span>
                  <span className="text-blue-600">
                    KES {donationData.totalAmount.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Reference: {donationData.orderReference}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
              <CardDescription>
                Complete your donation using M-PESA or card
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base font-semibold">
                  Select Payment Method
                </Label>
                <RadioGroup
                  value={selectedPaymentMethod}
                  onValueChange={setSelectedPaymentMethod}
                  className="space-y-3"
                >
                  <div
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      selectedPaymentMethod === "mpesa"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedPaymentMethod("mpesa")}
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="mpesa" id="mpesa" />
                      <Smartphone className="h-6 w-6 text-blue-600" />
                      <div className="flex-1">
                        <Label
                          htmlFor="mpesa"
                          className="font-semibold cursor-pointer"
                        >
                          M-PESA Payment
                        </Label>
                        <p className="text-sm text-gray-700 mt-1">
                          Pay using M-PESA STK Push or other mobile money
                          methods
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      selectedPaymentMethod === "card"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedPaymentMethod("card")}
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="card" id="card" />
                      <CreditCard className="h-6 w-6 text-gray-600" />
                      <div className="flex-1">
                        <Label
                          htmlFor="card"
                          className="font-semibold cursor-pointer"
                        >
                          Card Payment
                        </Label>
                        <p className="text-sm text-gray-700 mt-1">
                          Visa, Mastercard, and other supported card payments
                        </p>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {!paymentFormData ? (
                <Button
                  onClick={handleProcessPayment}
                  disabled={isProcessing}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing Donation...
                    </>
                  ) : (
                    <>
                      {selectedPaymentMethod === "mpesa" ? (
                        <Smartphone className="w-5 h-5 mr-2" />
                      ) : (
                        <CreditCard className="w-5 h-5 mr-2" />
                      )}
                      Proceed with{" "}
                      {selectedPaymentMethod === "mpesa" ? "M-PESA" : "Card"}{" "}
                      Payment
                    </>
                  )}
                </Button>
              ) : (
                <>
                  <Alert>
                    <AlertDescription>
                      Your payment has been prepared. Click the button below to
                      complete your payment securely through Jenga Payment
                      Gateway.
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
      </div>
    </div>
  );
}
