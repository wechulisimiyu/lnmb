"use client";

import { useState, useEffect, useRef } from "react";
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
import {
  ShoppingCart,
  AlertTriangle,
  Info,
  ChevronLeft,
  ChevronRight,
  Upload,
} from "lucide-react";
import { matchUniversity } from "@/lib/normalizeUniversity";
import generateOrderReference from "@/lib/generateOrderReference";
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
  // Product Selections
  roundSelected: boolean;
  roundSize: string;
  roundQuantity: number;
  poloSelected: boolean;
  poloSize: string;
  poloQuantity: number;
  
  student: string;
  university?: string;
  universityUserEntered?: boolean;
  unitPrice: number;
  totalAmount: number;

  // Step 2: Personal & Registration Details
  schoolIdFile?: File;
  schoolIdUrl?: string;
  schoolIdPublicId?: string;
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
  round: { regular: 1500, student: 850 },     // updated regular and student price
  polo: { regular: 2000, student: 1000 },
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
  type Step = (typeof STEPS)[keyof typeof STEPS];
  const [currentStep, setCurrentStep] = useState<Step>(STEPS.PRODUCT_SELECTION);
  const formRef = useRef<HTMLDivElement | null>(null);
  const [formData, setFormData] = useState<OrderFormData>({
    // Step 1: Product Selection
    roundSelected: true,
    roundSize: "",
    roundQuantity: 1,
    poloSelected: false,
    poloSize: "",
    poloQuantity: 1,
    student: "",
    university: "",
    universityUserEntered: false,
    unitPrice: 0,
    totalAmount: 0,

    // Step 2: Personal & Registration Details
    schoolIdFile: undefined,
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
  const [isUploadingSchoolId, setIsUploadingSchoolId] = useState(false);
  const [schoolIdUploadError, setSchoolIdUploadError] = useState<string | null>(
    null,
  );
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  // Maximum upload size (5MB)
  const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
  const [universities, setUniversities] = useState<string[] | null>(null);
  const [uniQuery, setUniQuery] = useState("");
  const [uniPopoverOpen, setUniPopoverOpen] = useState(false);
  const [showManualUniversity, setShowManualUniversity] = useState(false);

  // Calculate unit price based on product type and student status
  const getUnitPrice = (tshirtType: "round" | "polo", isStudent: boolean) => {
    const pricing = PRICING[tshirtType];
    return isStudent ? pricing.student : pricing.regular;
  };

  // Update pricing when product or student status changes
  useEffect(() => {
    const isStudent = formData.student === "yes";
    
    let totalAmount = 0;
    if (formData.roundSelected) {
      totalAmount += getUnitPrice("round", isStudent) * formData.roundQuantity;
    }
    if (formData.poloSelected) {
      totalAmount += getUnitPrice("polo", isStudent) * formData.poloQuantity;
    }

    setFormData((prev) => ({
      ...prev,
      totalAmount,
    }));
  }, [
    formData.roundSelected,
    formData.roundQuantity,
    formData.poloSelected,
    formData.poloQuantity,
    formData.student,
  ]);

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
    value: string | number | boolean | File,
  ) => {
    // Live-normalize phone-like fields so users can type 070... or 2547...
    if (field === "phone" || field === "kinNumber") {
      if (typeof value === "string") {
        let digits = value.replace(/\D/g, "");
        if (digits.startsWith("254")) digits = digits.slice(3);
        while (digits.startsWith("0")) digits = digits.slice(1);
        digits = digits.slice(0, 9);
        setFormData((prev) => ({ ...prev, [field]: digits }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Step-specific validation
  const validateStep = (step: Step): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case STEPS.PRODUCT_SELECTION:
        if (!formData.roundSelected && !formData.poloSelected) {
          newErrors.productSelection = "Please select at least one t-shirt type";
        }
        if (formData.roundSelected) {
          if (!formData.roundSize) newErrors.roundSize = "Please select a size for the Round Neck T-shirt";
          if (formData.roundQuantity < 1 || formData.roundQuantity > 5) newErrors.roundQuantity = "Quantity must be between 1 and 5";
        }
        if (formData.poloSelected) {
          if (!formData.poloSize) newErrors.poloSize = "Please select a size for the Polo Neck T-shirt";
          if (formData.poloQuantity < 1 || formData.poloQuantity > 5) newErrors.poloQuantity = "Quantity must be between 1 and 5";
        }
        if (!formData.student)
          newErrors.student = "Please select if you are a student";

        if (formData.student === "yes") {
          if (!formData.university)
            newErrors.university = "Please select your university";
        }
        break;

      case STEPS.PERSONAL_DETAILS:
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        // Normalize phone for validation without mutating UI immediately
        const normalizeKenyaPhone = (raw: string | undefined) => {
          if (!raw) return ""
          const digits = (raw || "").replace(/\D/g, "")
          // Already contains country code 254 or 257 (e.g. 2547xxxxxxxx)
          if (digits.startsWith("254") || digits.startsWith("257")) {
            // keep country + 9 digits if available
            if (digits.length >= 12) return digits.slice(0, 12)
            return digits
          }
          // Local numbers:
          // 0XXXXXXXXX (10 digits) -> drop leading 0 and prefix 254
          if (digits.length === 10 && digits.startsWith("0")) {
            return `254${digits.slice(1)}`
          }
          // 9-digit local like 7XXXXXXXX or 1XXXXXXXX -> prefix 254
          if (digits.length === 9) {
            return `254${digits}`
          }
          return digits
        }

        const normalizedPhoneForValidation = normalizeKenyaPhone(formData.phone as string)

        if (!formData.phone || !formData.phone.toString().trim())
          newErrors.phone = "Phone number is required";

        // Accept +254 or +257 (country code) followed by 9 digits
        const phoneRegex = /^(?:254|257)\d{9}$/;

        if (formData.phone && !phoneRegex.test(normalizedPhoneForValidation)) {
          newErrors.phone =
            "Please enter a valid phone number (examples: +254712345678, 0712345678, +257712345678)";
        }

        if (formData.kinNumber) {
          const normalizedKin = normalizeKenyaPhone(formData.kinNumber as string)
          if (!phoneRegex.test(normalizedKin)) {
            newErrors.kinNumber =
              "Please enter a valid phone number (examples: +254712345678, 0712345678)";
          }
        }

        // Student-specific validation: accept either a selected File or an already uploaded URL
        if (formData.student === "yes") {
          if (!formData.schoolIdFile && !formData.schoolIdUrl)
            newErrors.schoolIdFile = "Please upload your school ID picture";
        }
        break;

      case STEPS.ATTENDANCE_LIABILITY:
        if (!formData.attending)
          newErrors.attending = "Please select if you will attend the run";
        if (!formData.confirm)
          newErrors.confirm = "Please confirm the terms and conditions";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.REVIEW) {
        setCurrentStep((s) => {
          const next = (s + 1) as Step;
          // wait for DOM update then scroll form into view
          setTimeout(() => {
            if (formRef.current) {
              formRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            } else {
              // fallback to top of window
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }, 0);
          return next;
        });
      }
    }
  };

  const prevStep = () => {
    if (currentStep > STEPS.PRODUCT_SELECTION) {
      setCurrentStep((s) => {
        const prev = (s - 1) as Step;
        setTimeout(() => {
          if (formRef.current) {
            formRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }, 0);
        return prev;
      });
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
  }, [formData.student, universities]);

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
  // Create order reference using shared generator
  const orderReference = generateOrderReference("LNMB");

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

      // If student uploaded a school ID file, upload it first to Cloudinary
      let schoolIdUrl: string | undefined = undefined;
      if (formData.schoolIdFile) {
        try {
          const uploadForm = new FormData();
          uploadForm.append("file", formData.schoolIdFile);

          const res = await fetch("/api/upload-school-id", {
            method: "POST",
            body: uploadForm,
          });

          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err?.error || "Upload failed");
          }

          const body = await res.json();
          schoolIdUrl = body.url;
        } catch (uploadError) {
          console.error("School ID upload failed", uploadError);
          setErrors({
            general: "Failed to upload school ID. Please try again.",
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Normalize phone and kinNumber before saving order
      const normalizeKenyaPhone = (raw: string | undefined) => {
        if (!raw) return ""
        const digits = (raw || "").replace(/\D/g, "")
        if (digits.startsWith("254") || digits.startsWith("257")) {
          if (digits.length >= 12) return digits.slice(0, 12)
          return digits
        }
        if (digits.length === 10 && digits.startsWith("0")) {
          return `254${digits.slice(1)}`
        }
        if (digits.length === 9) {
          return `254${digits}`
        }
        return digits
      }

  const normalizedPhone = normalizeKenyaPhone(formData.phone as string)
  const normalizedKin = normalizeKenyaPhone(formData.kinNumber as string)

      // Combine types and sizes
      const types = [];
      const sizes = [];
      let totalQuantity = 0;
      
      if (formData.roundSelected) {
        types.push("round");
        sizes.push(`Round: ${formData.roundSize}`);
        totalQuantity += formData.roundQuantity;
      }
      if (formData.poloSelected) {
        types.push("polo");
        sizes.push(`Polo: ${formData.poloSize}`);
        totalQuantity += formData.poloQuantity;
      }

      // Prepare order data for checkout
      const orderData = {
        ...formData,
        tshirtType: types.join(" and "),
        tshirtSize: sizes.join(", "),
        quantity: totalQuantity,
        phone: normalizedPhone,
        kinNumber: normalizedKin,
        // Remove File from the saved order; include uploaded URL if available
        schoolIdFile: undefined,
        schoolIdUrl,
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

  const renderProductCard = (type: "round" | "polo") => {
    const pricing = PRICING[type];
    const isStudent = formData.student === "yes";
    const currentPrice = isStudent ? pricing.student : pricing.regular;
    const isSelected = type === "round" ? formData.roundSelected : formData.poloSelected;
    
    // Set product details based on type
    const imageSrc = type === "round" ? "/images/shop/lnmb 2026 roundneck.webp" : "/images/shop/lnmb 2026 poloshirt.webp";
    const title = type === "round" ? "Round Neck T-shirt" : "Polo Neck T-Shirt";

    return (
      <div className="space-y-4">
        <div
          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
            isSelected
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => handleInputChange(type === "round" ? "roundSelected" : "poloSelected", !isSelected)}
        >
          <div className="relative aspect-square mb-4">
            <Image
              src={imageSrc}
              alt={title}
              fill
              className="object-cover rounded-md"
            />
            {isSelected && (
              <div className="absolute top-2 right-2 bg-blue-600 text-white p-1 rounded-full">
                <Check className="w-4 h-4" />
              </div>
            )}
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
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
                <Badge
                  variant="secondary"
                  className="text-xs bg-green-100 text-green-800"
                >
                  Save KES {(pricing.regular - currentPrice).toLocaleString()}!
                </Badge>
              )}
            </div>
          </div>
        </div>

        {isSelected && (
          <div className="p-4 bg-gray-50 rounded-lg space-y-4 border border-gray-100 animate-in fade-in slide-in-from-top-2">
            <div className="space-y-2">
              <Label className="text-sm">Size *</Label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {["XS", "S", "M", "L", "XL", "XXL", "XXXL"].map((size) => {
                  const currentSize = type === "round" ? formData.roundSize : formData.poloSize;
                  return (
                    <button
                      key={size}
                      type="button"
                      className={`h-8 flex items-center justify-center px-2 text-xs rounded-md border transition-colors leading-none ${
                        currentSize === size
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                      }`}
                      onClick={() => handleInputChange(type === "round" ? "roundSize" : "poloSize", size)}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              {errors[`${type}Size`] && (
                <p className="text-red-500 text-xs">{errors[`${type}Size`]}</p>
              )}
            </div>

            <div className="space-y-2 flex flex-col">
              <Label className="text-sm">Quantity *</Label>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    const field = type === "round" ? "roundQuantity" : "poloQuantity";
                    const currentQty = type === "round" ? formData.roundQuantity : formData.poloQuantity;
                    handleInputChange(field, Math.max(1, currentQty - 1));
                  }}
                >
                  -
                </Button>
                <div className="w-12 text-center text-sm font-semibold">
                  {type === "round" ? formData.roundQuantity : formData.poloQuantity}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    const field = type === "round" ? "roundQuantity" : "poloQuantity";
                    const currentQty = type === "round" ? formData.roundQuantity : formData.poloQuantity;
                    handleInputChange(field, Math.min(5, currentQty + 1));
                  }}
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        )}
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
              🎓 Student discount activated! You saved up to KES 650 per t-shirt.
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
                onChange={(e) =>
                  handleInputChange("university", e.target.value)
                }
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
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {renderProductCard("round")}
          {renderProductCard("polo")}
        </div>
        {errors.productSelection && (
          <p className="text-red-500 text-sm">{errors.productSelection}</p>
        )}
      </div>

      {/* Price Summary */}
      {(formData.roundSelected || formData.poloSelected) && formData.totalAmount > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">Order Summary</p>
              <div className="text-sm text-gray-600">
                {formData.roundSelected && formData.roundQuantity > 0 && (
                  <p>{formData.roundQuantity}x Round Neck ({formData.roundSize || "No size"})</p>
                )}
                {formData.poloSelected && formData.poloQuantity > 0 && (
                  <p>{formData.poloQuantity}x Polo Neck ({formData.poloSize || "No size"})</p>
                )}
              </div>
              {formData.student === "yes" && (
                <p className="text-sm text-green-600 mt-1">
                  Student discount applied
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-800">
                KES {formData.totalAmount.toLocaleString()}
              </p>
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
            <Label htmlFor="schoolId">School ID Picture *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Upload a clear photo of your student ID
              </p>
              <Input
                id="schoolId"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  // Client-side file size check
                  if (file.size > MAX_UPLOAD_BYTES) {
                    setSchoolIdUploadError("File is too large. Maximum size is 5MB.");
                    setIsUploadingSchoolId(false);
                    setUploadProgress(0);
                    // keep the selected file in state briefly so user can see name, but don't start upload
                    handleInputChange("schoolIdFile", file);
                    return;
                  }

                  // Start upload flow: resize client-side, then upload with XHR to show progress
                  handleInputChange("schoolIdFile", file);
                  setIsUploadingSchoolId(true);
                  setSchoolIdUploadError(null);
                  setUploadProgress(0);

                  const reader = new FileReader();
                  reader.onload = async () => {
                    try {
                      const img = document.createElement("img");
                      img.src = reader.result as string;
                      await new Promise<void>((res, rej) => {
                        img.onload = () => res();
                        img.onerror = () => rej(new Error("Image load error"));
                      });

                      // Resize logic: max 1200px on longest edge
                      const maxSize = 1200;
                      let { width, height } = img;
                      if (width > maxSize || height > maxSize) {
                        const ratio = width / height;
                        if (ratio > 1) {
                          width = maxSize;
                          height = Math.round(maxSize / ratio);
                        } else {
                          height = maxSize;
                          width = Math.round(maxSize * ratio);
                        }
                      }

                      const canvas = document.createElement("canvas");
                      canvas.width = width;
                      canvas.height = height;
                      const ctx = canvas.getContext("2d");
                      if (!ctx) throw new Error("Canvas not supported");
                      ctx.drawImage(img, 0, 0, width, height);

                      // Convert to blob (jpeg) at 0.85 quality
                      const blob: Blob | null = await new Promise((resolve) =>
                        canvas.toBlob((b) => resolve(b), "image/jpeg", 0.85),
                      );
                      if (!blob) throw new Error("Failed to create image blob");

                      // Upload via XMLHttpRequest to capture progress
                      const form = new FormData();
                      form.append("file", blob, file.name.replace(/\.[^.]+$/, ".jpg"));

                      const xhr = new XMLHttpRequest();
                      xhr.open("POST", "/api/upload-school-id");

                      xhr.upload.onprogress = (evt) => {
                        if (evt.lengthComputable) {
                          const percent = Math.round((evt.loaded / evt.total) * 100);
                          setUploadProgress(percent);
                        }
                      };

                      xhr.onload = () => {
                        setIsUploadingSchoolId(false);
                        if (xhr.status >= 200 && xhr.status < 300) {
                          try {
                            const body = JSON.parse(xhr.responseText);
                            handleInputChange("schoolIdUrl", body.url);
                            handleInputChange("schoolIdPublicId", body.public_id);
                            // clear local File reference to avoid storing large objects in localStorage draft
                            handleInputChange("schoolIdFile", undefined as unknown as File);
                          } catch {
                            setSchoolIdUploadError("Upload succeeded but response parsing failed");
                          }
                        } else {
                          let errMsg = "Upload failed";
                          try {
                            const body = JSON.parse(xhr.responseText);
                            errMsg = body.error || errMsg;
                          } catch {
                            // ignore parse errors
                          }
                          setSchoolIdUploadError(errMsg);
                        }
                      };

                      xhr.onerror = () => {
                        setIsUploadingSchoolId(false);
                        setSchoolIdUploadError("Upload failed (network error)");
                      };

                      xhr.send(form);
                    } catch (err) {
                      console.error("School ID processing failed", err);
                      setIsUploadingSchoolId(false);
                      setSchoolIdUploadError((err as Error)?.message || "Upload failed");
                    }
                  };
                  reader.readAsDataURL(file);
                }}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("schoolId")?.click()}
              >
                Choose File
              </Button>
              {formData.schoolIdFile && (
                <p className="text-sm text-green-600 mt-2">
                  File selected: {formData.schoolIdFile.name}
                </p>
              )}
              {formData.schoolIdUrl && (
                <div className="mt-3 flex items-center space-x-3">
                  <Image
                    src={formData.schoolIdUrl as string}
                    alt="Uploaded school ID"
                    width={64}
                    height={64}
                    unoptimized
                    className="w-16 h-16 object-cover rounded-md border"
                  />
                  <div className="text-sm">
                    <p className="font-medium">School ID uploaded</p>
                    {isUploadingSchoolId ? (
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">Uploading... {uploadProgress}%</div>
                        <progress
                          value={uploadProgress}
                          max={100}
                          className="w-40 h-2 rounded-full overflow-hidden"
                        />
                      </div>
                    ) : schoolIdUploadError ? (
                      <p className="text-xs text-red-500">{schoolIdUploadError}</p>
                    ) : (
                      <p className="text-xs text-gray-500">Tap &quot;Choose File&quot; to replace</p>
                    )}
                  </div>
                </div>
              )}
              {/* If a file is selected but not yet uploaded (e.g., too large or waiting), show progress or message */}
              {formData.schoolIdFile && !formData.schoolIdUrl && (
                <div className="mt-2">
                  {schoolIdUploadError ? (
                    <p className="text-xs text-red-500">{schoolIdUploadError}</p>
                  ) : isUploadingSchoolId ? (
                    <div className="flex items-center space-x-3">
                      <progress
                        value={uploadProgress}
                        max={100}
                        className="w-40 h-2 rounded-full overflow-hidden"
                      />
                      <div className="text-xs text-gray-500">{uploadProgress}%</div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">Selected: {formData.schoolIdFile.name}</p>
                  )}
                </div>
              )}
            </div>
            {errors.schoolIdFile && (
              <p className="text-red-500 text-sm">{errors.schoolIdFile}</p>
            )}
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
              placeholder="000000000"
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
            <Label htmlFor="nameOfKin">Next of Kin Name (Optional)</Label>
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
            <Label htmlFor="kinNumber">
              Next of Kin Phone Number (Optional)
            </Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                +254
              </span>
              <Input
                id="kinNumber"
                value={formData.kinNumber}
                onChange={(e) => handleInputChange("kinNumber", e.target.value)}
                placeholder="000000000"
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
          onChange={(e) =>
            handleInputChange("medicalCondition", e.target.value)
          }
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
          onValueChange={(value: string) =>
            handleInputChange("attending", value)
          }
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
          Please review your order details below. You can go back to make
          changes or proceed to payment.
        </AlertDescription>
      </Alert>

      {/* Order Summary */}
      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
        <h4 className="font-semibold text-lg">Order Summary</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-semibold text-gray-800 mb-2">
              Product Details
            </h5>
            <div className="space-y-1 text-sm">
                {formData.roundSelected && (
                  <p>
                    <strong>Round Neck:</strong> {formData.roundQuantity}x (Size {formData.roundSize})
                  </p>
                )}
                {formData.poloSelected && (
                  <p>
                    <strong>Polo Neck:</strong> {formData.poloQuantity}x (Size {formData.poloSize})
                  </p>
                )}
              <p>
                <strong>Student:</strong>{" "}
                {formData.student === "yes" ? "Yes" : "No"}
              </p>
              {formData.student === "yes" && formData.university && (
                <p>
                  <strong>University:</strong> {formData.university}
                </p>
              )}
            </div>
          </div>

          <div>
            <h5 className="font-semibold text-gray-800 mb-2">
              Contact Information
            </h5>
            <div className="space-y-1 text-sm">
              <p>
                <strong>Name:</strong> {formData.name}
              </p>
              <p>
                <strong>Email:</strong> {formData.email}
              </p>
              <p>
                <strong>Phone:</strong> +254{formData.phone}
              </p>
              <p>
                <strong>Next of Kin:</strong> {formData.nameOfKin} (+254
                {formData.kinNumber})
              </p>
              <p>
                <strong>Medical Condition:</strong> {formData.medicalCondition}
              </p>
              {formData.pickUp && (
                <p>
                  <strong>Pickup:</strong>{" "}
                  {formData.pickUp
                    .replace("-", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </p>
              )}
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
              {formData.roundSelected && formData.roundQuantity > 0 && (
                <p>
                  {formData.roundQuantity}x Round Neck @ KES {getUnitPrice("round", formData.student === "yes").toLocaleString()} each
                </p>
              )}
              {formData.poloSelected && formData.poloQuantity > 0 && (
                <p>
                  {formData.poloQuantity}x Polo Neck @ KES {getUnitPrice("polo", formData.student === "yes").toLocaleString()} each
                </p>
              )}
              {formData.student === "yes" && (
                <p className="text-green-600">Student discount applied</p>
              )}
              <p>
                <strong>Attendance:</strong>{" "}
                {formData.attending === "attending"
                  ? "Will attend"
                  : "T-shirt only"}
              </p>
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
    <div ref={formRef} className="max-w-4xl mx-auto">
      {renderStepIndicator()}

      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-600">
            {STEP_TITLES[currentStep]}
          </CardTitle>
          <CardDescription>
            {currentStep === STEPS.PRODUCT_SELECTION &&
              "Choose your t-shirt design, size, and student status"}
            {currentStep === STEPS.PERSONAL_DETAILS &&
              "Fill in your personal details and emergency contact"}
            {currentStep === STEPS.ATTENDANCE_LIABILITY &&
              "Confirm your participation and accept terms"}
            {currentStep === STEPS.REVIEW &&
              "Review your order before proceeding to payment"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">{renderStepContent()}</CardContent>
      </Card>

      {renderNavigation()}
    </div>
  );
}
