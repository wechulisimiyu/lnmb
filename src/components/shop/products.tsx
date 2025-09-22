"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star } from "lucide-react"
import Image from "next/image"
import React, { useState, useEffect } from "react"
import { useCart } from "./cart-context"
import { Input } from "@/components/ui/input"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Command, CommandInput, CommandList, CommandGroup, CommandItem, CommandEmpty } from "@/components/ui/command"

export function ShopProducts() {
  const cart = useCart();

  const products = [
    {
      id: "polo",
      name: "Polo Neck T-Shirt",
      price: 1500,
      image: "/images/shop/lnmb-tshirt-2025.webp",
      description: "Classic polo neck with embroidered logo",
      sizes: ["S", "M", "L", "XL"],
    },
    {
      id: "round",
      name: "Round Neck T-Shirt",
      price: 1200,
      image: "/images/shop/lnmb-tshirt-2025.webp",
      description: "Comfortable round neck tee",
      sizes: ["S", "M", "L", "XL"],
    },
  ];

  const [selectedSize, setSelectedSize] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState<Record<string, number>>({});
  const [isStudent, setIsStudent] = useState<boolean>(false);
  const [universities, setUniversities] = useState<string[] | null>(null);
  const [uniQuery, setUniQuery] = useState("");
  const [showManualUniversity, setShowManualUniversity] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<string>("");

  // Lazy-load universities when the user toggles student = true
  useEffect(() => {
    let mounted = true;
    if (isStudent && universities === null) {
      import("@/data/universities.json")
        .then((mod) => {
          if (!mounted) return;
          const list = Array.isArray(mod.default || mod) ? (mod.default || mod) : [];
          setUniversities(list as string[]);
        })
        .catch((err) => {
          console.error("Failed to load universities list", err);
          setUniversities([]);
        });
    }
    return () => { mounted = false; };
  }, [isStudent]);

  const handleAdd = (product: any) => {
    const size = selectedSize[product.id] || product.sizes[0];
    const qty = quantity[product.id] || 1;
    const studentFlag = isStudent || false;
    const unitPrice = studentFlag ? (product.id === 'polo' ? 1000 : 600) : product.price;
    cart.addItem({ id: product.id, name: product.name, price: unitPrice, image: product.image, size, quantity: qty, student: studentFlag, university: selectedUniversity || undefined });
    setQuantity((s) => ({ ...s, [product.id]: 1 }));
  };

  return (
    <div>
      <div className="mb-6 p-4 bg-white rounded shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:gap-6">
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center">
              <input type="checkbox" checked={isStudent} onChange={(e) => setIsStudent(e.target.checked)} className="mr-2" />
              <span className="font-medium">I am a student</span>
            </label>
          </div>
          <div className="flex-1 mt-3 md:mt-0">
            {isStudent && (
              <div>
                {!universities ? (
                  <div>Loading universities...</div>
                ) : (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full text-left">
                        {selectedUniversity ? selectedUniversity : (showManualUniversity ? 'Manual entry' : 'Select your university')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search university..." value={uniQuery} onValueChange={(v: string) => setUniQuery(v)} />
                        <CommandList>
                          <CommandEmpty>No university found.</CommandEmpty>
                          <CommandGroup>
                            {universities.filter(u => !uniQuery || u.toLowerCase().includes(uniQuery.toLowerCase())).slice(0,50).map(u => (
                              <CommandItem key={u} value={u} onSelect={() => { setSelectedUniversity(u); setShowManualUniversity(false); setUniQuery(''); }}>
                                {u}
                              </CommandItem>
                            ))}
                            <CommandItem value="__manual__" onSelect={() => { setShowManualUniversity(true); setSelectedUniversity(''); setUniQuery(''); }}>My university isn't listed</CommandItem>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}

                {showManualUniversity && (
                  <div className="mt-2">
                    <Input placeholder="Type your university" value={selectedUniversity} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedUniversity(e.target.value)} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:gap-8 md:grid-cols-2 mb-12 sm:mb-16">
        {products.map((product) => (
          <div key={product.id} className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300">
            <div className="relative overflow-hidden">
              <Image src={product.image} alt={product.name} width={600} height={400} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>

            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{product.description}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900 mb-2">Size:</p>
                  <div className="flex gap-2">
                    {product.sizes.map((size) => (
                      <button key={size} onClick={() => setSelectedSize((s) => ({ ...s, [product.id]: size }))} className={`px-3 py-1 rounded ${selectedSize[product.id] === size ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-blue-600">KES {product.price}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input aria-label={`quantity-${product.id}`} type="number" min={1} value={quantity[product.id] || 1} onChange={(e) => setQuantity((s) => ({ ...s, [product.id]: Math.max(1, parseInt(e.target.value || '1')) }))} className="w-20 p-1 border rounded" />
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleAdd(product)}>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ShopProducts