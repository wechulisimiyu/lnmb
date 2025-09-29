"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart, ArrowLeft } from "lucide-react";

interface DonationFormData {
  name: string;
  phone: string;
  email: string;
  amount: string;
}

export default function DonatePage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<DonationFormData>({
    name: "",
    phone: "",
    email: "",
    amount: "",
  });

  const [errors, setErrors] = useState<Partial<DonationFormData>>({});

  const handleInputChange = (field: keyof DonationFormData, value: string) => {
    // Auto-correct phone number format
    if (field === "phone") {
      // Remove all non-digits
      const digitsOnly = value.replace(/\D/g, "");
      
      // Handle different formats
      if (digitsOnly.startsWith("0")) {
        // Remove leading 0 for 0796105948 format
        value = digitsOnly.slice(1);
      } else if (digitsOnly.startsWith("254")) {
        // Remove country code for +254796105948 format
        value = digitsOnly.slice(3);
      } else {
        value = digitsOnly;
      }
    }

    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<DonationFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^7\d{8}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number (e.g., 796105948)";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.amount.trim()) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Create donation order data similar to the t-shirt order
    const donationData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      totalAmount: Number(formData.amount),
      orderReference: `DON-${Date.now()}`,
      type: "donation",
      // Add other required fields for checkout
      student: "no",
      attending: "not-attending",
      tshirtType: "donation",
      tshirtSize: "N/A",
      quantity: 0,
      nameOfKin: "",
      kinNumber: "",
      medicalCondition: "None",
      confirm: "yes",
      paid: false,
    };

    // Save to localStorage and redirect to checkout
    localStorage.setItem("pendingOrder", JSON.stringify(donationData));
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-600 p-3 rounded-full">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Support Our Mission
            </h1>
            <p className="text-gray-600">
              Your donation helps us support medical students and ensure no medic is left behind
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Make a Donation</CardTitle>
            <CardDescription>
              Fill in your details to make a secure donation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                    +254
                  </span>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="796105948"
                    className="rounded-l-none"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Donation Amount (KES) *</Label>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  placeholder="Enter amount in KES"
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm">{errors.amount}</p>
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Your Impact</h3>
                <p className="text-blue-700 text-sm">
                  Your donation will directly support medical students with resources, 
                  textbooks, and opportunities to build their skills and knowledge. 
                  Every contribution makes a difference in shaping tomorrow's healthcare heroes.
                </p>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-3">
                <Heart className="w-5 h-5 mr-2" />
                Donate KES {formData.amount || "0"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}