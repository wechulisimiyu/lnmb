"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { PRICING } from "./pricing";
import React, { useState, useEffect } from "react";
import { useCart } from "./cart-context";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";

interface Product {
  id: string;
  name: string;
  price: number;
  studentPrice: number;
  image: string;
  description: string;
  sizes?: string[];
}

export function ShopProducts() {
  const cart = useCart();

  const products = [
    {
      id: "polo",
      name: "Polo Neck T-Shirt",
      price: PRICING.polo.regular,
      studentPrice: PRICING.polo.student,
      image: "/images/shop/lnmb 2026 poloshirt.webp",
      description: "Classic polo neck with embroidered logo",
      sizes: ["M", "L", "XL"],
    },
    {
      id: "round",
      name: "Round Neck T-Shirt",
      price: PRICING.round.regular,
      studentPrice: PRICING.round.student,
      image: "/images/shop/lnmb 2026 roundneck.webp",
      description: "Comfortable round neck tee",
      sizes: ["M", "L", "XL"],
    },
  ];

  const [selectedSize, setSelectedSize] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState<Record<string, number>>({});
  const [isStudent, setIsStudent] = useState<boolean>(false);
  const [universities, setUniversities] = useState<string[] | null>(null);
  const [uniQuery, setUniQuery] = useState("");
  const [showManualUniversity, setShowManualUniversity] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<string>("");
  const [salesAgent, setSalesAgent] = useState<Record<string, string>>({});

  // Lazy-load universities when the user toggles student = true
  useEffect(() => {
    let mounted = true;
    if (isStudent && universities === null) {
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
  }, [isStudent, universities]);

  const handleAdd = (product: Product) => {
    // Validation: if student is selected, university must be selected
    if (isStudent && !selectedUniversity) {
      alert("Please select your university before adding items to cart.");
      return;
    }

    const size = selectedSize[product.id] || product.sizes?.[0] || "One Size";
    const qty = quantity[product.id] || 1;
    const studentFlag = isStudent || false;
    const unitPrice = getProductPrice(product);

    // Prepare university data for cart item
    const universityData = selectedUniversity
      ? showManualUniversity
        ? `Other: ${selectedUniversity}`
        : selectedUniversity
      : undefined;

    const agent = salesAgent[product.id]?.trim();

    cart.addItem({
      id: product.id,
      name: product.name,
      price: unitPrice,
      image: product.image,
      size,
      quantity: qty,
      student: studentFlag,
      university: universityData,
      salesAgent: agent ? agent : undefined,
    });
    setQuantity((s) => ({ ...s, [product.id]: 1 }));
    setSalesAgent((s) => ({ ...s, [product.id]: "" }));
    setSelectedSize((s) => {
      const draft = { ...s };
      delete draft[product.id];
      return draft;
    });
  };

  // Reset university selection when student status changes
  useEffect(() => {
    if (!isStudent) {
      setSelectedUniversity("");
      setShowManualUniversity(false);
    }
  }, [isStudent]);

  // Helper function to get the current price based on student status
  const getProductPrice = (product: Product) => {
    return isStudent ? product.studentPrice : product.price;
  };

  // Helper function to format price display
  const formatPriceDisplay = (product: Product) => {
    const currentPrice = getProductPrice(product);
    const originalPrice = product.price;

    if (isStudent && currentPrice < originalPrice) {
      return (
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-blue-600">
            KES {currentPrice}
          </span>
          <span className="text-lg text-slate-400 line-through">
            KES {originalPrice}
          </span>
          <Badge
            variant="secondary"
            className="text-xs bg-green-100 text-green-800"
          >
            Student Discount
          </Badge>
        </div>
      );
    }

    return (
      <span className="text-2xl font-bold text-blue-600">
        KES {currentPrice}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-6 p-4 bg-white rounded shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:gap-6">
          <div className="flex flex-col gap-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={isStudent}
                onChange={(e) => setIsStudent(e.target.checked)}
                className="mr-2"
              />
              <span className="font-medium">I am a student</span>
            </label>
            {isStudent && (
              <p className="text-sm text-green-600">
                🎓 Student discount applied! Save up to KES 1000 per item.
              </p>
            )}
          </div>
          <div className="flex-1 mt-3 md:mt-0">
            {isStudent && (
              <div>
                {!universities ? (
                  <div className="text-sm text-gray-500">
                    Loading universities...
                  </div>
                ) : (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full text-left justify-start"
                      >
                        {selectedUniversity
                          ? showManualUniversity
                            ? `${selectedUniversity} (Manual entry)`
                            : selectedUniversity
                          : "Select your university *"}
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
                            {universities
                              .filter(
                                (u) =>
                                  !uniQuery ||
                                  u
                                    .toLowerCase()
                                    .includes(uniQuery.toLowerCase()),
                              )
                              .slice(0, 50)
                              .map((u) => (
                                <CommandItem
                                  key={u}
                                  value={u}
                                  onSelect={() => {
                                    setSelectedUniversity(u);
                                    setShowManualUniversity(false);
                                    setUniQuery("");
                                  }}
                                >
                                  {u}
                                </CommandItem>
                              ))}
                            <CommandItem
                              value="__manual__"
                              onSelect={() => {
                                setShowManualUniversity(true);
                                setSelectedUniversity("");
                                setUniQuery("");
                              }}
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
                  <div className="mt-2">
                    <Input
                      placeholder="Type your university"
                      value={selectedUniversity}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setSelectedUniversity(e.target.value);
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:gap-8 md:grid-cols-2 mb-12 sm:mb-16">
        {products.map((product) => (
          <div
            key={product.id}
            className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <div className="relative overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                width={600}
                height={400}
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900 mb-2">
                    Size *
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {(product.sizes ?? ["One Size"]).map((size) => (
                      <button
                        key={size}
                        onClick={() =>
                          setSelectedSize((s) => ({ ...s, [product.id]: size }))
                        }
                        className={`h-10 flex items-center justify-center rounded-md border transition-colors ${
                          selectedSize[product.id] === size
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900 mb-2">
                    Quantity *
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-10 w-10 p-0"
                      onClick={() =>
                        setQuantity((s) => ({
                          ...s,
                          [product.id]: Math.min(99, Math.max(1, (s[product.id] || 1) - 1)),
                        }))
                      }
                      disabled={(quantity[product.id] || 1) <= 1}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      min={1}
                      max={99}
                      value={quantity[product.id] || 1}
                      onChange={(e) => {
                        const v = parseInt(e.target.value) || 1;
                        setQuantity((s) => ({
                          ...s,
                          [product.id]: Math.min(99, Math.max(1, v)),
                        }));
                      }}
                      className="w-16 h-10 text-center"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-10 w-10 p-0"
                      onClick={() =>
                        setQuantity((s) => ({
                          ...s,
                          [product.id]: Math.min(99, Math.max(1, (s[product.id] || 1) + 1)),
                        }))
                      }
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    className={`w-full h-12 text-base ${
                      !selectedSize[product.id]
                        ? "bg-slate-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white`}
                    disabled={!selectedSize[product.id]}
                    onClick={() => {
                      if (selectedSize[product.id]) handleAdd(product);
                    }}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <p className="text-sm font-semibold text-slate-900 mb-2">
                    Assisted by (Optional)
                  </p>
                  <Input
                    placeholder="Sales agent name"
                    value={salesAgent[product.id] || ""}
                    onChange={(e) =>
                      setSalesAgent((s) => ({
                        ...s,
                        [product.id]: e.target.value,
                      }))
                    }
                    className="h-11"
                  />
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    If a sales agent helped you with your order, enter their name here
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <div className="flex flex-col">
                    {formatPriceDisplay(product)}
                    {isStudent && (
                      <span className="text-xs text-green-600 mt-1">
                        Save KES {product.price - product.studentPrice}!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShopProducts;
