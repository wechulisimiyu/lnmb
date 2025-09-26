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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, AlertTriangle, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { matchUniversity } from "@/lib/normalizeUniversity";
import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import Image from "next/image";

interface OrderFormData {
  // Step 1: Product Selection
  tshirtType: string;
  tshirtSize: string;
  quantity: number;
  student: string;
  university?: string;
  universityUserEntered?: boolean;
  unitPrice: number;
  totalAmount: number;
  
  // Step 2: Personal & Registration Details
  graduationYear?: string;
  regNumber?: string;
  name: string;
  email: string;
  phone: string;
  nameOfKin: string;
  kinNumber: string;
  medicalCondition: string;
  pickUp?: string;
  
  // Step 3: Attendance & Liability
  attending: string;
  confirm: string;
}

// Pricing constants from PRD (authoritative)
const PRICING = {
  polo: { regular: 1500, student: 1000 },
  round: { regular: 1000, student: 600 },
};

const STEPS = {
  PRODUCT_SELECTION: 1,
  PERSONAL_DETAILS: 2,
  ATTENDANCE_LIABILITY: 3,
  REVIEW: 4,
} as const;

const STEP_TITLES = {
  [STEPS.PRODUCT_SELECTION]: "Choose Your T-shirt",
  [STEPS.PERSONAL_DETAILS]: "Personal Information", 
  [STEPS.ATTENDANCE_LIABILITY]: "Event & Liability",
  [STEPS.REVIEW]: "Review & Confirm",
} as const;

