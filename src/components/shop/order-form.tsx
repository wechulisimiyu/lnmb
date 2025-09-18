"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, AlertTriangle, Info } from "lucide-react";

interface OrderFormData {
  student: string;
  university?: string;
  yearOfStudy?: string;
  regNumber?: string;
  attending: string;
  tshirtType: string;
  tshirtSize: string;
  quantity: number;
  name: string;
  email: string;
  phone: string;
  nameOfKin: string;
  kinNumber: string;
  medicalCondition: string;
  pickUp?: string;
  confirm: string;
}

export default function OrderForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<OrderFormData>({
    student: "",
    university: "",
    yearOfStudy: "",
    regNumber: "",
    attending: "",
    tshirtType: "",
    tshirtSize: "",
    quantity: 1,
    name: "",
    email: "",
    phone: "",
    nameOfKin: "",
    kinNumber: "",
    medicalCondition: "",
    pickUp: "",
    confirm: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // T-shirt pricing
  const POLO_PRICE = 1500;
  const ROUND_PRICE = 1200;
  
  const calculateTotal = () => {
    const basePrice = formData.tshirtType === "polo" ? POLO_PRICE : 
                     formData.tshirtType === "round" ? ROUND_PRICE : 0;
    return basePrice * formData.quantity;
  };

  const handleInputChange = (field: keyof OrderFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.student) newErrors.student = "Please select if you are a student";
    if (!formData.attending) newErrors.attending = "Please select if you will attend the run";
    if (!formData.tshirtType) newErrors.tshirtType = "Please select t-shirt type";
    if (!formData.tshirtSize) newErrors.tshirtSize = "Please select t-shirt size";
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.nameOfKin.trim()) newErrors.nameOfKin = "Next of kin name is required";
    if (!formData.kinNumber.trim()) newErrors.kinNumber = "Next of kin phone number is required";
    if (!formData.medicalCondition.trim()) newErrors.medicalCondition = "Medical condition field is required";
    if (!formData.confirm) newErrors.confirm = "Please confirm the terms and conditions";

    // Student-specific validation
    if (formData.student === "yes") {
      if (!formData.university) newErrors.university = "Please select your university";
      if (!formData.yearOfStudy) newErrors.yearOfStudy = "Please select your year of study";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation (Kenyan format)
    const phoneRegex = /^[7][0-9]{8}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number (format: 7XXXXXXXX)";
    }
    if (formData.kinNumber && !phoneRegex.test(formData.kinNumber)) {
      newErrors.kinNumber = "Please enter a valid phone number (format: 7XXXXXXXX)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Calculate total amount
      const totalAmount = calculateTotal();
      
      // Create order reference
      const orderReference = `LNMB${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      
      // Prepare order data
      const orderData = {
        ...formData,
        totalAmount,
        orderReference,
        paid: false,
      };
      
      // Store order data in localStorage for checkout page
      localStorage.setItem("pendingOrder", JSON.stringify(orderData));
      
      // Redirect to checkout
      router.push("/checkout");
      
    } catch (error) {
      console.error("Error processing order:", error);
      setErrors({ general: "An error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-600">
            Order Your T-Shirt
          </CardTitle>
          <CardDescription>
            Fill in your details to proceed with your order. All fields marked with * are required.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Catalog Alert */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Before ordering:</strong> View our{" "}
              <a 
                href="https://drive.google.com/drive/folders/1sNyBxlP0RlHGnhNAj2Mgr9C5YAsnTMLk" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                T-shirt catalog
              </a>{" "}
              to see available designs and styles.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student Status */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Are you a student? *</Label>
              <RadioGroup
                value={formData.student}
                onValueChange={(value: string) => handleInputChange("student", value)}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="student-yes" />
                  <Label htmlFor="student-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="student-no" />
                  <Label htmlFor="student-no">No</Label>
                </div>
              </RadioGroup>
              {errors.student && <p className="text-red-500 text-sm">{errors.student}</p>}
            </div>

            {/* Student-specific fields */}
            {formData.student === "yes" && (
              <div className="space-y-4 border-l-4 border-blue-200 pl-4">
                <div className="space-y-2">
                  <Label htmlFor="university">University *</Label>
                  <Select value={formData.university} onValueChange={(value) => handleInputChange("university", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your university" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uon">University of Nairobi</SelectItem>
                      <SelectItem value="partner">KU, Egerton, JKUAT, MKU</SelectItem>
                      <SelectItem value="other">Other Universities</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.university && <p className="text-red-500 text-sm">{errors.university}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearOfStudy">Year of Study *</Label>
                  <Select value={formData.yearOfStudy} onValueChange={(value) => handleInputChange("yearOfStudy", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your year of study" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="I">First year</SelectItem>
                      <SelectItem value="II">Second year</SelectItem>
                      <SelectItem value="III">Third year</SelectItem>
                      <SelectItem value="IV">Fourth year in session</SelectItem>
                      <SelectItem value="IVs">Incoming fifth year</SelectItem>
                      <SelectItem value="V">Fifth year</SelectItem>
                      <SelectItem value="VI">Sixth year</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.yearOfStudy && <p className="text-red-500 text-sm">{errors.yearOfStudy}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="regNumber">Registration Number</Label>
                  <Input
                    id="regNumber"
                    value={formData.regNumber}
                    onChange={(e) => handleInputChange("regNumber", e.target.value)}
                    placeholder="e.g., H31/12345/2010"
                  />
                </div>
              </div>
            )}

            {/* Attendance */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Will you attend the run on race day? *</Label>
              <RadioGroup
                value={formData.attending}
                onValueChange={(value: string) => handleInputChange("attending", value)}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="attending" id="attending-yes" />
                  <Label htmlFor="attending-yes">Yes, I will attend</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="notattending" id="attending-no" />
                  <Label htmlFor="attending-no">Just buying a T-shirt</Label>
                </div>
              </RadioGroup>
              {errors.attending && <p className="text-red-500 text-sm">{errors.attending}</p>}
            </div>

            {/* T-shirt Details */}
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg text-gray-800">T-shirt Details</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tshirtType">T-shirt Type *</Label>
                  <Select value={formData.tshirtType} onValueChange={(value) => handleInputChange("tshirtType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select t-shirt type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="polo">
                        <div className="flex justify-between items-center w-full">
                          <span>Polo Neck</span>
                          <Badge variant="secondary">KES {POLO_PRICE}</Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="round">
                        <div className="flex justify-between items-center w-full">
                          <span>Round Neck</span>
                          <Badge variant="secondary">KES {ROUND_PRICE}</Badge>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.tshirtType && <p className="text-red-500 text-sm">{errors.tshirtType}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tshirtSize">T-shirt Size *</Label>
                  <Select value={formData.tshirtSize} onValueChange={(value) => handleInputChange("tshirtSize", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                      <SelectItem value="extra-large">Extra Large</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.tshirtSize && <p className="text-red-500 text-sm">{errors.tshirtSize}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity (Max 3) *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  max={3}
                  value={formData.quantity}
                  onChange={(e) => handleInputChange("quantity", parseInt(e.target.value) || 1)}
                  className="w-32"
                />
              </div>

              {/* Total Amount Display */}
              {formData.tshirtType && formData.quantity > 0 && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-lg font-semibold text-blue-800">
                    Total Amount: KES {calculateTotal().toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-800">Personal Information</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
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
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
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
                    placeholder="700000000"
                    className="rounded-l-none"
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-800">Emergency Contact</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nameOfKin">Next of Kin Name *</Label>
                  <Input
                    id="nameOfKin"
                    value={formData.nameOfKin}
                    onChange={(e) => handleInputChange("nameOfKin", e.target.value)}
                    placeholder="Emergency contact name"
                  />
                  {errors.nameOfKin && <p className="text-red-500 text-sm">{errors.nameOfKin}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kinNumber">Next of Kin Phone Number *</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                      +254
                    </span>
                    <Input
                      id="kinNumber"
                      value={formData.kinNumber}
                      onChange={(e) => handleInputChange("kinNumber", e.target.value)}
                      placeholder="700000000"
                      className="rounded-l-none"
                    />
                  </div>
                  {errors.kinNumber && <p className="text-red-500 text-sm">{errors.kinNumber}</p>}
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="space-y-2">
              <Label htmlFor="medicalCondition">Any medical condition? *</Label>
              <Input
                id="medicalCondition"
                value={formData.medicalCondition}
                onChange={(e) => handleInputChange("medicalCondition", e.target.value)}
                placeholder="Enter any medical conditions or 'None'"
              />
              {errors.medicalCondition && <p className="text-red-500 text-sm">{errors.medicalCondition}</p>}
            </div>

            {/* Pick-up Point */}
            <div className="space-y-2">
              <Label htmlFor="pickUp">Pick-up Point</Label>
              <Select value={formData.pickUp} onValueChange={(value) => handleInputChange("pickUp", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a pick-up point" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kenyatta-national-hospital">Kenyatta National Hospital</SelectItem>
                  <SelectItem value="chiromo-campus">Chiromo Campus, University of Nairobi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-3">
              <RadioGroup
                value={formData.confirm}
                onValueChange={(value: string) => handleInputChange("confirm", value)}
              >
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="confirm" id="confirm" className="mt-1" />
                  <Label htmlFor="confirm" className="text-sm leading-relaxed">
                    I confirm that I am in good physical health to participate in the Leave No Medic Behind Charity Run. 
                    I will follow the laid out trail and directions of the race organizers. I acknowledge that the Charity 
                    run may pose possible risk and danger due to the nature of the activity and I release the Charity Run 
                    organizers from any responsibility in the event of any accident, illness or injury. I understand my 
                    contact information may be used to reach out to me for feedback on the activities related to the 
                    Charity run. I confirm that all the details provided above are accurate and true. *
                  </Label>
                </div>
              </RadioGroup>
              {errors.confirm && <p className="text-red-500 text-sm">{errors.confirm}</p>}
            </div>

            {/* General Error */}
            {errors.general && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6"
              >
                {isSubmitting ? (
                  <>Processing...</>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Proceed to Payment (M-PESA)
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