export default function OrderForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(STEPS.PRODUCT_SELECTION);
  const [formData, setFormData] = useState<OrderFormData>({
    // Step 1: Product Selection
    tshirtType: "",
    tshirtSize: "",
    quantity: 1,
    student: "",
    university: "",
    universityUserEntered: false,
    unitPrice: 0,
    totalAmount: 0,
    
    // Step 2: Personal & Registration Details
    graduationYear: "",
    regNumber: "",
    name: "",
    email: "",
    phone: "",
    nameOfKin: "",
    kinNumber: "",
    medicalCondition: "",
    pickUp: "",
    
    // Step 3: Attendance & Liability
    attending: "",
    confirm: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [universities, setUniversities] = useState<string[] | null>(null);
  const [uniQuery, setUniQuery] = useState("");
  const [uniPopoverOpen, setUniPopoverOpen] = useState(false);
  const [showManualUniversity, setShowManualUniversity] = useState(false);

  // Calculate unit price based on product type and student status
  const getUnitPrice = (tshirtType: string, isStudent: boolean) => {
    if (!tshirtType) return 0;
    const pricing = PRICING[tshirtType as keyof typeof PRICING];
    if (!pricing) return 0;
    return isStudent ? pricing.student : pricing.regular;
  };

  // Update pricing when product or student status changes
  useEffect(() => {
    const isStudent = formData.student === "yes";
    const unitPrice = getUnitPrice(formData.tshirtType, isStudent);
    const totalAmount = unitPrice * formData.quantity;
    
    setFormData(prev => ({
      ...prev,
      unitPrice,
      totalAmount
    }));
  }, [formData.tshirtType, formData.student, formData.quantity]);

  // Save draft to localStorage
  useEffect(() => {
    const draft = { ...formData, currentStep };
    localStorage.setItem("orderFormDraft", JSON.stringify(draft));
  }, [formData, currentStep]);

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const draft = localStorage.getItem("orderFormDraft");
      if (draft) {
        const parsed = JSON.parse(draft);
        setFormData(parsed);
        setCurrentStep(parsed.currentStep || STEPS.PRODUCT_SELECTION);
      }
    } catch (error) {
      console.error("Failed to load draft:", error);
    }
  }, []);

  const handleInputChange = (
    field: keyof OrderFormData,
    value: string | number | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Step-specific validation
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case STEPS.PRODUCT_SELECTION:
        if (!formData.tshirtType) newErrors.tshirtType = "Please select t-shirt type";
        if (!formData.tshirtSize) newErrors.tshirtSize = "Please select t-shirt size";
        if (formData.quantity < 1 || formData.quantity > 3) newErrors.quantity = "Quantity must be between 1 and 3";
        if (!formData.student) newErrors.student = "Please select if you are a student";
        
        if (formData.student === "yes") {
          if (!formData.university) newErrors.university = "Please select your university";
        }
        break;

      case STEPS.PERSONAL_DETAILS:
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        if (!formData.nameOfKin.trim()) newErrors.nameOfKin = "Next of kin name is required";
        if (!formData.kinNumber.trim()) newErrors.kinNumber = "Next of kin phone number is required";
        if (!formData.medicalCondition.trim()) newErrors.medicalCondition = "Medical condition field is required";

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

        // Student-specific validation
        if (formData.student === "yes") {
          if (!formData.graduationYear) newErrors.graduationYear = "Please select your graduation year";
        }
        break;

      case STEPS.ATTENDANCE_LIABILITY:
        if (!formData.attending) newErrors.attending = "Please select if you will attend the run";
        if (!formData.confirm) newErrors.confirm = "Please confirm the terms and conditions";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.REVIEW) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > STEPS.PRODUCT_SELECTION) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Lazy-load universities JSON when student toggle is enabled
  useEffect(() => {
    let mounted = true;
    if (formData.student === "yes" && universities === null) {
      import("../../data/universities.json")
        .then((mod) => {
          if (!mounted) return;
          const list = Array.isArray(mod.default || mod)
            ? mod.default || mod
            : [];
          setUniversities(list as string[]);
        })
        .catch((err) => {
          console.error("Failed to load universities list", err);
          setUniversities([]);
        });
    }
    return () => {
      mounted = false;
    };
  }, [formData.student]);

  const filteredUniversities = React.useMemo(() => {
    if (!universities) return [];
    const q = uniQuery.trim().toLowerCase();
    if (!q) return universities.slice(0, 50);
    return universities.filter((u) => u.toLowerCase().includes(q)).slice(0, 50);
  }, [universities, uniQuery]);

  const handleSelectUniversity = (value: string) => {
    if (value === "__manual__") {
      setShowManualUniversity(true);
      setFormData((prev) => ({
        ...prev,
        university: "",
        universityUserEntered: true,
      }));
    } else {
      setShowManualUniversity(false);
      setFormData((prev) => ({
        ...prev,
        university: value,
        universityUserEntered: false,
      }));
    }
    setUniQuery("");
    setUniPopoverOpen(false);
  };

  const handleFinalSubmit = async () => {
    if (!validateStep(STEPS.ATTENDANCE_LIABILITY)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order reference
      const orderReference = `LNMB${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

      // Try to normalize university client-side if we have the canonical list
      let universityToSave = formData.university;
      let userEntered = !!formData.universityUserEntered;
      if (universities && formData.university) {
        const match = matchUniversity(formData.university, universities);
        if (match) {
          universityToSave = match;
          userEntered = false;
        } else {
          universityToSave = `Other: ${formData.university}`;
          userEntered = true;
        }
      }

      // Prepare order data for checkout
      const orderData = {
        ...formData,
        university: universityToSave,
        universityUserEntered: userEntered,
        orderReference,
        paid: false,
      };

      // Store as pendingOrder for checkout page
      localStorage.setItem("pendingOrder", JSON.stringify(orderData));
      
      // Clear draft
      localStorage.removeItem("orderFormDraft");

      // Redirect to checkout
      router.push("/checkout");
    } catch (error) {
      console.error("Error processing order:", error);
      setErrors({ general: "An error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8 space-x-2">
      {Object.values(STEPS).map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              currentStep >= step
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {step}
          </div>
          {step < STEPS.REVIEW && (
            <div
              className={`w-12 h-1 mx-2 ${
                currentStep > step ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderProductCard = (type: "polo" | "round") => {
    const pricing = PRICING[type];
    const isStudent = formData.student === "yes";
    const currentPrice = isStudent ? pricing.student : pricing.regular;
    const isSelected = formData.tshirtType === type;

    return (
      <div
        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
          isSelected
            ? "border-blue-600 bg-blue-50"
            : "border-gray-200 hover:border-gray-300"
        }`}
        onClick={() => handleInputChange("tshirtType", type)}
      >
        <div className="relative aspect-square mb-4">
          <Image
            src="/images/shop/lnmb-tshirt-2025.webp"
            alt={`${type === "polo" ? "Polo" : "Round"} Neck T-shirt`}
            fill
            className="object-cover rounded-md"
          />
        </div>
        <div className="text-center">
          <h3 className="font-semibold text-lg mb-2">
            {type === "polo" ? "Polo Neck" : "Round Neck"} T-shirt
          </h3>
          <div className="space-y-1">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-xl font-bold text-blue-600">
                KES {currentPrice.toLocaleString()}
              </span>
              {isStudent && pricing.regular > currentPrice && (
                <span className="text-sm text-gray-400 line-through">
                  KES {pricing.regular.toLocaleString()}
                </span>
              )}
            </div>
            {isStudent && pricing.regular > currentPrice && (
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                Student Discount
              </Badge>
            )}
            {isStudent && (
              <p className="text-sm text-green-600">
                Save KES {(pricing.regular - currentPrice).toLocaleString()}!
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case STEPS.PRODUCT_SELECTION:
        return renderProductSelection();
      case STEPS.PERSONAL_DETAILS:
        return renderPersonalDetails();
      case STEPS.ATTENDANCE_LIABILITY:
        return renderAttendanceLiability();
      case STEPS.REVIEW:
        return renderReview();
      default:
        return null;
    }
  };

  const renderNavigation = () => (
    <div className="flex justify-between mt-6">
      <Button
        variant="outline"
        onClick={prevStep}
        disabled={currentStep === STEPS.PRODUCT_SELECTION}
        className="flex items-center"
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Previous
      </Button>

      {currentStep < STEPS.REVIEW ? (
        <Button onClick={nextStep} className="flex items-center">
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      ) : (
        <Button
          onClick={handleFinalSubmit}
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
        >
          {isSubmitting ? (
            "Processing..."
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Proceed to Payment
            </>
          )}
        </Button>
      )}
    </div>
  );

  const renderProductSelection = () => (
    <div className="space-y-6">
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
        {errors.student && (
          <p className="text-red-500 text-sm">{errors.student}</p>
        )}
        {formData.student === "yes" && (
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-green-700 text-sm">
              🎓 Student discount activated! You save up to KES 400 per t-shirt.
            </p>
          </div>
        )}
      </div>

      {/* University Selection */}
      {formData.student === "yes" && (
        <div className="space-y-4">
          <Label htmlFor="university">University *</Label>
          {!universities ? (
            <div className="text-sm text-gray-500">Loading universities...</div>
          ) : (
            <Popover open={uniPopoverOpen} onOpenChange={setUniPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={uniPopoverOpen}
                  className="w-full justify-between"
                >
                  <span className="truncate">
                    {formData.university
                      ? formData.university
                      : "Search or select your university..."}
                  </span>
                  {formData.university && !showManualUniversity ? (
                    <Check className="ml-2 h-4 w-4 text-green-600" />
                  ) : null}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search university..."
                    value={uniQuery}
                    onValueChange={(v: string) => setUniQuery(v)}
                  />
                  <CommandList>
                    <CommandEmpty>No university found.</CommandEmpty>
                    <CommandGroup>
                      {filteredUniversities.map((u) => (
                        <CommandItem
                          key={u}
                          value={u}
                          onSelect={() => handleSelectUniversity(u)}
                        >
                          {u}
                        </CommandItem>
                      ))}
                      <CommandItem
                        value="__manual__"
                        onSelect={() => handleSelectUniversity("__manual__")}
                      >
                        My university isn&apos;t listed
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}

          {showManualUniversity && (
            <div className="space-y-2">
              <Input
                placeholder="Type your university"
                value={formData.university}
                onChange={(e) => handleInputChange("university", e.target.value)}
              />
            </div>
          )}
          {errors.university && (
            <p className="text-red-500 text-sm">{errors.university}</p>
          )}
        </div>
      )}

      {/* Product Selection Cards */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Choose Your T-shirt *</Label>
        <div className="grid md:grid-cols-2 gap-6">
          {renderProductCard("polo")}
          {renderProductCard("round")}
        </div>
        {errors.tshirtType && (
          <p className="text-red-500 text-sm">{errors.tshirtType}</p>
        )}
      </div>

      {/* Size and Quantity Selection */}
      {formData.tshirtType && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tshirtSize">Size *</Label>
            <div className="grid grid-cols-4 gap-2">
              {["small", "medium", "large", "extra-large"].map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                    formData.tshirtSize === size
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                  }`}
                  onClick={() => handleInputChange("tshirtSize", size)}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </button>
              ))}
            </div>
            {errors.tshirtSize && (
              <p className="text-red-500 text-sm">{errors.tshirtSize}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity (Max 3) *</Label>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleInputChange("quantity", Math.max(1, formData.quantity - 1))}
                disabled={formData.quantity <= 1}
              >
                -
              </Button>
              <Input
                type="number"
                min={1}
                max={3}
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", parseInt(e.target.value) || 1)}
                className="w-20 text-center"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleInputChange("quantity", Math.min(3, formData.quantity + 1))}
                disabled={formData.quantity >= 3}
              >
                +
              </Button>
            </div>
            {errors.quantity && (
              <p className="text-red-500 text-sm">{errors.quantity}</p>
            )}
          </div>
        </div>
      )}

      {/* Price Summary */}
      {formData.tshirtType && formData.quantity > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">Order Summary</p>
              <p className="text-sm text-gray-600">
                {formData.quantity}x {formData.tshirtType === "polo" ? "Polo" : "Round"} Neck T-shirt ({formData.tshirtSize})
              </p>
              {formData.student === "yes" && (
                <p className="text-sm text-green-600">Student discount applied</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-800">
                KES {formData.totalAmount.toLocaleString()}
              </p>
              {formData.student === "yes" && formData.unitPrice > 0 && (
                <p className="text-sm text-gray-600">
                  (KES {formData.unitPrice.toLocaleString()} each)
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderPersonalDetails = () => (
    <div className="space-y-6">
      {/* Student-specific fields */}
      {formData.student === "yes" && (
        <div className="space-y-4 border-l-4 border-blue-200 pl-4">
          <h4 className="font-semibold text-gray-800">Student Information</h4>
          <div className="space-y-2">
            <Label htmlFor="graduationYear">Graduation Year *</Label>
            <Select
              value={formData.graduationYear}
              onValueChange={(value) => handleInputChange("graduationYear", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your graduation year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2027">2027</SelectItem>
                <SelectItem value="2028">2028</SelectItem>
                <SelectItem value="2029">2029</SelectItem>
                <SelectItem value="2030">2030</SelectItem>
              </SelectContent>
            </Select>
            {errors.graduationYear && (
              <p className="text-red-500 text-sm">{errors.graduationYear}</p>
            )}
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

      {/* Personal Information */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-800">Personal Information</h4>
        <div className="grid md:grid-cols-2 gap-4">
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
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-800">Emergency Contact</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nameOfKin">Next of Kin Name *</Label>
            <Input
              id="nameOfKin"
              value={formData.nameOfKin}
              onChange={(e) => handleInputChange("nameOfKin", e.target.value)}
              placeholder="Emergency contact name"
            />
            {errors.nameOfKin && (
              <p className="text-red-500 text-sm">{errors.nameOfKin}</p>
            )}
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
            {errors.kinNumber && (
              <p className="text-red-500 text-sm">{errors.kinNumber}</p>
            )}
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
        {errors.medicalCondition && (
          <p className="text-red-500 text-sm">{errors.medicalCondition}</p>
        )}
      </div>

      {/* Pick-up Point */}
      <div className="space-y-2">
        <Label htmlFor="pickUp">Pick-up Point</Label>
        <Select
          value={formData.pickUp}
          onValueChange={(value) => handleInputChange("pickUp", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a pick-up point" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kenyatta-national-hospital">
              Kenyatta National Hospital
            </SelectItem>
            <SelectItem value="chiromo-campus">
              Chiromo Campus, University of Nairobi
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderAttendanceLiability = () => (
    <div className="space-y-6">
      {/* Attendance */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">
          Will you attend the run on race day? *
        </Label>
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
        {errors.attending && (
          <p className="text-red-500 text-sm">{errors.attending}</p>
        )}
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
              I confirm that I am in good physical health to participate in the
              Leave No Medic Behind Charity Run. I will follow the laid out
              trail and directions of the race organizers. I acknowledge that
              the Charity run may pose possible risk and danger due to the
              nature of the activity and I release the Charity Run organizers
              from any responsibility in the event of any accident, illness or
              injury. I understand my contact information may be used to reach
              out to me for feedback on the activities related to the Charity
              run. I confirm that all the details provided above are accurate
              and true. *
            </Label>
          </div>
        </RadioGroup>
        {errors.confirm && (
          <p className="text-red-500 text-sm">{errors.confirm}</p>
        )}
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Please review your order details below. You can go back to make changes or proceed to payment.
        </AlertDescription>
      </Alert>

      {/* Order Summary */}
      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
        <h4 className="font-semibold text-lg">Order Summary</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-semibold text-gray-800 mb-2">Product Details</h5>
            <div className="space-y-1 text-sm">
              <p><strong>T-shirt:</strong> {formData.tshirtType === "polo" ? "Polo" : "Round"} Neck</p>
              <p><strong>Size:</strong> {formData.tshirtSize?.charAt(0).toUpperCase() + formData.tshirtSize?.slice(1)}</p>
              <p><strong>Quantity:</strong> {formData.quantity}</p>
              <p><strong>Student:</strong> {formData.student === "yes" ? "Yes" : "No"}</p>
              {formData.student === "yes" && formData.university && (
                <p><strong>University:</strong> {formData.university}</p>
              )}
            </div>
          </div>
          
          <div>
            <h5 className="font-semibold text-gray-800 mb-2">Contact Information</h5>
            <div className="space-y-1 text-sm">
              <p><strong>Name:</strong> {formData.name}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Phone:</strong> +254{formData.phone}</p>
              <p><strong>Next of Kin:</strong> {formData.nameOfKin} (+254{formData.kinNumber})</p>
              <p><strong>Medical Condition:</strong> {formData.medicalCondition}</p>
              {formData.pickUp && <p><strong>Pickup:</strong> {formData.pickUp.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Breakdown */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h5 className="font-semibold text-lg">Total Amount</h5>
            <div className="text-sm text-gray-600">
              <p>{formData.quantity}x {formData.tshirtType === "polo" ? "Polo" : "Round"} Neck @ KES {formData.unitPrice.toLocaleString()} each</p>
              {formData.student === "yes" && <p className="text-green-600">Student discount applied</p>}
              <p><strong>Attendance:</strong> {formData.attending === "attending" ? "Will attend" : "T-shirt only"}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-blue-800">
              KES {formData.totalAmount.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* General Error */}
      {errors.general && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{errors.general}</AlertDescription>
        </Alert>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {renderStepIndicator()}
      
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-600">
            {STEP_TITLES[currentStep]}
          </CardTitle>
          <CardDescription>
            {currentStep === STEPS.PRODUCT_SELECTION && "Choose your t-shirt design, size, and student status"}
            {currentStep === STEPS.PERSONAL_DETAILS && "Fill in your personal details and emergency contact"}
            {currentStep === STEPS.ATTENDANCE_LIABILITY && "Confirm your participation and accept terms"}
            {currentStep === STEPS.REVIEW && "Review your order before proceeding to payment"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">{renderStepContent()}</CardContent>
      </Card>
      
      {renderNavigation()}
    </div>
  );
}
